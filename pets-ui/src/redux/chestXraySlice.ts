import { ChestXrayDetailsType } from "@/applicant";
import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChestXrayDetailsType = {
  chestXrayTaken: false,
  posteroAnteriorFile: "",
  apicalLordoticXray: false,
  apicalLordoticXrayFile: "",
  lateralDecubitus: false,
  lateralDecubitusFile: "",
  reasonWhyCxrWasNotDone2: null,
  reasonWhyCxrWasNotDone3: null,
  dateOfCxr: null,
  radiologicalOutcome: "",
  radiologicalOutcomeNotes: null,
  radiologicalFinding: null,
  dateOfRadiologicalInterpretation: null,
  sputumCollected: false,
  reasonWhySputumNotRequired: null,
};

export const chestXraySlice = createSlice({
  name: "chestXrayDetails",
  initialState,
  reducers: {
    setChestXrayTaken: (state, action: PayloadAction<boolean | string>) => {
      state.chestXrayTaken = action.payload;
    },

    clearChestXrayDetails: (state) => {
      state.chestXrayTaken = false;
    },
  },
});

export const { setChestXrayTaken, clearChestXrayDetails } = chestXraySlice.actions;

export const chestXrayReducer = chestXraySlice.reducer;

export const selectChestXray = (state: RootState) => state.chestXray;
