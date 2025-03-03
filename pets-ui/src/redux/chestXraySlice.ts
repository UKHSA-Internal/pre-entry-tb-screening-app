import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ChestXrayDetailsType } from "@/applicant";

const initialState: ChestXrayDetailsType = {
  chestXrayTaken: false,
  posteroAnteriorXray: false,
  posteroAnteriorXrayFile: "",
  apicalLordoticXray: false,
  apicalLordoticXrayFile: "",
  lateralDecubitusXray: false,
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
  xrayFindingsList: [],
};

export const chestXraySlice = createSlice({
  name: "chestXrayDetails",
  initialState,
  reducers: {
    setChestXrayTaken: (state, action: PayloadAction<boolean | string>) => {
      state.chestXrayTaken = action.payload;
    },
    setPosteroAnteriorXray: (state, action: PayloadAction<string | boolean>) => {
      state.posteroAnteriorXray = action.payload;
    },
    setApicalLordoticXray: (state, action: PayloadAction<string | boolean>) => {
      state.apicalLordoticXray = action.payload;
    },
    setLateralDecubitusXray: (state, action: PayloadAction<string | boolean>) => {
      state.lateralDecubitusXray = action.payload;
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
    setXrayFindingsList: (state, action: PayloadAction<string[]>) => {
      state.xrayFindingsList = action.payload;
    },
    setXrayWasNotTakenFurtherDetails: (state, action: PayloadAction<string | null>) => {
      state.xrayWasNotTakenFurtherDetails = action.payload;
    },
    clearChestXrayDetails: (state) => {
      state.chestXrayTaken = false;
      state.posteroAnteriorXray = false;
      state.apicalLordoticXray = false;
      state.lateralDecubitusXray = false;
      state.posteroAnteriorXrayFile = "";
      state.apicalLordoticXrayFile = "";
      state.lateralDecubitusXrayFile = "";
      state.reasonXrayWasNotTaken = "";
      state.reasonXrayNotTakenDetail = "";
      state.xrayWasNotTakenFurtherDetails = "";
      state.xrayResult = "";
      state.xrayResultDetail = "";
      state.xrayFindingsList = [];
    },
  },
});

export const {
  setChestXrayTaken,
  setPosteroAnteriorXray,
  setApicalLordoticXray,
  setLateralDecubitusXray,
  setPosteroAnteriorXrayFile,
  setApicalLordoticXrayFile,
  setLateralDecubitusXrayFile,
  setReasonXrayWasNotTaken,
  setReasonXrayNotTakenDetail,
  setXrayWasNotTakenFurtherDetails,
  setXrayResult,
  setXrayResultDetail,
  setXrayFindingsList,
  clearChestXrayDetails,
} = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;

export const selectChestXray = (state: RootState) => state.chestXray;
