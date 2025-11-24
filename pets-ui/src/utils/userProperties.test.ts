/* eslint-disable @typescript-eslint/unbound-method */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth/auth", () => ({
  msalInstance: {
    getActiveAccount: vi.fn(),
    getAllAccounts: vi.fn(),
    setActiveAccount: vi.fn(),
    acquireTokenSilent: vi.fn(),
  },
}));

vi.mock("./clinic", () => ({
  getClinicId: vi.fn(),
}));

import { msalInstance } from "@/auth/auth";
const mockedMsal = vi.mocked(msalInstance);

import * as clinicModule from "./clinic";
import * as userPropsModule from "./userProperties";

const { getJobTitle, getUserProperties } = userPropsModule;

const getActiveAccountProps = {
  homeAccountId: "",
  environment: "",
  tenantId: "",
  username: "",
  localAccountId: "",
};

const acquireTokenSilentyProps = {
  authority: "",
  uniqueId: "",
  tenantId: "",
  scopes: [],
  account: {
    homeAccountId: "",
    environment: "",
    tenantId: "",
    username: "",
    localAccountId: "",
    loginHint: undefined,
    name: undefined,
    idToken: undefined,
    idTokenClaims: undefined,
    nativeAccountId: undefined,
    authorityType: undefined,
    tenantProfiles: undefined,
  },
  idToken: "",
  accessToken: "",
  fromCache: false,
  expiresOn: null,
  tokenType: "",
  correlationId: "",
};

describe("getJobTitle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "false";
  });

  it("returns null when VITE_AZURE_SKIP_TOKEN_ACQUISITION === true", async () => {
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "true";

    const result = await getJobTitle();
    expect(result).toBeNull();
    expect(mockedMsal.getActiveAccount).not.toHaveBeenCalled();
  });

  it("uses active account if available", async () => {
    const account = { id: "active-user", ...getActiveAccountProps };

    mockedMsal.getActiveAccount.mockReturnValue(account);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Nurse" },
      ...acquireTokenSilentyProps,
    });

    const result = await getJobTitle();

    expect(mockedMsal.acquireTokenSilent).toHaveBeenCalledWith({
      account,
      scopes: [],
    });

    expect(result).toBe("Nurse");
  });

  it("falls back to first returned account when no active account", async () => {
    const fallbackAccount = { id: "user1", ...getActiveAccountProps };

    mockedMsal.getActiveAccount.mockReturnValue(null);
    mockedMsal.getAllAccounts.mockReturnValue([fallbackAccount]);

    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Doctor" },
      ...acquireTokenSilentyProps,
    });

    const result = await getJobTitle();

    expect(mockedMsal.setActiveAccount).toHaveBeenCalledWith(fallbackAccount);

    expect(mockedMsal.acquireTokenSilent).toHaveBeenCalledWith({
      account: fallbackAccount,
      scopes: [],
    });

    expect(result).toBe("Doctor");
  });

  it("returns null when JobTitle missing", async () => {
    mockedMsal.getActiveAccount.mockReturnValue(getActiveAccountProps);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: {},
      ...acquireTokenSilentyProps,
    });

    expect(await getJobTitle()).toBeNull();
  });

  it("returns null when claims undefined", async () => {
    mockedMsal.getActiveAccount.mockReturnValue(getActiveAccountProps);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: null },
      ...acquireTokenSilentyProps,
    });

    expect(await getJobTitle()).toBeNull();
  });
});

describe("getUserProperties", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "false";
  });

  it("returns jobTitle and clinicId", async () => {
    const account = { id: "Admin", ...getActiveAccountProps };
    mockedMsal.getActiveAccount.mockReturnValue(account);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Admin" },
      ...acquireTokenSilentyProps,
    });

    vi.spyOn(clinicModule, "getClinicId").mockResolvedValue("C123");

    const res = await getUserProperties();

    expect(res).toEqual({
      jobTitle: "Admin",
      clinicId: "C123",
    });
  });

  it("handles failure retrieving job title", async () => {
    vi.spyOn(userPropsModule, "getJobTitle").mockRejectedValue(new Error("fail"));
    vi.spyOn(clinicModule, "getClinicId").mockResolvedValue("C123");

    const res = await getUserProperties();

    expect(res.jobTitle).toBe("unknown Job Title");
    expect(res.clinicId).toBe("C123");
  });

  it("handles failure retrieving clinic ID", async () => {
    const account = { id: "Admin", ...getActiveAccountProps };
    mockedMsal.getActiveAccount.mockReturnValue(account);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Admin" },
      ...acquireTokenSilentyProps,
    });

    vi.spyOn(clinicModule, "getClinicId").mockRejectedValue(new Error("fail"));

    const res = await getUserProperties();

    expect(res.jobTitle).toBe("Admin");
    expect(res.clinicId).toBe("unknown Clinic ID");
  });

  it("handles both failures", async () => {
    vi.spyOn(userPropsModule, "getJobTitle").mockRejectedValue(new Error("fail"));
    vi.spyOn(clinicModule, "getClinicId").mockRejectedValue(new Error("fail"));

    const res = await getUserProperties();

    expect(res).toEqual({
      jobTitle: "unknown Job Title",
      clinicId: "unknown Clinic ID",
    });
  });
});
