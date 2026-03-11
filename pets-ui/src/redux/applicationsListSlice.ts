import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxApplicationDetailsType } from "@/types";

const initialState: ReduxApplicationDetailsType[] = [];

export const applicationsListSlice = createSlice({
  name: "applicationsListDetails",
  initialState,
  reducers: {
    setApplicationsListDetails: (state, action: PayloadAction<ReduxApplicationDetailsType[]>) => {
      state.push(...action.payload);
    },
    clearApplicationsListDetails: () => {
      return [];
    },
  },
});

export const { setApplicationsListDetails, clearApplicationsListDetails } =
  applicationsListSlice.actions;

export const applicationsListReducer = applicationsListSlice.reducer;
