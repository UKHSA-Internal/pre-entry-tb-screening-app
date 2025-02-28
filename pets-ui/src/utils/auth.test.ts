import { AccountInfo, AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";

import { acquireTokenSilently, msalInstance } from "./auth";

const mockedMsalInstance = msalInstance as Mocked<PublicClientApplication>;

describe("acquireTokenSilently", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if no accounts are found", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValueOnce([]);
    await expect(acquireTokenSilently()).rejects.toThrow("No accounts found");
  });

  it("should return an access token when an account exists", async () => {
    const mockAccount: AccountInfo = {
      homeAccountId: "1",
      environment: "testenv",
      tenantId: "testtenant",
      username: "testuser",
      localAccountId: "testaccount",
    };
    mockedMsalInstance.getAllAccounts.mockReturnValue([mockAccount]);

    const mockAuthResult: AuthenticationResult = {
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

    mockedMsalInstance.acquireTokenSilent.mockResolvedValue(mockAuthResult);

    // Act
    const result = await acquireTokenSilently();

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedMsalInstance.acquireTokenSilent).toHaveBeenCalledWith({
      scopes: [],
      account: mockAccount,
    });
    expect(result).toEqual(mockAuthResult);
  });
});
