import { getClinicById } from "@/api/api";
import { msalInstance } from "@/auth/auth";
import { AppDispatch } from "@/redux/store";
import { setClinic } from "@/redux/tbCertificateSlice";

export const getClinicId = (): string | null => {
  if (import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION === "true") {
    return null;
  }

  const account = msalInstance.getActiveAccount()!;
  const clinicId = (account.idTokenClaims as { ClinicID: string }).ClinicID;
  return clinicId || null;
};

export const fetchClinic = (dispatch: AppDispatch): void => {
  const clinicId = getClinicId();
  if (!clinicId) return;

  void getClinicById(clinicId).then(({ data }) => {
    dispatch(setClinic(data.clinic));
  });
};
