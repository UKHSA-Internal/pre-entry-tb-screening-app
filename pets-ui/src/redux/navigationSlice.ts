import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxNavigationSliceType } from "@/applicant";

const initialState: ReduxNavigationSliceType = {
  checkSputumPreviousPage: "",
};

export const navigationSlice = createSlice({
  name: "navigationDetails",
  initialState,
  reducers: {
    setCheckSputumPreviousPage: (state, action: PayloadAction<string>) => {
      state.checkSputumPreviousPage = action.payload;
    },
    clearNavigationDetails: (state) => {
      state.checkSputumPreviousPage = "";
    },
  },
});

export const { setCheckSputumPreviousPage, clearNavigationDetails } = navigationSlice.actions;

export const navigationReducer = navigationSlice.reducer;
