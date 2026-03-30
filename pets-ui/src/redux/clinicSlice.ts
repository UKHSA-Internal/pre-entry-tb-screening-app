import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxClinicDetailsType } from "@/types";

const initialState: ReduxClinicDetailsType = {
  clinicId: "",
};

export const clinicSlice = createSlice({
  name: "clinicDetails",
  initialState,
  reducers: {
    setUserClinicId: (state, action: PayloadAction<string>) => {
      state.clinicId = action.payload;
    },
    clearClinicDetails: (state) => {
      state.clinicId = "";
    },
  },
});

export const { setUserClinicId, clearClinicDetails } = clinicSlice.actions;

export const clinicReducer = clinicSlice.reducer;
