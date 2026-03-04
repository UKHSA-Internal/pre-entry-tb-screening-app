import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { ImageType } from "../types/enums";

const DICOM_FOLDER = "dicom";
export const APPLICANT_PHOTOS_FOLDER = "photos";

export type KeyParameters = {
  passportNumber: string;
  countryOfIssue: CountryCode;
  clinicId: string;
  fileName: string;
  imageType: ImageType;
  applicationId: string;
};

export const generateImageObjectkey = (keyParameters: KeyParameters) => {
  const { clinicId, passportNumber, countryOfIssue, fileName, imageType, applicationId } =
    keyParameters;
  logger.info({ clinicId, fileName, applicationId }, "Generating Image object key");

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
