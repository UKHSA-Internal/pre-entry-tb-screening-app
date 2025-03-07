import { ReactNode } from "react";
import { Navigate } from "react-router";

import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";

export const RedirectedRouteIfReduxEmpty = ({ children }: { children: ReactNode }) => {
  const applicantData = useAppSelector(selectApplicant);
  if (applicantData.passportNumber == "" || applicantData.countryOfIssue == "") {
    return <Navigate to="/applicant-search" />;
  }
  return <>{children}</>;
};
