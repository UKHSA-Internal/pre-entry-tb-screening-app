import { InteractionStatus } from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";

export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { accounts, instance, inProgress } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (inProgress === InteractionStatus.None && accounts.length === 0) {
      navigate("/", { replace: true });
    }
  }, [accounts, inProgress, instance, navigate, children]);

  if (accounts.length) return <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
};

export const UnauthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated) {
    return <Navigate to="/applicant-search" />;
  }
  return <UnauthenticatedTemplate>{children}</UnauthenticatedTemplate>;
};
