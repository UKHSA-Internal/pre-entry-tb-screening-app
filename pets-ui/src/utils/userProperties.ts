import { msalInstance } from "@/auth/auth";

interface UserPropertiesType {
  jobTitle: string;
  clinicId: string;
  name: string;
  isSuperUser: boolean;
}

export const getUserProperties = async (): Promise<UserPropertiesType | null> => {
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

  try {
    const response = await msalInstance.acquireTokenSilent({
      account,
      scopes: [], // add API scopes if needed
    });

    const claims = response.idTokenClaims as {
      JobTitle?: string;
      ClinicID?: string;
      name?: string;
      roles?: string[];
    };

    return {
      jobTitle: claims?.JobTitle ?? "unknown Job Title",
      clinicId: claims?.ClinicID ?? "unknown Clinic ID",
      name: claims?.name ?? "unknown User Name",
      isSuperUser: claims?.roles?.includes("Application.Update") ?? false,
    };
  } catch {
    console.error("Failed to retrieve token when getting user properties");
    return {
      jobTitle: "unknown Job Title",
      clinicId: "unknown Clinic ID",
      name: "unknown User Name",
      isSuperUser: false,
    };
  }
};
