import { swaggerConfig as applicantServiceSwaggerConfig } from "../applicant-service/lambdas/applicants";
import { swaggerConfig as clinicServiceSwaggerConfig } from "../clinic-service/lambdas/clinics";
import { writeApiDocumentation } from "./generator";

writeApiDocumentation([clinicServiceSwaggerConfig, applicantServiceSwaggerConfig]);
