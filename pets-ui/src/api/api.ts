import axios, { AxiosResponse } from "axios";

import {
  ApplicantResponseDetailsType,
  ApplicantSearchFormType,
  ApplicationDetailsType,
  ApplicationResponseDetailsType,
  MedicalResponseScreeningType,
  TravelResponseDetailsType,
} from "@/applicant";

export const petsApi = axios.create({
  baseURL: "/api",
});

export const getApplicants = async (passportDetails: ApplicantSearchFormType) => {
  const result = await petsApi.get("/applicant/search", {
    headers: {
      passportnumber: passportDetails.passportNumber,
      countryofissue: passportDetails.countryOfIssue,
    },
  });
  return result as AxiosResponse<ApplicantResponseDetailsType[]>;
};

export const getApplication = async (applicantData: ApplicantResponseDetailsType[]) => {
  if (applicantData[0]) {
    const result = await petsApi.get(`/application/${applicantData[0].applicationId}`);
    return result as AxiosResponse<ApplicationResponseDetailsType>;
  } else {
    throw new Error("Applicant data in unexpected format or does not exist");
  }
};

export const createNewApplication = async () => {
  const result = await petsApi.post("/application");
  return result as AxiosResponse<ApplicationDetailsType>;
};

export const postApplicantDetails = async (
  applicationId: string,
  applicantDetails: ApplicantResponseDetailsType,
) => {
  const result = await petsApi.post(`/applicant/register/${applicationId}`, applicantDetails);
  return { status: result.status, statusText: result.statusText };
};

export const postTravelDetails = async (
  applicationId: string,
  travelDetails: TravelResponseDetailsType,
) => {
  const result = await petsApi.post(
    `/application/${applicationId}/travel-information`,
    travelDetails,
  );
  return { status: result.status, statusText: result.statusText };
};

export const postMedicalDetails = async (
  applicationId: string,
  medicalScreeningDetails: MedicalResponseScreeningType,
) => {
  const result = await petsApi.post(
    `/application/${applicationId}/medical-screening`,
    medicalScreeningDetails,
  );
  return { status: result.status, statusText: result.statusText };
};
