import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxNavigationSliceType } from "../types";

const initialState: ReduxNavigationSliceType = {
  checkSputumPreviousPage: "",
  accessibilityStatementPreviousPage: "",
  privacyNoticePreviousPage: "",
  signOutPreviousPage: "",
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
    setSignOutPreviousPage: (state, action: PayloadAction<string>) => {
      state.signOutPreviousPage = action.payload;
    },
    clearNavigationDetails: (state) => {
      state.checkSputumPreviousPage = "";
      state.accessibilityStatementPreviousPage = "";
      state.privacyNoticePreviousPage = "";
      state.signOutPreviousPage = "";
    },
  },
});

export const {
  setCheckSputumPreviousPage,
  setAccessibilityStatementPreviousPage,
  setPrivacyNoticePreviousPage,
  setSignOutPreviousPage,
  clearNavigationDetails,
} = navigationSlice.actions;

export const navigationReducer = navigationSlice.reducer;
