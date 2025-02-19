import { routes as applicantServiceRoutes } from "../applicant-service/lambdas/applicants";
import { routes as ApplicationServiceRoutes } from "../application-service/lambdas/application";
import { routes as clinicServiceRoutes } from "../clinic-service/lambdas/clinics";
import { assertEnvExists } from "../shared/config";
import { writeApiDocumentation } from "./generator";
import { SwaggerConfig } from "./types";

const awsAccountId = assertEnvExists(process.env.AWS_ACCOUNT_ID);

const clinicServiceLambda = assertEnvExists(process.env.CLINIC_SERVICE_LAMBDA_NAME);
export const clinicServiceSwaggerConfig: SwaggerConfig = {
  lambdaArn: `arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:${awsAccountId}:function:${clinicServiceLambda}/invocations`,
  routes: clinicServiceRoutes,
  tags: ["Clinic Service Endpoints"],
};

const applicantServiceLambda = assertEnvExists(process.env.APPLICANT_SERVICE_LAMBDA_NAME);
export const applicantServiceSwaggerConfig: SwaggerConfig = {
  lambdaArn: `arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:${awsAccountId}:function:${applicantServiceLambda}/invocations`,
  routes: applicantServiceRoutes,
  tags: ["Applicant Service Endpoints"],
};

const applicationServiceLambda = assertEnvExists(process.env.APPLICATION_SERVICE_LAMBDA_NAME);
export const applicationServiceSwaggerConfig: SwaggerConfig = {
  lambdaArn: `arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:${awsAccountId}:function:${applicationServiceLambda}/invocations`,
  routes: ApplicationServiceRoutes,
  tags: ["Application Service Endpoints"],
};

writeApiDocumentation([
  clinicServiceSwaggerConfig,
  applicantServiceSwaggerConfig,
  applicationServiceSwaggerConfig,
]);
