import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxTravelDetailsType } from "@/applicant";
import { ApplicationStatus } from "@/utils/enums";

const initialState: ReduxTravelDetailsType = {
  status: ApplicationStatus.INCOMPLETE,
  visaType: "",
  applicantUkAddress1: "",
  applicantUkAddress2: "",
  townOrCity: "",
  postcode: "",
  ukMobileNumber: "",
  ukEmail: "",
};

export const travelSlice = createSlice({
  name: "travelDetails",
  initialState,
  reducers: {
    setTravelDetailsStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
    setVisaType: (state, action: PayloadAction<string>) => {
      state.visaType = action.payload;
    },
    setApplicantUkAddress1: (state, action: PayloadAction<string>) => {
      state.applicantUkAddress1 = action.payload;
    },
    setApplicantUkAddress2: (state, action: PayloadAction<string>) => {
      state.applicantUkAddress2 = action.payload;
    },
    setTownOrCity: (state, action: PayloadAction<string>) => {
      state.townOrCity = action.payload;
    },
    setPostcode: (state, action: PayloadAction<string>) => {
      state.postcode = action.payload;
    },
    setUkMobileNumber: (state, action: PayloadAction<string>) => {
      state.ukMobileNumber = action.payload;
    },
    setUkEmail: (state, action: PayloadAction<string>) => {
      state.ukEmail = action.payload;
    },
    setTravelDetails: (state, action: PayloadAction<ReduxTravelDetailsType>) => {
      state.visaType = action.payload.visaType;
      state.applicantUkAddress1 = action.payload.applicantUkAddress1;
      state.applicantUkAddress2 = action.payload.applicantUkAddress2 ?? "";
      state.townOrCity = action.payload.townOrCity;
      state.postcode = action.payload.postcode;
      state.ukMobileNumber = action.payload.ukMobileNumber ?? "";
      state.ukEmail = action.payload.ukEmail;
    },
    clearTravelDetails: (state) => {
      state.status = ApplicationStatus.INCOMPLETE;
      state.visaType = "";
      state.applicantUkAddress1 = "";
      state.applicantUkAddress2 = "";
      state.townOrCity = "";
      state.postcode = "";
      state.ukMobileNumber = "";
      state.ukEmail = "";
    },
  },
});

export const {
  setTravelDetailsStatus,
  setVisaType,
  setApplicantUkAddress1,
  setApplicantUkAddress2,
  setTownOrCity,
  setPostcode,
  setUkMobileNumber,
  setUkEmail,
  clearTravelDetails,
  setTravelDetails,
} = travelSlice.actions;

export const travelReducer = travelSlice.reducer;

export const selectTravel = (state: RootState) => state.travel;
