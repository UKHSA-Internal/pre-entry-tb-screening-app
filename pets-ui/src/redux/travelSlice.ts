import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TravelDetailsType = {
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
    setTravelDetails: (state, action: PayloadAction<TravelDetailsType>) => {
      state.visaType = action.payload.visaType;
      state.applicantUkAddress1 = action.payload.applicantUkAddress1;
      state.applicantUkAddress2 = action.payload.applicantUkAddress1;
      state.townOrCity = action.payload.townOrCity;
      state.postcode = action.payload.postcode;
      state.ukMobileNumber = action.payload.ukMobileNumber;
      state.ukEmail = action.payload.ukEmail;
    },
    clearTravelDetails: (state) => {
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
