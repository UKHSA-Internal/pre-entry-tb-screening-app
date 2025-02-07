import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChestXrayType = {
  posteroAnteriorFile: "",
  apicalLordoticXray: false,
  apicalLordoticXrayFile: "",
  lateralDecubitus: false,
  lateralDecubitusFile: "",
};

export const chestXraySlice = createSlice({
  name: "chestXrayDetails",
  initialState,
  reducers: {
    setPosteroAnteriorFile: (state, action: PayloadAction<string | null>) => {
      state.posteroAnteriorFile = action.payload;
    },
    setApicalLordoticXray: (state, action: PayloadAction<boolean | string>) => {
      if (typeof action.payload === "string") {
        if (action.payload === "yes") {
          state.apicalLordoticXray = true;
        } else {
          state.apicalLordoticXray = false;
        }
      } else {
        state.apicalLordoticXray = action.payload;
      }
    },
    setApicalLordoticXrayFile: (state, action: PayloadAction<string | null>) => {
      state.apicalLordoticXrayFile = action.payload;
    },
    setLateralDecubitus: (state, action: PayloadAction<boolean | string>) => {
      if (typeof action.payload === "string") {
        if (action.payload === "yes") {
          state.lateralDecubitus = true;
        } else {
          state.lateralDecubitus = false;
        }
      } else {
        state.lateralDecubitus = action.payload;
      }
    },
    setLateralDecubitusFile: (state, action: PayloadAction<string | null>) => {
      state.lateralDecubitusFile = action.payload;
    },

    clearChestXrayDetails: (state) => {
      state.posteroAnteriorFile = "";
      state.apicalLordoticXray = false;
      state.apicalLordoticXrayFile = "";
      state.lateralDecubitus = false;
      state.lateralDecubitusFile = "";
    },
  },
});

export const {
  setPosteroAnteriorFile,
  setApicalLordoticXray,
  setApicalLordoticXrayFile,
  setLateralDecubitus,
  setLateralDecubitusFile,
  clearChestXrayDetails,
} = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;

export const selectChestXray = (state: RootState) => state.chestXray;
