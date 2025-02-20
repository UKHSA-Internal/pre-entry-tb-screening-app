import { InteractionStatus } from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router";

import { loginRequest } from "./authConfig";

export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { accounts, instance, inProgress } = useMsal();

  useEffect(() => {
    if (inProgress === InteractionStatus.None && accounts.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.loginRedirect({
        scopes: loginRequest.scopes,
        storeInCache: loginRequest.storeInCache,
      });
    }
  }, [accounts, inProgress, instance]);

  if (accounts.length) return <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
};

export const UnauthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated) {
    return <Navigate to="/applicant-search" />;
  }
  return <UnauthenticatedTemplate>{children}</UnauthenticatedTemplate>;
};
