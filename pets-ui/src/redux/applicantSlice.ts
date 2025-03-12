import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ApplicantSearchFormType,
  DateType,
  ReceivedApplicantDetailsType,
  ReduxApplicantDetailsType,
} from "@/applicant";
import { ApplicationStatus, BackendApplicationStatus } from "@/utils/enums";

const initialState: ReduxApplicantDetailsType = {
  status: ApplicationStatus.INCOMPLETE,
  fullName: "",
  sex: "",
  dateOfBirth: {
    year: "",
    month: "",
    day: "",
  },
  countryOfNationality: "",
  passportNumber: "",
  countryOfIssue: "",
  passportIssueDate: {
    year: "",
    month: "",
    day: "",
  },
  passportExpiryDate: {
    year: "",
    month: "",
    day: "",
  },
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  townOrCity: "",
  provinceOrState: "",
  country: "",
  postcode: "",
};

export const applicantSlice = createSlice({
  name: "applicantDetails",
  initialState,
  reducers: {
    setApplicantDetailsStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    setSex: (state, action: PayloadAction<string>) => {
      state.sex = action.payload;
    },
    setDob: (state, action: PayloadAction<DateType>) => {
      state.dateOfBirth = action.payload;
    },
    setCountryOfNationality: (state, action: PayloadAction<string>) => {
      state.countryOfNationality = action.payload;
    },
    setPassportNumber: (state, action: PayloadAction<string>) => {
      state.passportNumber = action.payload;
    },
    setCountryOfIssue: (state, action: PayloadAction<string>) => {
      state.countryOfIssue = action.payload;
    },
    setPassportIssueDate: (state, action: PayloadAction<DateType>) => {
      state.passportIssueDate = action.payload;
    },
    setPassportExpiryDate: (state, action: PayloadAction<DateType>) => {
      state.passportExpiryDate = action.payload;
    },
    setApplicantHomeAddress1: (state, action: PayloadAction<string>) => {
      state.applicantHomeAddress1 = action.payload;
    },
    setApplicantHomeAddress2: (state, action: PayloadAction<string>) => {
      state.applicantHomeAddress2 = action.payload;
    },
    setApplicantHomeAddress3: (state, action: PayloadAction<string>) => {
      state.applicantHomeAddress3 = action.payload;
    },
    setTownOrCity: (state, action: PayloadAction<string>) => {
      state.townOrCity = action.payload;
    },
    setProvinceOrState: (state, action: PayloadAction<string>) => {
      state.provinceOrState = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setPostcode: (state, action: PayloadAction<string>) => {
      state.postcode = action.payload;
    },
    setApplicantPassportDetails: (state, action: PayloadAction<ApplicantSearchFormType>) => {
      state.passportNumber = action.payload.passportNumber;
      state.countryOfIssue = action.payload.countryOfIssue;
    },
    setApplicantDetails: (state, action: PayloadAction<ReduxApplicantDetailsType>) => {
      state.fullName = action.payload.fullName;
      state.sex = action.payload.sex;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.countryOfNationality = action.payload.countryOfNationality;
      state.passportNumber = action.payload.passportNumber;
      state.countryOfIssue = action.payload.countryOfIssue;
      state.passportIssueDate = action.payload.passportIssueDate;
      state.passportExpiryDate = action.payload.passportExpiryDate;
      state.applicantHomeAddress1 = action.payload.applicantHomeAddress1;
      state.applicantHomeAddress2 = action.payload.applicantHomeAddress2 ?? "";
      state.applicantHomeAddress3 = action.payload.applicantHomeAddress3 ?? "";
      state.townOrCity = action.payload.townOrCity;
      state.provinceOrState = action.payload.provinceOrState;
      state.country = action.payload.country;
      state.postcode = action.payload.postcode ?? "";
    },
    clearApplicantDetails: (state) => {
      state.status = ApplicationStatus.INCOMPLETE;
      state.fullName = "";
      state.sex = "";
      state.dateOfBirth = {
        year: "",
        month: "",
        day: "",
      };
      state.countryOfNationality = "";
      state.passportNumber = "";
      state.countryOfIssue = "";
      state.passportIssueDate = {
        year: "",
        month: "",
        day: "",
      };
      state.passportExpiryDate = {
        year: "",
        month: "",
        day: "",
      };
      state.applicantHomeAddress1 = "";
      state.applicantHomeAddress2 = "";
      state.applicantHomeAddress3 = "";
      state.townOrCity = "";
      state.provinceOrState = "";
      state.country = "";
      state.postcode = "";
    },
    setApplicantDetailsFromApiResponse: (
      state,
      action: PayloadAction<ReceivedApplicantDetailsType>,
    ) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.INCOMPLETE;
      state.fullName = action.payload.fullName;
      state.sex = action.payload.sex;
      state.countryOfNationality = action.payload.countryOfNationality;
      state.passportNumber = action.payload.passportNumber;
      state.countryOfIssue = action.payload.countryOfIssue;
      state.dateOfBirth = {
        year: action.payload.dateOfBirth.split("-")[0],
        month: action.payload.dateOfBirth.split("-")[1],
        day: action.payload.dateOfBirth.split("-")[2],
      };
      state.passportIssueDate = {
        year: action.payload.issueDate.split("-")[0],
        month: action.payload.issueDate.split("-")[1],
        day: action.payload.issueDate.split("-")[2],
      };
      state.passportExpiryDate = {
        year: action.payload.expiryDate.split("-")[0],
        month: action.payload.expiryDate.split("-")[1],
        day: action.payload.expiryDate.split("-")[2],
      };
      state.applicantHomeAddress1 = action.payload.applicantHomeAddress1;
      state.applicantHomeAddress2 = action.payload.applicantHomeAddress2 ?? "";
      state.applicantHomeAddress3 = action.payload.applicantHomeAddress3 ?? "";
      state.townOrCity = action.payload.townOrCity;
      state.provinceOrState = action.payload.provinceOrState;
      state.country = action.payload.country;
      state.postcode = action.payload.postcode ?? "";
    },
  },
});

export const {
  setApplicantDetailsStatus,
  setFullName,
  setSex,
  setDob,
  setCountryOfNationality,
  setPassportNumber,
  setCountryOfIssue,
  setPassportIssueDate,
  setPassportExpiryDate,
  setApplicantHomeAddress1,
  setApplicantHomeAddress2,
  setApplicantHomeAddress3,
  setTownOrCity,
  setProvinceOrState,
  setCountry,
  setPostcode,
  setApplicantPassportDetails,
  setApplicantDetails,
  clearApplicantDetails,
  setApplicantDetailsFromApiResponse,
} = applicantSlice.actions;

export const applicantReducer = applicantSlice.reducer;

export const selectApplicant = (state: RootState) => state.applicant;
