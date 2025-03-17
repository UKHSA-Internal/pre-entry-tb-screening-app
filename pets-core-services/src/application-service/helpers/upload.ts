import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";

const DICOM_FOLDER = "dicom";

export type KeyParameters = {
  applicant: Applicant;
  clinicId: string;
  fileName: string;
  applicationId: string;
};

export const generateDicomObjectkey = (keyParameters: KeyParameters) => {
  const { clinicId, applicant, fileName, applicationId } = keyParameters;
  logger.info({ clinicId, fileName, applicationId }, "Generating Dicom object key");

  const countryOfIssue = applicant.countryOfIssue; // TODO: Inform platform about another dynamodb changes
  const passportNumber = applicant.passportNumber;

  const clinicIDFormatted = clinicId.replaceAll("/", "-");

  const objectkey = `${DICOM_FOLDER}/${clinicIDFormatted}/${countryOfIssue}/${passportNumber}/${applicationId}/${fileName}`; // TODO: Document esbuild thingy with Envs and also we depend on the aws sdk in runtime
  logger.info("Dicom object key generated successfully");
  return objectkey;
};
