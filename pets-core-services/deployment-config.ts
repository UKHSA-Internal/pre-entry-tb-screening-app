import { join } from "path";

import { getEnvironmentVariable } from "./src/shared/config";

type DeploymentConfig = {
  lambdaName: string;
  s3Bucket: string;
  path: string;
};

const config: DeploymentConfig[] = [
  {
    lambdaName: getEnvironmentVariable("CLINIC_SERVICE_LAMBDA_NAME"),
    s3Bucket: getEnvironmentVariable("CLINIC_SERVICE_LAMBDA_BUCKET"),
    path: join(__dirname, "./src/clinic-service/lambdas/clinics.ts"),
  },
  {
    lambdaName: getEnvironmentVariable("APPLICANT_SERVICE_LAMBDA_NAME"),
    s3Bucket: getEnvironmentVariable("APPLICANT_SERVICE_LAMBDA_BUCKET"),
    path: join(__dirname, "./src/applicant-service/lambdas/applicants.ts"),
  },
];

// eslint-disable-next-line no-console
console.log(JSON.stringify(config, null, 2)); // exporting to stdout
