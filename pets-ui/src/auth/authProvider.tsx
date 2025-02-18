import {
  AuthenticationResult,
  AuthError,
  EventMessage,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

await msalInstance.initialize();

const isAuthError = (error: unknown): error is AuthError => {
  return (error as AuthError).errorCode !== undefined;
};

type AuthProviderProps = {
  children: React.ReactNode;
  instance?: PublicClientApplication;
};

const AuthProvider = ({ children, instance = msalInstance }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authenticatedPaths = [
      "/applicant-search",
      "/tracker",
      "/applicant-results",
      "/contact",
      "/applicant-summary",
      "/applicant-confirmation",
      "/medical-screening",
      "/medical-summary",
      "/medical-confirmation",
      "/travel-details",
      "/travel-summary",
      "/travel-confirmation",
    ];

    const authenticate = async () => {
      try {
        await instance.initialize();

        // event callback to determine authentication status
        instance.addEventCallback((event: EventMessage) => {
          if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const authenticationResult = event.payload as AuthenticationResult;
            const account = authenticationResult.account;
            instance.setActiveAccount(account);
          } else if (event.eventType === EventType.LOGIN_FAILURE) {
            throw new Error("Login failed");
          }
        });

        // handle redirect upon successful login
        await instance.handleRedirectPromise().then((response) => {
          if (response && response.account) {
            navigate("/applicant-search", { replace: true });
          }
        });

        // redirects to root page if no active session is found
        const account = instance.getActiveAccount();
        if (!account && authenticatedPaths.includes(location.pathname)) {
          navigate("/", { replace: true });
          await instance.clearCache();
        }
      } catch (error) {
        if (isAuthError(error)) {
          throw error;
        } else {
          throw new Error("Unknown error during MSAL initialization");
        }
      }
    };

    authenticate().catch(() => new Error("Authentication failed"));
  }, [instance, location.pathname, navigate]);

  return <MsalProvider instance={instance}>{children}</MsalProvider>;
};

export default AuthProvider;
