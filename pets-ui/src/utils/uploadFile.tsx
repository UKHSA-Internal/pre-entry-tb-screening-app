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
  const { data } = await generateImageUploadUrl(applicationId, {
    fileName: bucketFileName,
    checksum: await computeBase64SHA256(file),
    imageType: imageType,
  });

  const { uploadUrl, bucketPath, fields } = data;

  const form = new FormData();
  Object.entries(fields).forEach(([field, value]) => {
    form.append(field, value);
  });
  form.append("file", file);

  await axios.post(uploadUrl, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return bucketPath;
};

export default uploadFile;
