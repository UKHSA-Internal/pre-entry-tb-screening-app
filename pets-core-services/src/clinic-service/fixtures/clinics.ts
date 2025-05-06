import { NewClinic } from "../models/clinics";
import { readClinicsFile, validateClinicsDataString } from "../utils/validation";

// Setting file path, an ENV variable could be used for this
const filePath = "src/clinic-service/fixtures/test-file.json";

export const seededClinics: NewClinic[] = validateClinicsDataString(readClinicsFile(filePath));
