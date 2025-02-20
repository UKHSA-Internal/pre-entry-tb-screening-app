import {
  AuthenticationResult,
  AuthError,
  EventMessage,
  EventType,
  IPublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const isAuthError = (error: unknown): error is AuthError => {
  return (error as AuthError).errorCode !== undefined;
};

type AuthProviderProps = {
  children: React.ReactNode;
  instance: IPublicClientApplication;
};

const AuthProvider = ({ children, instance }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authenticate = () => {
      try {
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          instance.setActiveAccount(accounts[0]);
        }

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
      } catch (error) {
        if (isAuthError(error)) {
          throw error;
        } else {
          throw new Error("Unknown error during MSAL initialization");
        }
      }
    };

    authenticate();
  }, [instance, location.pathname, navigate]);

  return <MsalProvider instance={instance}>{children}</MsalProvider>;
};

export default AuthProvider;
