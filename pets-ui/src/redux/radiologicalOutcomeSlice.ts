import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ReceivedRadiologicalOutcomeDetailsType,
  ReduxRadiologicalOutcomeDetailsType,
} from "@/applicant";
import { ApplicationStatus, BackendApplicationStatus, YesOrNo } from "@/utils/enums";

const initialState: ReduxRadiologicalOutcomeDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  chestXrayTaken: YesOrNo.NULL,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  isSputumRequired: YesOrNo.NULL,
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
    setChestXrayTaken: (state, action: PayloadAction<YesOrNo>) => {
      state.chestXrayTaken = action.payload;
    },
    setPosteroAnteriorXrayFileName: (state, action: PayloadAction<string>) => {
      state.posteroAnteriorXrayFileName = action.payload;
    },
    setApicalLordoticXrayFileName: (state, action: PayloadAction<string>) => {
      state.apicalLordoticXrayFileName = action.payload;
    },
    setLateralDecubitusXrayFileName: (state, action: PayloadAction<string>) => {
      state.lateralDecubitusXrayFileName = action.payload;
    },
    setPosteroAnteriorXrayFile: (state, action: PayloadAction<string>) => {
      state.posteroAnteriorXrayFile = action.payload;
    },
    setApicalLordoticXrayFile: (state, action: PayloadAction<string | undefined>) => {
      state.apicalLordoticXrayFile = action.payload;
    },
    setLateralDecubitusXrayFile: (state, action: PayloadAction<string | undefined>) => {
      state.lateralDecubitusXrayFile = action.payload;
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
    setSputumCollectionTaken: (state, action: PayloadAction<YesOrNo>) => {
      state.isSputumRequired = action.payload;
    },
    setRadiologicalOutcomeDetails: (
      state,
      action: PayloadAction<ReduxRadiologicalOutcomeDetailsType>,
    ) => {
      state.chestXrayTaken = action.payload.chestXrayTaken;
      state.posteroAnteriorXrayFileName = action.payload.posteroAnteriorXrayFileName;
      state.apicalLordoticXrayFileName = action.payload.apicalLordoticXrayFileName;
      state.lateralDecubitusXrayFileName = action.payload.lateralDecubitusXrayFileName;
      state.posteroAnteriorXrayFile = action.payload.posteroAnteriorXrayFile;
      state.apicalLordoticXrayFile = action.payload.apicalLordoticXrayFile;
      state.lateralDecubitusXrayFile = action.payload.lateralDecubitusXrayFile;
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
      state.isSputumRequired = action.payload.isSputumRequired;
    },
    clearChestXrayTakenDetails: (state) => {
      state.posteroAnteriorXrayFileName = "";
      state.apicalLordoticXrayFileName = "";
      state.lateralDecubitusXrayFileName = "";
      state.posteroAnteriorXrayFile = "";
      state.apicalLordoticXrayFile = "";
      state.lateralDecubitusXrayFile = "";
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
    clearIsSputumRequired: (state) => {
      state.isSputumRequired = YesOrNo.NULL;
    },
    clearRadiologicalOutcomeDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.chestXrayTaken = YesOrNo.NULL;
      state.posteroAnteriorXrayFileName = "";
      state.apicalLordoticXrayFileName = "";
      state.lateralDecubitusXrayFileName = "";
      state.posteroAnteriorXrayFile = "";
      state.apicalLordoticXrayFile = "";
      state.lateralDecubitusXrayFile = "";
      state.reasonXrayWasNotTaken = "";
      state.xrayWasNotTakenFurtherDetails = "";
      state.xrayResult = "";
      state.xrayResultDetail = "";
      state.xrayMinorFindings = [];
      state.xrayAssociatedMinorFindings = [];
      state.xrayActiveTbFindings = [];
      state.isSputumRequired = YesOrNo.NULL;
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
      state.chestXrayTaken = action.payload.chestXrayTaken;
      state.posteroAnteriorXrayFileName = action.payload.posteroAnteriorXrayFileName;
      state.posteroAnteriorXrayFile = action.payload.posteroAnteriorXray;
      state.apicalLordoticXrayFileName = action.payload.apicalLordoticXrayFileName;
      state.apicalLordoticXrayFile = action.payload.apicalLordoticXray;
      state.lateralDecubitusXrayFileName = action.payload.lateralDecubitusXrayFileName;
      state.lateralDecubitusXrayFile = action.payload.lateralDecubitusXray;
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
      state.isSputumRequired = action.payload.isSputumRequired;
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
  setChestXrayTaken,
  setSputumCollectionTaken,
  setPosteroAnteriorXrayFileName,
  setApicalLordoticXrayFileName,
  setLateralDecubitusXrayFileName,
  setPosteroAnteriorXrayFile,
  setApicalLordoticXrayFile,
  setLateralDecubitusXrayFile,
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
  clearIsSputumRequired,
  clearRadiologicalOutcomeDetails,
  setRadiologicalOutcomeFromApiResponse,
} = radiologicalOutcomeSlice.actions;

export const radiologicalOutcomeReducer = radiologicalOutcomeSlice.reducer;
