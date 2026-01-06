import axios, { AxiosError, AxiosResponse } from "axios";

import { acquireTokenSilently } from "@/auth/auth";
import {
  ApplicantSearchFormType,
  ApplicationIdAndDateCreatedType,
  ClinicType,
  GenerateImageUploadUrlRequest,
  GenerateImageUploadUrlResponse,
  PostedApplicantDetailsType,
  PostedChestXrayUnionType,
  PostedMedicalScreeningType,
  PostedRadiologicalOutcomeChestXrayNotTakenType,
  PostedRadiologicalOutcomeDetailsType,
  PostedSputumType,
  PostedTbCertificateNotIssuedType,
  PostedTbCertificateType,
  PostedTravelDetailsType,
  ReceivedApplicantDetailsType,
  ReceivedApplicationDetailsType,
} from "@/types";

export const petsApi = axios.create({
  baseURL: "/api",
});

petsApi.interceptors.request.use(async (config) => {
  if (import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION === "true") {
    return config; // Skip token acquisition in unit tests
  }

  const tokenResponse = await acquireTokenSilently();

  const idToken = tokenResponse?.idToken;

  if (idToken) {
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
});

petsApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (import.meta.env.VITE_AZURE_SKIP_TOKEN_ACQUISITION === "true") {
      return Promise.reject(error);
    }

    if (error.response?.status === 404) {
      globalThis.location.href = "/page-not-found";
    } else if (error.response?.status && error.response.status >= 400) {
      globalThis.location.href = "/sorry-there-is-problem-with-service";
    }

    return Promise.reject(error);
  },
);

export const getApplicants = async (passportDetails: ApplicantSearchFormType) => {
  const result = await petsApi.get("/applicant/search", {
    headers: {
      passportnumber: passportDetails.passportNumber,
      countryofissue: passportDetails.countryOfIssue,
    },
  });
  return result as AxiosResponse<ReceivedApplicantDetailsType[]>;
};

export const getApplication = async (applicantData: ReceivedApplicantDetailsType[]) => {
  if (applicantData[0]) {
    const result = await petsApi.get(`/application/${applicantData[0].applicationId}`);
    return result as AxiosResponse<ReceivedApplicationDetailsType>;
  } else {
    throw new Error("Applicant data in unexpected format or does not exist");
  }
};

export const createNewApplication = async () => {
  const result = await petsApi.post("/application");
  return result as AxiosResponse<ApplicationIdAndDateCreatedType>;
};

export const postApplicantDetails = async (
  applicationId: string,
  applicantDetails: PostedApplicantDetailsType,
) => {
  const result = await petsApi.post(`/applicant/register/${applicationId}`, applicantDetails);
  return { status: result.status, statusText: result.statusText };
};

export const putApplicantDetails = async (
  applicationId: string,
  applicantDetails: Partial<PostedApplicantDetailsType>,
) => {
  const result = await petsApi.put(`/applicant/update/${applicationId}`, applicantDetails);
  return { status: result.status, statusText: result.statusText };
};

export const postTravelDetails = async (
  applicationId: string,
  travelDetails: PostedTravelDetailsType,
) => {
  const result = await petsApi.post(
    `/application/${applicationId}/travel-information`,
    travelDetails,
  );
  return { status: result.status, statusText: result.statusText };
};

export const putTravelDetails = async (
  applicationId: string,
  travelDetails: Partial<PostedTravelDetailsType>,
) => {
  const result = await petsApi.put(
    `/application/${applicationId}/travel-information`,
    travelDetails,
  );
  return { status: result.status, statusText: result.statusText };
};

export const postMedicalDetails = async (
  applicationId: string,
  medicalScreeningDetails: PostedMedicalScreeningType,
) => {
  const result = await petsApi.post(
    `/application/${applicationId}/medical-screening`,
    medicalScreeningDetails,
  );
  return { status: result.status, statusText: result.statusText };
};

export const postChestXrayDetails = async (
  applicationId: string,
  chestXrayDetails: PostedChestXrayUnionType,
) => {
  const result = await petsApi.post(`/application/${applicationId}/chest-xray`, chestXrayDetails);
  return { status: result.status, statusText: result.statusText };
};

export const postRadiologicalOutcomeDetails = async (
  applicationId: string,
  radiologicalOutcomeDetails:
    | PostedRadiologicalOutcomeDetailsType
    | PostedRadiologicalOutcomeChestXrayNotTakenType,
) => {
  const result = await petsApi.post(
    `/application/${applicationId}/radiological-outcome`,
    radiologicalOutcomeDetails,
  );
  return { status: result.status, statusText: result.statusText };
};

export const postSputumRequirement = async (
  applicationId: string,
  sputumRequirement: { sputumRequired: string },
) => {
  const result = await petsApi.post(`/application/${applicationId}/sputum-decision`, {
    sputumRequired: sputumRequirement.sputumRequired,
  });
  return { status: result.status, statusText: result.statusText };
};

export const postTbCerificateDetails = async (
  applicationId: string,
  tbCertificateDetails: PostedTbCertificateType | PostedTbCertificateNotIssuedType,
) => {
  const result = await petsApi.post(
    `/application/${applicationId}/tb-certificate`,
    tbCertificateDetails,
  );
  return { status: result.status, statusText: result.statusText };
};

export const postSputumDetails = async (
  applicationId: string,
  sputumSamples: PostedSputumType,
  version?: number,
) => {
  const requestData: { sputumSamples: PostedSputumType; version?: number } = { sputumSamples };
  if (version !== undefined) {
    requestData.version = version;
  }

  const result = await petsApi.put(`/application/${applicationId}/sputum-details`, requestData);
  return {
    status: result.status,
    statusText: result.statusText,
    data: result.data as { version: number; sputumSamples: PostedSputumType },
  };
};

export const generateImageUploadUrl = async (
  applicationId: string,
  imageDetails: GenerateImageUploadUrlRequest,
) => {
  const result = await petsApi.put(
    `/application/${applicationId}/generate-image-upload-url`,
    imageDetails,
  );
  return result as AxiosResponse<GenerateImageUploadUrlResponse>;
};

export const getClinicById = async (clinicId: string) => {
  const result = await petsApi.get(`/clinics/${encodeURIComponent(clinicId)}`);
  return result as AxiosResponse<{ clinic: ClinicType }>;
};
