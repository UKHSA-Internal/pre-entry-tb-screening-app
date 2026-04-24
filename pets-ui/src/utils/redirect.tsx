import { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplicationsInProgress } from "@/redux/store";

export const RedirectedRouteIfReduxEmpty = ({ children }: { children: ReactNode }) => {
  const applicantData = useAppSelector(selectApplicant);
  const isInvalid = !applicantData.passportNumber || !applicantData.countryOfIssue;
  if (isInvalid) {
    return <Navigate to="/what-do-you-need-to-do" replace />;
  }
  return <>{children}</>;
};

export const RedirectedRouteIfApplicationsInProgressEmpty = ({
  children,
}: {
  children: ReactNode;
}) => {
  const applicationsInProgressData = useAppSelector(selectApplicationsInProgress);
  if (applicationsInProgressData.applications.length < 1) {
    return <Navigate to="/what-do-you-need-to-do" />;
  }
  return <>{children}</>;
};
