import { getClinicById } from "@/api/api";
import { msalInstance } from "@/auth/auth";
import { AppDispatch } from "@/redux/store";
import { setClinic } from "@/redux/tbCertificateSlice";

export const getClinicId = async (): Promise<string | null> => {
  if (import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION === "true") {
    return null;
  }

  let account = msalInstance.getActiveAccount() ?? undefined;

  if (!account) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
      account = accounts[0];
    }
  }

  const response = await msalInstance.acquireTokenSilent({
    account,
    scopes: [], // add API scopes if needed
  });

  const claims = response.idTokenClaims as { ClinicID?: string };
  const clinicId = claims?.ClinicID ?? null;
  return clinicId;
};

export const fetchClinic = async (dispatch: AppDispatch): Promise<void> => {
  const clinicId = await getClinicId();
  if (!clinicId) return;

  void getClinicById(clinicId).then(({ data }) => {
    dispatch(setClinic(data.clinic));
  });
};
