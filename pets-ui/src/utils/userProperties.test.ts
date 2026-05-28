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

import { getUserProperties } from "./userProperties";
const mockedMsal = vi.mocked(msalInstance);

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

describe("getUserProperties", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "false";
  });

  it("returns null when VITE_AZURE_SKIP_TOKEN_ACQUISITION === true", async () => {
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "true";

    const result = await getUserProperties();
    expect(result).toBeNull();
    expect(mockedMsal.getActiveAccount).not.toHaveBeenCalled();
  });

  it("uses active account if available", async () => {
    const account = { id: "active-user", ...getActiveAccountProps };

    mockedMsal.getActiveAccount.mockReturnValue(account);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: {
        JobTitle: "Nurse",
        ClinicID: "clinic-01",
        name: "Serge Bootson",
        roles: ["Application.Read"],
      },
      ...acquireTokenSilentyProps,
    });

    const result = await getUserProperties();

    expect(mockedMsal.acquireTokenSilent).toHaveBeenCalledWith({
      account,
      scopes: [],
    });

    expect(result).toMatchObject({
      clinicId: "clinic-01",
      isSuperUser: false,
      jobTitle: "Nurse",
      name: "Serge Bootson",
    });
  });

  it("falls back to first returned account when no active account", async () => {
    const fallbackAccount = { id: "user1", ...getActiveAccountProps };

    mockedMsal.getActiveAccount.mockReturnValue(null);
    mockedMsal.getAllAccounts.mockReturnValue([fallbackAccount]);

    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: {
        JobTitle: "Doctor",
        ClinicID: "clinic-02",
        name: "Wayne Shoeney",
        roles: ["Application.Read"],
      },
      ...acquireTokenSilentyProps,
    });

    const result = await getUserProperties();

    expect(mockedMsal.setActiveAccount).toHaveBeenCalledWith(fallbackAccount);

    expect(mockedMsal.acquireTokenSilent).toHaveBeenCalledWith({
      account: fallbackAccount,
      scopes: [],
    });

    expect(result).toMatchObject({
      clinicId: "clinic-02",
      isSuperUser: false,
      jobTitle: "Doctor",
      name: "Wayne Shoeney",
    });
  });

  it("returns unknown values when idTokenClaims missing", async () => {
    mockedMsal.getActiveAccount.mockReturnValue(getActiveAccountProps);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: {},
      ...acquireTokenSilentyProps,
    });

    expect(await getUserProperties()).toMatchObject({
      clinicId: "unknown Clinic ID",
      isSuperUser: false,
      jobTitle: "unknown Job Title",
      name: "unknown User Name",
    });
  });

  it("returns null when claims undefined", async () => {
    mockedMsal.getActiveAccount.mockReturnValue(getActiveAccountProps);
    mockedMsal.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: {
        clinicId: null,
        isSuperUser: null,
        jobTitle: null,
        name: null,
      },
      ...acquireTokenSilentyProps,
    });

    expect(await getUserProperties()).toMatchObject({
      clinicId: "unknown Clinic ID",
      isSuperUser: false,
      jobTitle: "unknown Job Title",
      name: "unknown User Name",
    });
  });
});
