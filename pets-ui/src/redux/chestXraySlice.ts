import { ChestXrayDetailsType } from "@/applicant";
import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChestXrayDetailsType = {
  chestXrayTaken: false,
  posteroAnteriorFile: "",
  apicalLordoticXray: false,
  apicalLordoticXrayFile: "",
  lateralDecubitusXray: false,
  lateralDecubitusFile: "",
  reasonXrayNotTaken: null,
  reasonXrayNotTakenDetail: null,
  dateOfCxr: null,
  radiologicalOutcome: "",
  radiologicalOutcomeNotes: null,
  radiologicalFinding: null,
  dateOfRadiologicalInterpretation: null,
  sputumCollected: false,
  reasonWhySputumNotRequired: null,
  posteroAnteriorXray: "",
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
    setReasonXrayNotTaken: (state, action: PayloadAction<string>) => {
      state.reasonXrayNotTaken = action.payload;
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
    clearChestXrayDetails: (state) => {
      state.chestXrayTaken = false;
      state.posteroAnteriorXray = false;
      state.apicalLordoticXray = false;
      state.lateralDecubitusXray = false;
      state.reasonXrayNotTaken = "";
      state.reasonXrayNotTakenDetail = "";
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
  setReasonXrayNotTaken,
  setReasonXrayNotTakenDetail,
  setXrayResult,
  setXrayResultDetail,
  setXrayFindingsList,
  clearChestXrayDetails,
} = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;

export const selectChestXray = (state: RootState) => state.chestXray;
