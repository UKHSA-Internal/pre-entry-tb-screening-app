import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table, TableProps } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class LocalInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** Lambda Functions for different services */
    new NodejsFunction(this, "clinic-service-lambda", {
      entry: join(__dirname, "../../pets-core-services/src/clinic-service/lambdas/clinics.ts"),
      functionName: process.env.CLINIC_SERVICE_LAMBDA_NAME,
    });

    new NodejsFunction(this, "applicant-service-lambda", {
      entry: join(__dirname, "../../pets-core-services/src/clinic-service/lambdas/clinics.ts"),
      functionName: process.env.APPLICANT_SERVICE_LAMBDA_NAME,
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

    new Table(this, "applicant-service-table", {
      ...tableProps,
      tableName: process.env.APPLICANT_SERVICE_LAMBDA_NAME,
    });
  }
}
