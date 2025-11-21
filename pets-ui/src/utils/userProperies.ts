import { msalInstance } from "@/auth/auth";

import { getClinicId } from "./clinic";

export const getJobTitle = async (): Promise<string | null> => {
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

  const claims = response.idTokenClaims as { JobTitle?: string };
  const jobTitle = claims?.JobTitle ?? null;
  return jobTitle;
};

export const getUserProperties = async () => {
  let jobTitle: string | null = "unknown Job Title";
  let clinicId: string | null = "unknown Clinic ID";
  try {
    jobTitle = await getJobTitle();
  } catch {
    console.error("Failed to retrieve Job Title when setting GA user_properties");
  }
  try {
    clinicId = await getClinicId();
  } catch {
    console.error("Failed to retrieve Clinic ID when setting GA user_properties");
  }
  return { jobTitle: jobTitle, clinicId: clinicId };
};
