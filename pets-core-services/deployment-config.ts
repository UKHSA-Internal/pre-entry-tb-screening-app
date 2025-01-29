import { join } from "path";

const config = [
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
];

// TODO: Add typings for config after you upload to bucket successfully
// eslint-disable-next-line no-console
console.log(JSON.stringify(config, null, 2)); // exporting to stdout
