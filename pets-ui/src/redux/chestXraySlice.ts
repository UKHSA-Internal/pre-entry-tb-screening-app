import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxChestXrayDetailsType } from "@/applicant";

const initialState: ReduxChestXrayDetailsType = {
  chestXrayTaken: false,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  reasonXrayWasNotTaken: null,
  xrayWasNotTakenFurtherDetails: "",
  reasonXrayNotTakenDetail: null,
  dateOfCxr: null,
  radiologicalOutcome: "",
  radiologicalOutcomeNotes: null,
  radiologicalFinding: null,
  dateOfRadiologicalInterpretation: null,
  sputumCollected: false,
  reasonWhySputumNotRequired: null,
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
};

export const chestXraySlice = createSlice({
  name: "chestXrayDetails",
  initialState,
  reducers: {
    setChestXrayTaken: (state, action: PayloadAction<boolean | string>) => {
      state.chestXrayTaken = action.payload;
    },
    setPosteroAnteriorXrayFileName: (state, action: PayloadAction<string | null>) => {
      state.posteroAnteriorXrayFileName = action.payload;
    },
    setApicalLordoticXrayFileName: (state, action: PayloadAction<string | null>) => {
      state.apicalLordoticXrayFileName = action.payload;
    },
    setLateralDecubitusXrayFileName: (state, action: PayloadAction<string | null>) => {
      state.lateralDecubitusXrayFileName = action.payload;
    },
    setPosteroAnteriorXrayFile: (state, action: PayloadAction<string | null>) => {
      state.posteroAnteriorXrayFile = action.payload;
    },
    setApicalLordoticXrayFile: (state, action: PayloadAction<string | null>) => {
      state.apicalLordoticXrayFile = action.payload;
    },
    setLateralDecubitusXrayFile: (state, action: PayloadAction<string | null>) => {
      state.lateralDecubitusXrayFile = action.payload;
    },
    setReasonXrayWasNotTaken: (state, action: PayloadAction<string | null>) => {
      state.reasonXrayWasNotTaken = action.payload;
    },
    setReasonXrayNotTakenDetail: (state, action: PayloadAction<string>) => {
      state.reasonXrayNotTakenDetail = action.payload;
    },
    setXrayResult: (state, action: PayloadAction<string>) => {
      state.xrayResult = action.payload;
    },
    setXrayResultDetail: (state, action: PayloadAction<string>) => {
      state.xrayResultDetail = action.payload;
    },
    setXrayMinorFindings: (state, action: PayloadAction<string[]>) => {
      state.xrayMinorFindings = action.payload;
    },
    setXrayAssociatedMinorFindings: (state, action: PayloadAction<string[]>) => {
      state.xrayAssociatedMinorFindings = action.payload;
    },
    setXrayActiveTbFindings: (state, action: PayloadAction<string[]>) => {
      state.xrayActiveTbFindings = action.payload;
    },
    setXrayWasNotTakenFurtherDetails: (state, action: PayloadAction<string | null>) => {
      state.xrayWasNotTakenFurtherDetails = action.payload;
    },
    clearChestXrayDetails: (state) => {
      state.chestXrayTaken = false;
      state.posteroAnteriorXrayFileName = "";
      state.apicalLordoticXrayFileName = "";
      state.lateralDecubitusXrayFileName = "";
      state.posteroAnteriorXrayFile = "";
      state.apicalLordoticXrayFile = "";
      state.lateralDecubitusXrayFile = "";
      state.reasonXrayWasNotTaken = "";
      state.reasonXrayNotTakenDetail = "";
      state.xrayWasNotTakenFurtherDetails = "";
      state.xrayResult = "";
      state.xrayResultDetail = "";
      state.xrayMinorFindings = [];
      state.xrayAssociatedMinorFindings = [];
      state.xrayActiveTbFindings = [];
    },
  },
});

export const {
  setChestXrayTaken,
  setPosteroAnteriorXrayFileName,
  setApicalLordoticXrayFileName,
  setLateralDecubitusXrayFileName,
  setPosteroAnteriorXrayFile,
  setApicalLordoticXrayFile,
  setLateralDecubitusXrayFile,
  setReasonXrayWasNotTaken,
  setReasonXrayNotTakenDetail,
  setXrayWasNotTakenFurtherDetails,
  setXrayResult,
  setXrayResultDetail,
  setXrayMinorFindings,
  setXrayAssociatedMinorFindings,
  setXrayActiveTbFindings,
  clearChestXrayDetails,
} = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;

export const selectChestXray = (state: RootState) => state.chestXray;
