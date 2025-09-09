import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReceivedChestXrayDetailsType, ReduxChestXrayDetailsType } from "@/types";
import { ApplicationStatus, BackendApplicationStatus } from "@/utils/enums";

const initialState: ReduxChestXrayDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  dateXrayTaken: {
    year: "",
    month: "",
    day: "",
  },
};

export const chestXraySlice = createSlice({
  name: "chestXrayDetails",
  initialState,
  reducers: {
    setChestXrayStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
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
    setDateXrayTaken: (state, action: PayloadAction<DateType>) => {
      state.dateXrayTaken = action.payload;
    },
    setChestXrayDetails: (state, action: PayloadAction<ReduxChestXrayDetailsType>) => {
      state.posteroAnteriorXrayFileName = action.payload.posteroAnteriorXrayFileName;
      state.apicalLordoticXrayFileName = action.payload.apicalLordoticXrayFileName;
      state.lateralDecubitusXrayFileName = action.payload.lateralDecubitusXrayFileName;
      state.posteroAnteriorXrayFile = action.payload.posteroAnteriorXrayFile;
      state.apicalLordoticXrayFile = action.payload.apicalLordoticXrayFile;
      state.lateralDecubitusXrayFile = action.payload.lateralDecubitusXrayFile;
    },
    clearChestXrayDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.posteroAnteriorXrayFileName = "";
      state.apicalLordoticXrayFileName = "";
      state.lateralDecubitusXrayFileName = "";
      state.posteroAnteriorXrayFile = "";
      state.apicalLordoticXrayFile = "";
      state.lateralDecubitusXrayFile = "";
      state.dateXrayTaken = {
        year: "",
        month: "",
        day: "",
      };
    },
    setChestXrayFromApiResponse: (state, action: PayloadAction<ReceivedChestXrayDetailsType>) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;
      state.posteroAnteriorXrayFileName = action.payload.posteroAnteriorXrayFileName;
      state.posteroAnteriorXrayFile = action.payload.posteroAnteriorXray;
      state.apicalLordoticXrayFileName = action.payload.apicalLordoticXrayFileName;
      state.apicalLordoticXrayFile = action.payload.apicalLordoticXray;
      state.lateralDecubitusXrayFileName = action.payload.lateralDecubitusXrayFileName;
      state.lateralDecubitusXrayFile = action.payload.lateralDecubitusXray;
      state.dateXrayTaken = action.payload.dateXrayTaken
        ? {
            year: action.payload.dateXrayTaken.split("-")[0],
            month: action.payload.dateXrayTaken.split("-")[1],
            day: action.payload.dateXrayTaken.includes("T")
              ? action.payload.dateXrayTaken.split("-")[2].split("T")[0]
              : action.payload.dateXrayTaken.split("-")[2],
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
  setChestXrayStatus,
  setPosteroAnteriorXrayFileName,
  setApicalLordoticXrayFileName,
  setLateralDecubitusXrayFileName,
  setPosteroAnteriorXrayFile,
  setApicalLordoticXrayFile,
  setLateralDecubitusXrayFile,
  setDateXrayTaken,
  setChestXrayDetails,
  clearChestXrayDetails,
  setChestXrayFromApiResponse,
} = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;
