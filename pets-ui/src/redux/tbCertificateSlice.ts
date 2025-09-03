import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ClinicType,
  DateType,
  ReceivedTbCertificateType,
  ReduxTbCertificateType,
} from "@/applicant";
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
  reasonNotIssued: "",
  declaringPhysicianName: "",
  clinic: {
    clinicId: "",
    name: "",
    country: "",
    city: "",
    startDate: "",
    createdBy: "",
  },
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
    setReasonNotIssued: (state, action: PayloadAction<string>) => {
      state.reasonNotIssued = action.payload;
    },
    setDeclaringPhysicianName: (state, action: PayloadAction<string>) => {
      state.declaringPhysicianName = action.payload;
    },
    setClinic: (state, action: PayloadAction<ClinicType>) => {
      state.clinic = action.payload;
    },
    clearTbCertificateDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.isIssued = YesOrNo.NULL;
      state.comments = "";
      state.certificateDate = { year: "", month: "", day: "" };
      state.certificateNumber = "";
      state.reasonNotIssued = "";
      state.declaringPhysicianName = "";
      state.clinic = {
        clinicId: "",
        name: "",
        country: "",
        city: "",
        startDate: "",
        createdBy: "",
      };
    },
    setTbCertificateFromApiResponse: (state, action: PayloadAction<ReceivedTbCertificateType>) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;
      state.isIssued = action.payload.isIssued;
      state.comments = action.payload.comments ?? "";
      state.certificateDate = action.payload.issueDate
        ? {
            year: action.payload.issueDate.split("-")[0],
            month: action.payload.issueDate.split("-")[1],
            day: action.payload.issueDate.includes("T")
              ? action.payload.issueDate.split("-")[2].split("T")[0]
              : action.payload.issueDate.split("-")[2],
          }
        : {
            year: "",
            month: "",
            day: "",
          };
      state.certificateNumber = action.payload.certificateNumber;
      if (action.payload.physicianName) {
        state.declaringPhysicianName = action.payload.physicianName;
      }
      if (action.payload.notIssuedReason) {
        state.reasonNotIssued = action.payload.notIssuedReason;
      }
    },
  },
});

export const {
  setTbCertificateStatus,
  setIsIssued,
  setComments,
  setCertficateDate,
  setCertificateNumber,
  setReasonNotIssued,
  setDeclaringPhysicianName,
  setClinic,
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} = tbCertificateSlice.actions;

export const tbCertificateReducer = tbCertificateSlice.reducer;
