import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table, TableProps } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { basename, dirname, join, relative } from "path";

export class LocalInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** Lambda Functions for different services */
    new HotReloadedLambda(this, "clinic-service-lambda", {
      entry: join(__dirname, "../../pets-core-services/src/clinic-service/lambdas/clinics.ts"),
      functionName: process.env.CLINIC_SERVICE_LAMBDA_NAME,
    });

    new HotReloadedLambda(this, "applicant-service-lambda", {
      entry: join(
        __dirname,
        "../../pets-core-services/src/applicant-service/lambdas/applicants.ts",
      ),
      functionName: process.env.APPLICANT_SERVICE_LAMBDA_NAME,
    });

    new HotReloadedLambda(this, "application-service-lambda", {
      entry: join(
        __dirname,
        "../../pets-core-services/src/application-service/lambdas/application.ts",
      ),
      functionName: process.env.APPLICATION_SERVICE_LAMBDA_NAME,
    });

    /**API Gateway */
    const swaggerSpecPath = join(__dirname, "../../pets-core-services/openapi-docs.json");

    // Create API Gateway from Swagger
    const apiGateway = new SpecRestApi(this, "local-api-gateway", {
      apiDefinition: ApiDefinition.fromAsset(swaggerSpecPath),
      deployOptions: {
        stageName: process.env.API_GATEWAY_STAGE,
      },
    });

    Tags.of(apiGateway).add("_custom_id_", process.env.API_GATEWAY_NAME || "");

    /** DynamoDB for different services */
    const tableProps: TableProps = {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
    };

    new Table(this, "clinic-service-table", {
      ...tableProps,
      tableName: process.env.CLINIC_SERVICE_DATABASE_NAME,
    });

    const applicantServiceDb = new Table(this, "applicant-service-table", {
      ...tableProps,
      tableName: process.env.APPLICANT_SERVICE_DATABASE_NAME,
    });

    applicantServiceDb.addGlobalSecondaryIndex({
      indexName: process.env.PASSPORT_ID_INDEX || "",
      partitionKey: {
        name: "passportId",
        type: AttributeType.STRING,
      },
    });

    new Table(this, "application-service-table", {
      ...tableProps,
      tableName: process.env.APPLICATION_SERVICE_DATABASE_NAME,
    });
  }
}

class HotReloadedLambda extends Function {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    const hotReloadBucket = Bucket.fromBucketName(scope, `HotReloadingBucket-${id}`, "hot-reload");

    if (!props.entry) throw new Error("Entry point is required");

    const fileName = basename(props.entry, ".ts");

    const repoRoot = join(__dirname, "../../");
    const buildRoot = join(__dirname, "../build");
    const relativePath = relative(repoRoot, dirname(props.entry));
    const codePath = join(buildRoot, relativePath);

    super(scope, id, {
      functionName: props.functionName,
      code: Code.fromBucket(hotReloadBucket, codePath),
      runtime: Runtime.NODEJS_18_X,
      handler: `${fileName}.handler`,
      environment: {
        NODE_EXTRA_CA_CERTS: "/var/runtime/ca-cert.pem",
      },
    });
  }
}
