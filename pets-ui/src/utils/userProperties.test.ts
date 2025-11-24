/* eslint-disable @typescript-eslint/no-unsafe-call */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth/auth", () => ({
  msalInstance: {
    getActiveAccount: vi.fn(),
    getAllAccounts: vi.fn(),
    setActiveAccount: vi.fn(),
    acquireTokenSilent: vi.fn,
  },
}));

vi.mock("./clinic", () => ({
  getClinicId: vi.fn(),
}));

import { msalInstance } from "@/auth/auth";

import * as clinicModule from "./clinic";
import * as userPropsModule from "./userProperties";

const { getJobTitle, getUserProperties } = userPropsModule;

describe("getJobTitle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "false";
  });

  it("returns null when VITE_AZURE_SKIP_TOKEN_ACQUISITION === true", async () => {
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "true";

    const result = await getJobTitle();
    expect(result).toBeNull();
    expect(msalInstance.getActiveAccount).not.toHaveBeenCalled();
  });

  it("uses active account if available", async () => {
    const account = { id: "active-user" };

    msalInstance.getActiveAccount.mockReturnValue(account);
    msalInstance.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Nurse" },
    });

    const result = await getJobTitle();

    expect(msalInstance.acquireTokenSilent).toHaveBeenCalledWith({
      account,
      scopes: [],
    });

    expect(result).toBe("Nurse");
  });

  it("falls back to first returned account when no active account", async () => {
    const fallbackAccount = { id: "user1" };

    msalInstance.getActiveAccount.mockReturnValue(undefined);
    msalInstance.getAllAccounts.mockReturnValue([fallbackAccount]);

    msalInstance.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Doctor" },
    });

    const result = await getJobTitle();

    expect(msalInstance.setActiveAccount).toHaveBeenCalledWith(fallbackAccount);

    expect(msalInstance.acquireTokenSilent).toHaveBeenCalledWith({
      account: fallbackAccount,
      scopes: [],
    });

    expect(result).toBe("Doctor");
  });

  it("returns null when JobTitle missing", async () => {
    msalInstance.getActiveAccount.mockReturnValue({});
    msalInstance.acquireTokenSilent.mockResolvedValue({ idTokenClaims: {} });

    expect(await getJobTitle()).toBeNull();
  });

  it("returns null when claims undefined", async () => {
    msalInstance.getActiveAccount.mockReturnValue({});
    msalInstance.acquireTokenSilent.mockResolvedValue({ idTokenClaims: undefined });

    expect(await getJobTitle()).toBeNull();
  });
});

describe("getUserProperties", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION = "false";
  });

  it("returns jobTitle and clinicId", async () => {
    const account = { id: "Admin" };
    msalInstance.getActiveAccount.mockReturnValue(account);
    msalInstance.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Admin" },
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
    const account = { id: "Admin" };
    msalInstance.getActiveAccount.mockReturnValue(account);
    msalInstance.acquireTokenSilent.mockResolvedValue({
      idTokenClaims: { JobTitle: "Admin" },
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
