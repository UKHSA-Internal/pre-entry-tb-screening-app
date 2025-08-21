import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxNavigationSliceType } from "../applicant";

const initialState: ReduxNavigationSliceType = {
  checkSputumPreviousPage: "",
  accessibilityStatementPreviousPage: "",
  privacyStatementPreviousPage: "",
};

export const navigationSlice = createSlice({
  name: "navigationDetails",
  initialState,
  reducers: {
    setCheckSputumPreviousPage: (state, action: PayloadAction<string>) => {
      state.checkSputumPreviousPage = action.payload;
    },
    setAccessibilityStatementPreviousPage: (state, action: PayloadAction<string>) => {
      state.accessibilityStatementPreviousPage = action.payload;
    },
    setPrivacyStatementPreviousPage: (state, action: PayloadAction<string>) => {
      state.privacyStatementPreviousPage = action.payload;
    },
    clearNavigationDetails: (state) => {
      state.checkSputumPreviousPage = "";
      state.accessibilityStatementPreviousPage = "";
      state.privacyStatementPreviousPage = "";
    },
  },
});

export const {
  setCheckSputumPreviousPage,
  setAccessibilityStatementPreviousPage,
  clearNavigationDetails,
} = navigationSlice.actions;

export const navigationReducer = navigationSlice.reducer;
