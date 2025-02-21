import { RedirectRequest } from "@azure/msal-browser";

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
