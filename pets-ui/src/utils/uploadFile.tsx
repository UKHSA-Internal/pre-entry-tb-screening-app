import axios from "axios";

import { generateImageUploadUrl } from "@/api/api";

import { ImageType } from "./enums";

async function computeBase64SHA256(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = btoa(String.fromCharCode(...hashArray));
  return hash;
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
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
      "x-amz-server-side-encryption": SSE_ALGORITHM,
      "x-amz-server-side-encryption-aws-kms-key-id": SSE_KEY_ID,
      "x-amz-checksum-sha256": checksum,
    },
  });

  return bucketPath;
};

export default uploadFile;
