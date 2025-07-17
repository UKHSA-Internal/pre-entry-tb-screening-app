import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceivedTravelDetailsType, ReduxTravelDetailsType } from "@/applicant";
import { ApplicationStatus, BackendApplicationStatus } from "@/utils/enums";

const initialState: ReduxTravelDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  visaCategory: "",
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
    setVisaCategory: (state, action: PayloadAction<string>) => {
      state.visaCategory = action.payload;
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
      state.visaCategory = action.payload.visaCategory;
      state.applicantUkAddress1 = action.payload.applicantUkAddress1 ?? "";
      state.applicantUkAddress2 = action.payload.applicantUkAddress2 ?? "";
      state.townOrCity = action.payload.townOrCity ?? "";
      state.postcode = action.payload.postcode ?? "";
      state.ukMobileNumber = action.payload.ukMobileNumber ?? "";
      state.ukEmail = action.payload.ukEmail ?? "";
    },
    clearTravelDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.visaCategory = "";
      state.applicantUkAddress1 = "";
      state.applicantUkAddress2 = "";
      state.townOrCity = "";
      state.postcode = "";
      state.ukMobileNumber = "";
      state.ukEmail = "";
    },
    setTravelDetailsFromApiResponse: (state, action: PayloadAction<ReceivedTravelDetailsType>) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;
      state.visaCategory = action.payload.visaCategory;
      state.applicantUkAddress1 = action.payload.ukAddressLine1 ?? "";
      state.applicantUkAddress2 = action.payload.ukAddressLine2 ?? "";
      state.applicantUkAddress3 = action.payload.ukAddressLine3 ?? "";
      state.townOrCity = action.payload.ukAddressTownOrCity ?? "";
      state.postcode = action.payload.ukAddressPostcode ?? "";
      state.ukMobileNumber = action.payload.ukMobileNumber ?? "";
      state.ukEmail = action.payload.ukEmailAddress ?? "";
    },
  },
});

export const {
  setTravelDetailsStatus,
  setVisaCategory,
  setApplicantUkAddress1,
  setApplicantUkAddress2,
  setTownOrCity,
  setPostcode,
  setUkMobileNumber,
  setUkEmail,
  setTravelDetails,
  clearTravelDetails,
  setTravelDetailsFromApiResponse,
} = travelSlice.actions;

export const travelReducer = travelSlice.reducer;

export const selectTravel = (state: RootState) => state.travel;
