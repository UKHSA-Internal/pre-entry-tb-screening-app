import { swaggerConfig } from "../clinic-service/lambdas/clinics";
import { writeApiDocumentation } from "./generator";

writeApiDocumentation([swaggerConfig]);
