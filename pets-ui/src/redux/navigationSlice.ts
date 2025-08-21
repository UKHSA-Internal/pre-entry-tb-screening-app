import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxNavigationSliceType } from "@/applicant";

const initialState: ReduxNavigationSliceType = {
  checkSputumPreviousPage: "",
  accessibilityStatementPreviousPage: "",
};

export const navigationSlice = createSlice({
  name: "navigationDetails",
  initialState,
  reducers: {
    setCheckSputumPreviousPage: (state, action: PayloadAction<string>) => {
      state.checkSputumPreviousPage = action.payload;
    },
    setPreviousPage: (state, action: PayloadAction<string>) => {
      state.accessibilityStatementPreviousPage = action.payload;
    },
    clearNavigationDetails: (state) => {
      state.checkSputumPreviousPage = "";
      state.accessibilityStatementPreviousPage = "";
    },
  },
});

export const { setCheckSputumPreviousPage, setPreviousPage, clearNavigationDetails } =
  navigationSlice.actions;

export const navigationReducer = navigationSlice.reducer;
