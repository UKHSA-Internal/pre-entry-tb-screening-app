import axios from "axios";

import { generateImageUploadUrl } from "@/api/api";

import { ImageType } from "./enums";

async function computeBase64SHA256(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = btoa(String.fromCodePoint(...hashArray));
  return hash;
}

// Mirrors the Content-Type the server bakes into the presigned URL
// (generate-image-upload-url.ts). The actual PUT must send this exact
// value or S3 rejects it with 403 SignatureDoesNotMatch - the browser's
// own file.type (OS MIME sniffing, e.g. "application/dicom" if a DICOM
// viewer is installed) cannot be trusted to match it.
const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

function getContentTypeForUpload(fileName: string, imageType: ImageType): string {
  if (imageType !== ImageType.Photo) {
    return "application/octet-stream";
  }
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return mimeTypes[ext] ?? "application/octet-stream";
}

const uploadFile = async (
  file: File,
  bucketFileName: string,
  applicationId: string,
  imageType: ImageType,
) => {
  const checksum = await computeBase64SHA256(file);

  const { data } = await generateImageUploadUrl(applicationId, {
    fileName: bucketFileName,
    checksum,
    imageType: imageType,
  });

  const { uploadUrl, bucketPath } = data;
  const SSE_KEY_ID = import.meta.env.VITE_SSE_KEY_ID as string;

  const SSE_ALGORITHM = "aws:kms";
  const normalizedContentType = getContentTypeForUpload(bucketFileName, imageType);
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": normalizedContentType,
      "x-amz-server-side-encryption": SSE_ALGORITHM,
      "x-amz-server-side-encryption-aws-kms-key-id": SSE_KEY_ID,
      "x-amz-checksum-sha256": checksum,
    },
  });

  return bucketPath;
};

export default uploadFile;
