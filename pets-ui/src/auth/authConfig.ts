import { RedirectRequest } from "@azure/msal-browser";

const CLIENT_ID = import.meta.env.VITE_MSAL_CLIENT_ID;
const TENANT_ID = import.meta.env.VITE_MSAL_TENANT_ID;
const AUTH_ENDPOINT_URI = import.meta.env.VITE_AUTH_ENDPOINT_URI;

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
