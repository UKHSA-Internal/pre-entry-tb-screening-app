import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxNavigationSliceType } from "../types";

const initialState: ReduxNavigationSliceType = {
  checkSputumPreviousPage: "",
  accessibilityStatementPreviousPage: "",
  privacyNoticePreviousPage: "",
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
    setPrivacyNoticePreviousPage: (state, action: PayloadAction<string>) => {
      state.privacyNoticePreviousPage = action.payload;
    },
    clearNavigationDetails: (state) => {
      state.checkSputumPreviousPage = "";
      state.accessibilityStatementPreviousPage = "";
      state.privacyNoticePreviousPage = "";
    },
  },
});

export const {
  setCheckSputumPreviousPage,
  setAccessibilityStatementPreviousPage,
  setPrivacyNoticePreviousPage,
  clearNavigationDetails,
} = navigationSlice.actions;

export const navigationReducer = navigationSlice.reducer;
