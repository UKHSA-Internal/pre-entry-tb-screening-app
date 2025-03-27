import { EventMessage, EventType, PublicClientApplication } from "@azure/msal-browser";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";

import { mockAccount, mockAuthResult } from "@/test-data/auth";

import { acquireTokenSilently, initializeMsal, msalInstance, swaggerAuth } from "./auth";

const mockedMsalInstance = msalInstance as Mocked<PublicClientApplication>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("acquireTokenSilently", () => {
  it("should throw an error if no accounts are found", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValueOnce([]);
    await expect(acquireTokenSilently()).rejects.toThrow("No accounts found");
  });

  it("should return an access token when an account exists", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValue([mockAccount]);

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

describe("SwaggerAuthorize", () => {
  it("should authorize swagger docs", async () => {
    mockedMsalInstance.getAllAccounts.mockReturnValue([mockAccount]);

    mockedMsalInstance.acquireTokenSilent.mockResolvedValue(mockAuthResult);

    const swaggerConfig = {
      preauthorizeApiKey: vi.fn(),
    };
    await swaggerAuth(swaggerConfig);

    expect(swaggerConfig.preauthorizeApiKey).toBeCalledWith("authorizer", "Bearer mock_token");
  });
});
