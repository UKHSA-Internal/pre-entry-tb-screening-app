import { join } from "path";

type DeploymentConfig = {
  lambdaName?: string;
  s3Bucket?: string;
  path: string;
};

const config: DeploymentConfig[] = [
  {
    lambdaName: process.env.CLINIC_SERVICE_LAMBDA_NAME,
    s3Bucket: process.env.CLINIC_SERVICE_LAMBDA_BUCKET,
    path: join(__dirname, "./src/clinic-service/lambdas/clinics.ts"),
  },
  {
    lambdaName: process.env.APPLICANT_SERVICE_LAMBDA_NAME,
    s3Bucket: process.env.APPLICANT_SERVICE_LAMBDA_BUCKET,
    path: join(__dirname, "./src/applicant-service/lambdas/applicants.ts"),
  },
  {
    lambdaName: process.env.APPLICATION_SERVICE_LAMBDA_NAME,
    s3Bucket: process.env.APPLICATION_SERVICE_LAMBDA_BUCKET,
    path: join(__dirname, "./src/application-service/lambdas/application.ts"),
  },
  {
    lambdaName: process.env.AUTHORISER_LAMBDA_NAME,
    s3Bucket: process.env.APPLICATION_SERVICE_LAMBDA_BUCKET,
    path: join(__dirname, "./src/authoriser/b2c-authoriser.ts"),
  },
];

// eslint-disable-next-line no-console
console.log(JSON.stringify(config, null, 2)); // exporting to stdout
