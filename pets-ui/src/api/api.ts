import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios";

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
  try {
    const result = await petsApi.get("/applicant/search", {
      headers: {
        passportnumber: passportDetails.passportNumber,
        countryofissue: passportDetails.countryOfIssue,
      },
    });
    return result as AxiosResponse<ApplicantResponseDetailsType[]>;
  } catch (_error) {
    if (isAxiosError(_error)) {
      throw new AxiosError(
        _error.message,
        _error.code,
        _error.config,
        _error.request,
        _error.response,
      );
    } else {
      throw new Error(_error as string);
    }
  }
};

export const getApplication = async (applicationId: string | undefined) => {
  try {
    const result = await petsApi.get(`/application/${applicationId}`);
    return result as AxiosResponse<ApplicationResponseDetailsType>;
  } catch (_error) {
    if (isAxiosError(_error)) {
      throw new AxiosError(
        _error.message,
        _error.code,
        _error.config,
        _error.request,
        _error.response,
      );
    } else {
      throw new Error(_error as string);
    }
  }
};

export const createNewApplication = async () => {
  try {
    const result = await petsApi.post("/application");
    return result as AxiosResponse<ApplicationDetailsType>;
  } catch (_error) {
    if (isAxiosError(_error)) {
      throw new AxiosError(
        _error.message,
        _error.code,
        _error.config,
        _error.request,
        _error.response,
      );
    } else {
      throw new Error(_error as string);
    }
  }
};

export const postApplicantDetails = async (
  applicationId: string,
  applicantDetails: ApplicantResponseDetailsType,
) => {
  try {
    const result = await petsApi.post(`/applicant/register/${applicationId}`, applicantDetails);
    return { status: result.status, statusText: result.statusText };
  } catch (_error) {
    if (isAxiosError(_error)) {
      throw new AxiosError(
        _error.message,
        _error.code,
        _error.config,
        _error.request,
        _error.response,
      );
    } else {
      throw new Error(_error as string);
    }
  }
};

export const postTravelDetails = async (
  applicationId: string,
  travelDetails: TravelResponseDetailsType,
) => {
  try {
    const result = await petsApi.post(
      `/application/${applicationId}/travel-information`,
      travelDetails,
    );
    return { status: result.status, statusText: result.statusText };
  } catch (_error) {
    if (isAxiosError(_error)) {
      throw new AxiosError(
        _error.message,
        _error.code,
        _error.config,
        _error.request,
        _error.response,
      );
    } else {
      throw new Error(_error as string);
    }
  }
};

export const postMedicalDetails = async (
  applicationId: string,
  medicalScreeningDetails: MedicalResponseScreeningType,
) => {
  try {
    const result = await petsApi.post(
      `/application/${applicationId}/medical-screening`,
      medicalScreeningDetails,
    );
    return { status: result.status, statusText: result.statusText };
  } catch (_error) {
    if (isAxiosError(_error)) {
      throw new AxiosError(
        _error.message,
        _error.code,
        _error.config,
        _error.request,
        _error.response,
      );
    } else {
      throw new Error(_error as string);
    }
  }
};
