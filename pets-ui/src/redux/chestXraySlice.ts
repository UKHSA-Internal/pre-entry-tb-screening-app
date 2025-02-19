import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ChestXrayDetailsType } from "@/applicant";

const initialState: ChestXrayDetailsType = {
  cxrTaken: false,
  posteroAnteriorXray: null,
  apicalLordoticXray: null,
  lateralDecubitusXray: null,
  reasonXrayNotTaken: "",
  reasonXrayNotTakenDetail: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayFindingsList: [],
};

export const chestXraySlice = createSlice({
  name: "chestXrayDetails",
  initialState,
  reducers: {
    setCxrTaken: (state, action: PayloadAction<boolean>) => {
      state.cxrTaken = action.payload;
    },
    setPosteroAnteriorXray: (state, action: PayloadAction<string | null>) => {
      state.posteroAnteriorXray = action.payload;
    },
    setApicalLordoticXray: (state, action: PayloadAction<string | null>) => {
      state.apicalLordoticXray = action.payload;
    },
    setLateralDecubitusXray: (state, action: PayloadAction<string | null>) => {
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
      state.cxrTaken = false;
      state.posteroAnteriorXray = null;
      state.apicalLordoticXray = null;
      state.lateralDecubitusXray = null;
      state.reasonXrayNotTaken = "";
      state.reasonXrayNotTakenDetail = "";
      state.xrayResult = "";
      state.xrayResultDetail = "";
      state.xrayFindingsList = [];
    },
  },
});

export const {
  setCxrTaken,
  setPosteroAnteriorXray,
  setApicalLordoticXray,
  setLateralDecubitusXray,
  setReasonXrayNotTaken,
  setReasonXrayNotTakenDetail,
  setXrayResult,
  setXrayResultDetail,
  setXrayFindingsList,
} = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;

export const selectChestXray = (state: RootState) => state.chestXray;
