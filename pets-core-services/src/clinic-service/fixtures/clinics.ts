import { NewClinic } from "../models/clinics";
import { readClinicsFile, validateClinicsDataString } from "../utils/validation";

// TODO: move it to env var
const filePath = "src/clinic-service/fixtures/test-file.json";

export const seededClinics: NewClinic[] = validateClinicsDataString(readClinicsFile(filePath));
