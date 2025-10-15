import { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";

export const RedirectedRouteIfReduxEmpty = ({ children }: { children: ReactNode }) => {
  const applicantData = useAppSelector(selectApplicant);
  if (applicantData.passportNumber == "" || applicantData.countryOfIssue == "") {
    return <Navigate to="/search-for-visa-applicant" />;
  }
  return <>{children}</>;
};
