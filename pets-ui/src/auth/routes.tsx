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
    const checkAuth = async () => {
      if (inProgress === InteractionStatus.None && accounts.length === 0) {
        await instance.clearCache();
        navigate("/", { replace: true });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkAuth();
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
