import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

expect.extend(matchers);

vi.mock("@azure/msal-browser", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("@azure/msal-browser")>()),
    PublicClientApplication: vi.fn().mockReturnValue({
      initialize: vi.fn(),
      getAllAccounts: vi.fn(),
      acquireTokenSilent: vi.fn(),
      setActiveAccount: vi.fn(),
      addEventCallback: vi.fn(),
    }),
  };
});

afterEach(() => {
  cleanup();
});
