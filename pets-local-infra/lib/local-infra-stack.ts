import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table, TableProps } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { basename, dirname, join, posix, relative, sep } from "path";
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

    new HotReloadedLambda(this, "integration-service-lambda", {
      entry: join(
        __dirname,
        // "../../pets-core-services/src/edap-integration-service/lambdas/edap-integration.ts",
        "../../pets-core-services/src/edap-integration-service/handlers/process-db-streams.ts",
      ),
      functionName: process.env.EDAP_INTEGRATION_LAMBDA_NAME,
    });

    new HotReloadedLambda(this, "authoriser-lambda", {
      entry: join(__dirname, "../../pets-core-services/src/authoriser/b2c-authoriser.ts"),
      functionName: process.env.AUTHORISER_LAMBDA_NAME,
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

    Tags.of(apiGateway).add("_custom_id_", process.env.API_GATEWAY_ID || "");

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

    new Bucket(this, "image-bucket", {
      bucketName: process.env.IMAGE_BUCKET,
      cors: [
        {
          allowedMethods: [
            HttpMethods.PUT,
            HttpMethods.DELETE,
            HttpMethods.POST,
            HttpMethods.GET,
            HttpMethods.HEAD,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    const edapDLQ = new Queue(this, "edap-integration-dlq", {
      queueName: process.env.EDAP_INTEGRATION_DLQ_NAME,
    });

    new Queue(this, "integration-lambda", {
      queueName: process.env.EDAP_INTEGRATION_QUEUE_NAME,
      deadLetterQueue: {
        queue: edapDLQ,
        maxReceiveCount: 3,
      },
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
    let codePath = join(buildRoot, relativePath);

    if (process.platform == "win32") {
      codePath = codePath.split(sep).join(posix.sep).replace("C:", "/mnt/c");
    }

    super(scope, id, {
      functionName: props.functionName,
      code: Code.fromBucket(hotReloadBucket, codePath),
      runtime: Runtime.NODEJS_20_X,
      handler: `${fileName}.handler`,
      environment: {
        NODE_EXTRA_CA_CERTS: "/var/runtime/ca-cert.pem",
      },
    });
  }
}
