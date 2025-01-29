import { coreServices } from "../../../pets-config.mjs";
import { routes as applicantServiceRoutes } from "../applicant-service/lambdas/applicants";
import { routes as clinicServiceRoutes } from "../clinic-service/lambdas/clinics";
import { getEnvironmentVariable } from "../shared/config";
import { writeApiDocumentation } from "./generator";
import { SwaggerConfig } from "./types";

const awsAccountId = getEnvironmentVariable("AWS_ACCOUNT_ID");

const clinicServiceLambda = coreServices.clinicService.lambdaName;
export const clinicServiceSwaggerConfig: SwaggerConfig = {
  lambdaArn: `arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:${awsAccountId}:function:${clinicServiceLambda}/invocations`,
  routes: clinicServiceRoutes,
  tags: ["Clinic Service Endpoints"],
};

const applicantServiceLambda = coreServices.applicantService.lambdaName;
export const applicantServiceSwaggerConfig: SwaggerConfig = {
  lambdaArn: `arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:${awsAccountId}:function:${applicantServiceLambda}/invocations`,
  routes: applicantServiceRoutes,
  tags: ["Applicant Service Endpoints"],
};

writeApiDocumentation([clinicServiceSwaggerConfig, applicantServiceSwaggerConfig]);
