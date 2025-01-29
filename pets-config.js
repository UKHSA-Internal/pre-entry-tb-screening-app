export const coreServices = {
  clinicService: {
    lambdaName: "clinic-service-lambda",
    path: "src/clinic-service/lambdas/clinics.ts", // relative to pets-core-services folder
  },
  applicantService: {
    lambdaName: "applicant-service-lambda",
    path: "src/applicant-service/lambdas/applicants.ts", // relative to pets-core-services folder
  },
};

const coreServicesDeployConfig = Object.values(coreServices);

const config = {
  coreServices,
  coreServicesDeployConfig,
};

console.log(JSON.stringify(config, null, 2)); // exporting to stdout
export default config; // export for JS callers
