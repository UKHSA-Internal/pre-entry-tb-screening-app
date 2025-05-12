import dicomParser from "dicom-parser";

import { ImageType } from "./enums";

export type ValidationResult = string[] | true;

export const getImageType = (file: File): "Photo" | "Dicom" | undefined => {
  const isPhoto = /\.(jpg|jpeg|png)$/i.test(file.name);
  const isDicom = /\.dcm$/i.test(file.name);
  return isPhoto ? "Photo" : isDicom ? "Dicom" : undefined;
};

// use dicom-parser to check file encryption
const isDicomValid = async (file: File): Promise<boolean> => {
  try {
    const byteArray = new Uint8Array(await file.arrayBuffer());
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
    img.src = URL.createObjectURL(file);
  });
};

// --- Error Messages ---
const getTypeError = (type: ImageType, actual: string | undefined): string | null => {
  if (type === ImageType.Dicom && actual !== "Dicom") {
    return "The selected file must be a DICOM file";
  }
  if (type === ImageType.Photo && actual !== "Photo") {
    return "The selected file must be a JPG, JPEG or PNG";
  }
  return null;
};

const getSizeError = (type: string, size: number): string | null => {
  const maxSize = type === "Dicom" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  const label = type === "Dicom" ? "50MB" : "10MB";
  if (size > maxSize) {
    return `The selected file must be smaller than ${label}`;
  }
  return null;
};

// --- Main Validator ---
const validateFiles = async (files: File[], expectedType: ImageType): Promise<ValidationResult> => {
  const file = files[0];
  const errors: string[] = [];

  const imageType = getImageType(file);
  const fileSize = file.size;

  const typeError = getTypeError(expectedType, imageType);
  if (typeError) return [typeError];

  const sizeError = getSizeError(imageType!, fileSize);
  if (sizeError) errors.push(sizeError);

  if (fileSize === 0) {
    errors.push("The selected file is empty");
    return errors;
  }

  const isValid =
    imageType === "Dicom"
      ? await isDicomValid(file)
      : imageType === "Photo"
        ? await isPhotoValid(file)
        : false;

  if (!isValid) {
    const invalidMsg =
      imageType === "Dicom"
        ? "The selected file is password protected or is an invalid DICOM file"
        : "The selected file is an invalid JPG, JPEG or PNG file";
    errors.push(invalidMsg);
  }

  return errors.length > 0 ? errors : true;
};

export default validateFiles;
