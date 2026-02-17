/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchClinic, getClinicId } from "./clinic";

vi.mock("@/api/api", () => ({
  getClinicById: vi.fn(),
}));

vi.mock("@/auth/auth", () => ({
  msalInstance: {
    getActiveAccount: vi.fn(),
    getAllAccounts: vi.fn(),
    setActiveAccount: vi.fn(),
    acquireTokenSilent: vi.fn(),
  },
}));

vi.mock("@/redux/tbCertificateSlice", () => ({
  setClinic: vi.fn((payload) => ({
    type: "setClinic",
    payload,
  })),
}));

import { getClinicById } from "@/api/api";
import { msalInstance } from "@/auth/auth";
import { setClinic } from "@/redux/tbCertificateSlice";

describe("clinic.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "false");
  });

  describe("getClinicId", () => {
    it("returns null if skip token acquisition is true", async () => {
      vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "true");

      const result = await getClinicId();

      expect(result).toBeNull();
      expect(msalInstance.acquireTokenSilent).not.toHaveBeenCalled();
    });

    it("returns clinic ID from active account token", async () => {
      (msalInstance.getActiveAccount as any).mockReturnValue({ id: "1" });

      (msalInstance.acquireTokenSilent as any).mockResolvedValue({
        idTokenClaims: { ClinicID: "123" },
      });

      const result = await getClinicId();

      expect(result).toBe("123");
      expect(msalInstance.acquireTokenSilent).toHaveBeenCalled();
    });

    it("sets first account as active if none active", async () => {
      const fakeAccount = { id: "abc" };

      (msalInstance.getActiveAccount as any).mockReturnValue(null);
      (msalInstance.getAllAccounts as any).mockReturnValue([fakeAccount]);

      (msalInstance.acquireTokenSilent as any).mockResolvedValue({
        idTokenClaims: { ClinicID: "999" },
      });

      const result = await getClinicId();

      expect(msalInstance.setActiveAccount).toHaveBeenCalledWith(fakeAccount);
      expect(result).toBe("999");
    });

    it("returns null if no accounts exist", async () => {
      (msalInstance.getActiveAccount as any).mockReturnValue(null);
      (msalInstance.getAllAccounts as any).mockReturnValue([]);

      (msalInstance.acquireTokenSilent as any).mockResolvedValue({
        idTokenClaims: {},
      });

      const result = await getClinicId();

      expect(result).toBeNull();
    });
  });

  describe("fetchClinic", () => {
    it("uses provided applicationClinicId instead of getClinicId", async () => {
      const dispatch = vi.fn();

      (getClinicById as any).mockResolvedValue({
        data: {
          clinic: {
            clinicId: "123",
            name: "clinic 123",
            country: "ABC",
            city: "city 123",
            startDate: "2000-01-01",
            createdBy: "dummy@email.com",
          },
        },
      });

      await fetchClinic(dispatch, "app-123");

      await Promise.resolve();

      expect(getClinicById).toHaveBeenCalledWith("app-123");
      expect(dispatch).toHaveBeenCalledWith(
        setClinic({
          clinicId: "123",
          name: "clinic 123",
          country: "ABC",
          city: "city 123",
          startDate: "2000-01-01",
          createdBy: "dummy@email.com",
        }),
      );
    });

    it("falls back to getClinicId when no applicationClinicId", async () => {
      const dispatch = vi.fn();

      (msalInstance.getActiveAccount as any).mockReturnValue({});

      (msalInstance.acquireTokenSilent as any).mockResolvedValue({
        idTokenClaims: { ClinicID: "from-token" },
      });

      (getClinicById as any).mockResolvedValue({
        data: {
          clinic: {
            clinicId: "from-token",
            name: "clinic 123",
            country: "ABC",
            city: "city 123",
            startDate: "2000-01-01",
            createdBy: "dummy@email.com",
          },
        },
      });

      await fetchClinic(dispatch);

      await Promise.resolve();

      expect(getClinicById).toHaveBeenCalledWith("from-token");
      expect(dispatch).toHaveBeenCalledWith(
        setClinic({
          clinicId: "from-token",
          name: "clinic 123",
          country: "ABC",
          city: "city 123",
          startDate: "2000-01-01",
          createdBy: "dummy@email.com",
        }),
      );
    });

    it("does nothing if clinicId is null", async () => {
      const dispatch = vi.fn();

      vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "true");

      await fetchClinic(dispatch);

      expect(getClinicById).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
