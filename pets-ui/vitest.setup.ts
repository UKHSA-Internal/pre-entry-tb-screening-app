import { File } from "node:buffer";

import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import crypto from "crypto";
import { afterEach, beforeEach, expect, vi } from "vitest";

import { mockAccount, mockAuthResult } from "./src/test-data/auth";

expect.extend(matchers);

// Patch globalThis.crypto using defineProperty
Object.defineProperty(globalThis, "crypto", {
  value: crypto,
  configurable: true,
});
globalThis.File = File;

beforeEach(() => {
  vi.mock("@azure/msal-browser", async (importOriginal) => {
    return {
      ...(await importOriginal<typeof import("@azure/msal-browser")>()),
      PublicClientApplication: vi.fn().mockImplementation(function () {
        return {
          initialize: vi.fn(),
          getAllAccounts: vi.fn().mockReturnValue([mockAccount]),
          acquireTokenSilent: vi.fn().mockResolvedValue(mockAuthResult),
          setActiveAccount: vi.fn(),
          addEventCallback: vi.fn(),
        };
      }),
    };
  });
});

afterEach(() => {
  cleanup();
});
