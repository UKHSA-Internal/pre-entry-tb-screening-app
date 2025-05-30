import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReceivedTbCertificateType, ReduxTbCertificateType } from "@/applicant";
import { ApplicationStatus, BackendApplicationStatus, YesOrNo } from "@/utils/enums";

const initialState: ReduxTbCertificateType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  isIssued: YesOrNo.NULL,
  comments: "",
  certificateDate: {
    year: "",
    month: "",
    day: "",
  },
  certificateNumber: "",
};

export const tbCertificateSlice = createSlice({
  name: "tbCertificateDetails",
  initialState,
  reducers: {
    setTbCertificateStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
    setIsIssued: (state, action: PayloadAction<YesOrNo>) => {
      state.isIssued = action.payload;
    },
    setComments: (state, action: PayloadAction<string>) => {
      state.comments = action.payload;
    },
    setCertficateDate: (state, action: PayloadAction<DateType>) => {
      state.certificateDate = action.payload;
    },
    setCertificateNumber: (state, action: PayloadAction<string>) => {
      state.certificateNumber = action.payload;
    },
    clearTbCertificateDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.isIssued = YesOrNo.NULL;
      state.comments = "";
      state.certificateDate = { year: "", month: "", day: "" };
      state.certificateNumber = "";
    },
    setTbCertificateFromApiResponse: (state, action: PayloadAction<ReceivedTbCertificateType>) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;
      state.isIssued = action.payload.isIssued;
      state.comments = action.payload.comments;
      state.certificateDate = {
        year: action.payload.issueDate.split("-")[0],
        month: action.payload.issueDate.split("-")[1],
        day: action.payload.issueDate.split("-")[2],
      };
      state.certificateNumber = action.payload.certificateNumber;
    },
  },
});

export const {
  setTbCertificateStatus,
  setIsIssued,
  setComments,
  setCertficateDate,
  setCertificateNumber,
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} = tbCertificateSlice.actions;

export const tbCertificateReducer = tbCertificateSlice.reducer;

export const selectTbCertificate = (state: RootState) => state.tbCertificate;
