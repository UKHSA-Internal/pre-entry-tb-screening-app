import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ReceivedRadiologicalOutcomeDetailsType,
  ReduxRadiologicalOutcomeDetailsType,
} from "@/types";
import { ApplicationStatus, BackendApplicationStatus } from "@/utils/enums";

const initialState: ReduxRadiologicalOutcomeDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  completionDate: {
    year: "",
    month: "",
    day: "",
  },
};

export const radiologicalOutcomeSlice = createSlice({
  name: "radiologicalOutcomeDetails",
  initialState,
  reducers: {
    setRadiologicalOutcomeStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
    setReasonXrayWasNotTaken: (state, action: PayloadAction<string>) => {
      state.reasonXrayWasNotTaken = action.payload;
    },
    setXrayResult: (state, action: PayloadAction<string>) => {
      state.xrayResult = action.payload;
    },
    setXrayResultDetail: (state, action: PayloadAction<string>) => {
      state.xrayResultDetail = action.payload;
    },
    setXrayMinorFindings: (state, action: PayloadAction<string[]>) => {
      state.xrayMinorFindings = action.payload ? [...action.payload] : [];
    },
    setXrayAssociatedMinorFindings: (state, action: PayloadAction<string[]>) => {
      state.xrayAssociatedMinorFindings = action.payload ? [...action.payload] : [];
    },
    setXrayActiveTbFindings: (state, action: PayloadAction<string[]>) => {
      state.xrayActiveTbFindings = action.payload ? [...action.payload] : [];
    },
    setXrayWasNotTakenFurtherDetails: (state, action: PayloadAction<string>) => {
      state.xrayWasNotTakenFurtherDetails = action.payload;
    },
    setRadiologicalOutcomeDetails: (
      state,
      action: PayloadAction<ReduxRadiologicalOutcomeDetailsType>,
    ) => {
      state.reasonXrayWasNotTaken = action.payload.reasonXrayWasNotTaken;
      state.xrayWasNotTakenFurtherDetails = action.payload.xrayWasNotTakenFurtherDetails;
      state.xrayResult = action.payload.xrayResult;
      state.xrayResultDetail = action.payload.xrayResultDetail;
      state.xrayMinorFindings = action.payload.xrayMinorFindings
        ? [...action.payload.xrayMinorFindings]
        : [];
      state.xrayAssociatedMinorFindings = action.payload.xrayAssociatedMinorFindings
        ? [...action.payload.xrayAssociatedMinorFindings]
        : [];
      state.xrayActiveTbFindings = action.payload.xrayActiveTbFindings
        ? [...action.payload.xrayActiveTbFindings]
        : [];
    },
    clearChestXrayTakenDetails: (state) => {
      state.xrayResult = "";
      state.xrayResultDetail = "";
      state.xrayMinorFindings = [];
      state.xrayAssociatedMinorFindings = [];
      state.xrayActiveTbFindings = [];
    },
    clearChestXrayNotTakenDetails: (state) => {
      state.reasonXrayWasNotTaken = "";
      state.xrayWasNotTakenFurtherDetails = "";
    },
    clearRadiologicalOutcomeDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.reasonXrayWasNotTaken = "";
      state.xrayWasNotTakenFurtherDetails = "";
      state.xrayResult = "";
      state.xrayResultDetail = "";
      state.xrayMinorFindings = [];
      state.xrayAssociatedMinorFindings = [];
      state.xrayActiveTbFindings = [];
      state.completionDate = {
        year: "",
        month: "",
        day: "",
      };
    },
    setRadiologicalOutcomeFromApiResponse: (
      state,
      action: PayloadAction<ReceivedRadiologicalOutcomeDetailsType>,
    ) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;
      state.xrayResult = action.payload.xrayResult;
      state.xrayResultDetail = action.payload.xrayResultDetail;
      state.xrayMinorFindings = action.payload.xrayMinorFindings
        ? [...action.payload.xrayMinorFindings]
        : [];
      state.xrayAssociatedMinorFindings = action.payload.xrayAssociatedMinorFindings
        ? [...action.payload.xrayAssociatedMinorFindings]
        : [];
      state.xrayActiveTbFindings = action.payload.xrayActiveTbFindings
        ? [...action.payload.xrayActiveTbFindings]
        : [];
      state.completionDate = action.payload.dateCreated
        ? {
            year: action.payload.dateCreated.split("-")[0],
            month: action.payload.dateCreated.split("-")[1],
            day: action.payload.dateCreated.includes("T")
              ? action.payload.dateCreated.split("-")[2].split("T")[0]
              : action.payload.dateCreated.split("-")[2],
          }
        : {
            year: "",
            month: "",
            day: "",
          };
    },
  },
});

export const {
  setRadiologicalOutcomeStatus,
  setReasonXrayWasNotTaken,
  setXrayWasNotTakenFurtherDetails,
  setXrayResult,
  setXrayResultDetail,
  setXrayMinorFindings,
  setXrayAssociatedMinorFindings,
  setXrayActiveTbFindings,
  setRadiologicalOutcomeDetails,
  clearChestXrayTakenDetails,
  clearChestXrayNotTakenDetails,
  clearRadiologicalOutcomeDetails,
  setRadiologicalOutcomeFromApiResponse,
} = radiologicalOutcomeSlice.actions;

export const radiologicalOutcomeReducer = radiologicalOutcomeSlice.reducer;
