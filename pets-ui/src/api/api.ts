import axios, { AxiosError, isAxiosError } from "axios";

import { ApplicantSearchFormType } from "../types/applicant";

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
    return result;
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
