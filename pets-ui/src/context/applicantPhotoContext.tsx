import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ApplicantPhotoContextType = {
  applicantPhotoFile: File | null;
  applicantPhotoDataUrl: string | null;
  setApplicantPhotoFile: (file: File | null) => void;
  setApplicantPhotoUrl: (url: string | null) => void;
};

const ApplicantPhotoContext = createContext<ApplicantPhotoContextType | undefined>(undefined);

export const useApplicantPhoto = () => {
  const context = useContext(ApplicantPhotoContext);
  if (!context) {
    throw new Error("useApplicantPhoto must be used within an ApplicantPhotoProvider");
  }
  return context;
};

export const ApplicantPhotoProvider = ({ children }: { children: ReactNode }) => {
  const [applicantPhotoFile, setApplicantPhotoFileState] = useState<File | null>(null);
  const [applicantPhotoDataUrl, setApplicantPhotoDataUrl] = useState<string | null>(null);

  const setApplicantPhotoFile = (file: File | null) => {
    setApplicantPhotoFileState(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setApplicantPhotoDataUrl(reader.result as string);
      };
      reader.onerror = () => {
        setApplicantPhotoDataUrl(null);
      };
      reader.readAsDataURL(file);
    } else {
      setApplicantPhotoDataUrl(null);
    }
  };

  const setApplicantPhotoUrl = (url: string | null) => {
    setApplicantPhotoFileState(null);
    setApplicantPhotoDataUrl(url);
  };

  const value = useMemo(
    () => ({
      applicantPhotoFile,
      applicantPhotoDataUrl,
      setApplicantPhotoFile,
      setApplicantPhotoUrl,
    }),
    [applicantPhotoFile, applicantPhotoDataUrl],
  );

  return <ApplicantPhotoContext.Provider value={value}>{children}</ApplicantPhotoContext.Provider>;
};
