import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReduxTbCertificateType } from "@/applicant";
import { ApplicationStatus } from "@/utils/enums";

const initialState: ReduxTbCertificateType = {
  status: ApplicationStatus.INCOMPLETE,
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
    setTbCertificateStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
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
      state.status = ApplicationStatus.INCOMPLETE;
      state.tbClearanceIssued = "";
      state.physicianComments = "";
      state.tbCertificateDate = { year: "", month: "", day: "" };
      state.tbCertificateNumber = "";
    },
  },
});

export const {
  setTbCertificateStatus,
  setTbClearanceIssued,
  setPhysicianComments,
  setTbCertificateDate,
  setTbCertificateNumber,
  cleartbCertificateDetails,
} = tbCertificateSlice.actions;

export const tbCertificateReducer = tbCertificateSlice.reducer;

export const selectTbCertificate = (state: RootState) => state.tbCertificate;
