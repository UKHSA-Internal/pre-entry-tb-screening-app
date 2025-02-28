import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";

import { acquireTokenSilently, initializeMsal, msalInstance } from "./auth";

const mockedMsalInstance = msalInstance as Mocked<PublicClientApplication>;
const mockAccount: AccountInfo = {
  homeAccountId: "1",
  environment: "testenv",
  tenantId: "testtenant",
  username: "testuser",
  localAccountId: "testaccount",
};

describe("acquireTokenSilently", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if no accounts are found", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValueOnce([]);
    await expect(acquireTokenSilently()).rejects.toThrow("No accounts found");
  });

  it("should return an access token when an account exists", async () => {
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

describe("initializeMsal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize mockedMsalInstance and set active account if accounts exist", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValue([mockAccount]);

    const result = await initializeMsal();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedMsalInstance.setActiveAccount).toHaveBeenCalledWith(mockAccount);
    expect(result).toBe(mockedMsalInstance);
  });

  it("should initialize mockedMsalInstance without setting an active account if no accounts exist", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValue([]);

    const result = await initializeMsal();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedMsalInstance.setActiveAccount).not.toHaveBeenCalled();
    expect(result).toBe(mockedMsalInstance);
  });

  it("should handle LOGIN_SUCCESS event and set active account", async () => {
    // Arrange
    const mockEvent: EventMessage = {
      eventType: EventType.LOGIN_SUCCESS,
      payload: { account: mockAccount },
      interactionType: null,
      timestamp: 0,
      error: null,
    };
    // Act
    await initializeMsal();

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedMsalInstance.addEventCallback).toHaveBeenCalledOnce();

    const eventCallBack = mockedMsalInstance.addEventCallback.mock.lastCall?.[0];
    assert(eventCallBack);
    eventCallBack(mockEvent);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedMsalInstance.setActiveAccount).toHaveBeenCalledWith(mockAccount);
  });

  it("should throw an error on LOGIN_FAILURE event", async () => {
    const mockEvent: EventMessage = {
      eventType: EventType.LOGIN_FAILURE,
      payload: null,
      interactionType: null,
      timestamp: 0,
      error: null,
    };

    await initializeMsal();

    const eventCallBack = mockedMsalInstance.addEventCallback.mock.calls[0][0];

    expect(() => eventCallBack(mockEvent)).toThrowError("Login failed");
  });
});
