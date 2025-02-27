import axios from "axios";

import { ApplicantSearchFormResultType, ApplicantSearchFormType } from "../src/types/applicant";

export const petsApi = axios.create({
  baseURL: "/api",
});

export const getApplicants = async (
  passportDetails: ApplicantSearchFormType,
): Promise<ApplicantSearchFormResultType> => {
  try {
    const result = await petsApi.get("/applicant/search", {
      headers: {
        passportnumber: passportDetails.passportNumber,
        countryofissue: passportDetails.countryOfIssue,
      },
    });
    return result.data as ApplicantSearchFormResultType;
  } catch (_error) {
    // How do we want to handle errors?
    const error = _error as { message: string };
    throw new Error(`Error in getApplicants with message: ${error.message}`);
  }
};
