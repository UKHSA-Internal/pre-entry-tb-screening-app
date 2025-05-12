import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ApplicantPhotoContextType = {
  applicantPhotoFile: File | null;
  setApplicantPhotoFile: (file: File | null) => void;
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
  const [applicantPhotoFile, setApplicantPhotoFile] = useState<File | null>(null);

  const value = useMemo(
    () => ({ applicantPhotoFile, setApplicantPhotoFile }),
    [applicantPhotoFile],
  );

  return <ApplicantPhotoContext.Provider value={value}>{children}</ApplicantPhotoContext.Provider>;
};
