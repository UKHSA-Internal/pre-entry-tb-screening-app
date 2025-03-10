import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReceivedTbCertificateType, ReduxTbCertificateType } from "@/applicant";
import { ApplicationStatus, BackendApplicationStatus } from "@/utils/enums";

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
    setTbCertificateFromApiResponse: (state, action: PayloadAction<ReceivedTbCertificateType>) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.INCOMPLETE;
      state.tbClearanceIssued = action.payload.certificateIssued;
      state.physicianComments = action.payload.certificateComments;
      state.tbCertificateDate = {
        year: action.payload.certificateIssueDate.split("-")[0],
        month: action.payload.certificateIssueDate.split("-")[1],
        day: action.payload.certificateIssueDate.split("-")[2],
      };
      state.tbCertificateNumber = action.payload.certificateNumber;
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
  setTbCertificateFromApiResponse,
} = tbCertificateSlice.actions;

export const tbCertificateReducer = tbCertificateSlice.reducer;

export const selectTbCertificate = (state: RootState) => state.tbCertificate;
