import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionRequiredAuthError,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from "@azure/msal-browser";

const CLIENT_ID = import.meta.env.VITE_MSAL_CLIENT_ID as string;
const TENANT_ID = import.meta.env.VITE_MSAL_TENANT_ID as string;
const AUTH_ENDPOINT_URI = import.meta.env.VITE_AUTH_ENDPOINT_URI as string;

if (!CLIENT_ID || !TENANT_ID) {
  throw new Error("Missing environment variables for MSAL configuration");
}

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `${AUTH_ENDPOINT_URI}/${TENANT_ID}`,
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest: RedirectRequest = {
  scopes: [],
  storeInCache: {
    accessToken: true,
    idToken: true,
    refreshToken: true,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const initializeMsal = async () => {
  await msalInstance.initialize();

  const accounts = msalInstance.getAllAccounts();

  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // event callback to determine authentication status
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const authenticationResult = event.payload as AuthenticationResult;
      const account = authenticationResult.account;
      msalInstance.setActiveAccount(account);
    } else if (event.eventType === EventType.LOGIN_FAILURE) {
      throw new Error("Login failed");
    }
  });

  return msalInstance;
};

export const acquireTokenSilently = async (): Promise<AuthenticationResult | null | void> => {
  const accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) {
    throw new Error("No accounts found");
  }

  const accessTokenRequest: SilentRequest = {
    scopes: loginRequest.scopes,
    account: accounts[0],
  };

  try {
    const accessToken: AuthenticationResult =
      await msalInstance.acquireTokenSilent(accessTokenRequest);

    return accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      console.info("Handling exception caused by InteractionRequiredAuthError");

      return msalInstance.loginRedirect(accessTokenRequest).catch((error: object) => {
        console.error({ error }, "LoginRedirect failed with the error");
      });
    } else {
      console.error({ e }, "Exception caused while acquiring a token");
    }
  }
};

export const swaggerAuth = async (swagger: any) => {
  const tokenResponse = await acquireTokenSilently();
  const idToken = tokenResponse?.idToken;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  swagger.preauthorizeApiKey("authorizer", `Bearer ${idToken}`);
};
