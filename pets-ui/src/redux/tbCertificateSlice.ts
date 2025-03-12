import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReduxTbCertificateDeclarationType } from "@/applicant";

const initialState: ReduxTbCertificateDeclarationType = {
  tbClearanceIssued: "",
  physicianComments: "",
  tbCertificateDate: {
    year: "",
    month: "",
    day: "",
  },
  tbCertificateNumber: "",
};

export const tbCertificateSlice = createSlice({
  name: "tbCertificateDetails",
  initialState,
  reducers: {
    setTbClearanceIssued: (state, action: PayloadAction<string>) => {
      state.tbClearanceIssued = action.payload;
    },
    setPhysicianComments: (state, action: PayloadAction<string>) => {
      state.physicianComments = action.payload;
    },
    setTbCertificateDate: (state, action: PayloadAction<DateType>) => {
      state.tbCertificateDate = action.payload;
    },
    setTbCertificateNumber: (state, action: PayloadAction<string>) => {
      state.tbCertificateNumber = action.payload;
    },
    cleartbCertificateDetails: (state) => {
      state.tbClearanceIssued = "";
      state.physicianComments = "";
      state.tbCertificateDate = { year: "", month: "", day: "" };
      state.tbCertificateNumber = "";
    },
  },
});

export const {
  setTbClearanceIssued,
  setPhysicianComments,
  setTbCertificateDate,
  setTbCertificateNumber,
  cleartbCertificateDetails,
} = tbCertificateSlice.actions;

export const tbCertificateReducer = tbCertificateSlice.reducer;

export const selectTbCertificate = (state: RootState) => state.tbCertificate;
