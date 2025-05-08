import dicomParser from "dicom-parser";

import { FileType } from "./enums";

export type ValidationType = {
  isValid: boolean;
  fileName: string;
  message: string;
};

export type ValidationResult = {
  errors: ValidationType[];
};

export const getFileType = (file: File): "photo" | "dicom" | undefined => {
  const photoFile =
    file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".png");
  const dicomFile = file.name.endsWith(".dcm");
  if (photoFile) {
    return "photo";
  } else if (dicomFile) {
    return "dicom";
  }
};

// use dicom-parser to check file encryption
const isDicomValid = async (file: File): Promise<boolean> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    dicomParser.parseDicom(byteArray);
    return true;
  } catch {
    return false; // corrupted or encrypted
  }
};

// check valid photo file
const isPhotoValid = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // Loaded successfully
    img.onerror = () => resolve(false); // Not a valid image

    const url = URL.createObjectURL(file);
    img.src = url;
  });
};

const validateFiles = async (files: File[], type: FileType): Promise<ValidationResult> => {
  const errors: ValidationType[] = [];

  const maxPhotoBytes = 10 * 1024 * 1024;
  const maxDicomBytes = 50 * 1024 * 1024;

  await Promise.all(
    files.map(async (file) => {
      const fileType = getFileType(file);
      const fileSize = file.size;

      // Check file type is supported
      if (type === FileType.dicom && fileType !== "dicom") {
        errors.push({
          isValid: false,
          fileName: file.name,
          message: "The selected file must be a DICOM file",
        });
      } else if (type === FileType.photo && fileType !== "photo") {
        errors.push({
          isValid: false,
          fileName: file.name,
          message: "The selected file must be a JPG, JPEG or PNG",
        });
      }

      // Check file size
      if (fileType === FileType.dicom && fileSize > maxDicomBytes) {
        errors.push({
          isValid: false,
          fileName: file.name,
          message: "The selected file must be smaller than 50MB",
        });
      } else if (fileType === FileType.photo && fileSize > maxPhotoBytes) {
        errors.push({
          isValid: false,
          fileName: file.name,
          message: "The selected file must be smaller than 10MB",
        });
      }

      // Check if file is empty
      if (fileSize === 0) {
        errors.push({
          isValid: false,
          fileName: file.name,
          message: "The selected file is empty",
        });
      }

      // Check if files are valid format
      if (fileType === FileType.dicom) {
        const isValidDicom = await isDicomValid(file);
        if (!isValidDicom) {
          errors.push({
            isValid: false,
            fileName: file.name,
            message: "The selected file is password protected or is an invalid DICOM file",
          });
        }
      } else if (fileType === FileType.photo) {
        const isValidPhoto = await isPhotoValid(file);
        if (!isValidPhoto) {
          errors.push({
            isValid: false,
            fileName: file.name,
            message: "The selected file is an invalid JPG, JPEG or PNG file",
          });
        }
      }
    }),
  );

  return {
    errors,
  };
};

export default validateFiles;
