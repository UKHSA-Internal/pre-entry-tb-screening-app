import { setApplicantPhotoFileName } from "@/redux/applicantSlice";
import { AppDispatch } from "@/redux/store";

export const handleApplicantPhoto = async (
  photoUrl: string,
  dispatch: AppDispatch,
  setApplicantPhotoFile: (file: File | null) => void,
  setApplicantPhotoUrl: (url: string | null) => void,
) => {
  const env = import.meta.env.VITE_ENVIRONMENT as string | undefined;
  const fixedUrl =
    env === "local" ? photoUrl.replace(/172\.\d+\.\d+\.\d+:4566/, "localhost:4566") : photoUrl;

  const urlParts = photoUrl.split("/");
  const filename = urlParts.pop()?.split("?")[0] ?? "applicant-photo.jpg";
  dispatch(setApplicantPhotoFileName(filename));
  const response = await fetch(fixedUrl);
  const blob = await response.blob();
  if (typeof File == "undefined") {
    setApplicantPhotoUrl(fixedUrl);
  } else {
    try {
      const file = new File([blob], filename, { type: blob.type });
      setApplicantPhotoFile(file);
    } catch {
      setApplicantPhotoUrl(fixedUrl);
    }
  }
};
