import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { ImageType } from "../types/enums";

const DICOM_FOLDER = "dicom";
const APPLICANT_PHOTOS_FOLDER = "photos";

export type KeyParameters = {
  applicant: Applicant;
  clinicId: string;
  fileName: string;
  imageType: ImageType;
  applicationId: string;
};

// export type PhotoKeyParameters = {
//   applicant: Applicant;
//   clinicId: string;
//   fileName: string;
//   applicationId: string;
// };
export const generateImageObjectkey = (keyParameters: KeyParameters) => {
  const { clinicId, applicant, fileName, imageType, applicationId } = keyParameters;
  logger.info({ clinicId, fileName, applicationId }, "Generating Image object key");

  const countryOfIssue = applicant.countryOfIssue;
  const passportNumber = applicant.passportNumber;

  const clinicIDFormatted = clinicId.replaceAll("/", "-");

  let objectkey;
  switch (imageType) {
    case ImageType.Dicom:
      objectkey = `${DICOM_FOLDER}/${clinicIDFormatted}/${countryOfIssue}/${passportNumber}/${applicationId}/${fileName}`;
      break;
    case ImageType.Photo:
      objectkey = `${APPLICANT_PHOTOS_FOLDER}/${clinicIDFormatted}/${countryOfIssue}/${passportNumber}/${applicationId}/${fileName}`;
      break;
  }
  logger.info("Image object key generated successfully");
  return objectkey;
};

// export const generatePhotoObjectkey = (keyParameters: PhotoKeyParameters) => {
//   const { clinicId, applicant, fileName, applicationId } = keyParameters;
//   logger.info({ applicationId }, "Generating Applicant Photo object key");

//   const countryOfIssue = applicant.countryOfIssue;
//   const passportNumber = applicant.passportNumber;

//   const clinicIDFormatted = clinicId.replaceAll("/", "-");

//   const objectkey = `${APPLICANT_PHOTOS_FOLDER}/${clinicIDFormatted}/${countryOfIssue}/${passportNumber}/${applicationId}/${fileName}`; //need it for the QA journey
//   logger.info("Applicant photo object key generated successfully");
//   return objectkey;
// };
