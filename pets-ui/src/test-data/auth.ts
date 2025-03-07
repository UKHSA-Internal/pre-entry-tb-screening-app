import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";

export const mockAccount: AccountInfo = {
  homeAccountId: "1",
  environment: "testenv",
  tenantId: "testtenant",
  username: "testuser",
  localAccountId: "testaccount",
};

export const mockAuthResult: AuthenticationResult = {
  authority: "mock_authority",
  uniqueId: "mock_id",
  tenantId: "mock_tenant",
  scopes: ["mock_scope"],
  account: mockAccount,
  idToken: "mock_token",
  idTokenClaims: {},
  accessToken: "mock-access-token",
  fromCache: true,
  expiresOn: new Date(),
  tokenType: "mock_token_type",
  correlationId: "mock_correlation",
};
