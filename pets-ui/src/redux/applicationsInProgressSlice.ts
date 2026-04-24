import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceivedApplicationInProgressType } from "@/types";

const initialState: ReceivedApplicationInProgressType[] = [];

export const applicationsInProgressSlice = createSlice({
  name: "applicationsInProgress",
  initialState,
  reducers: {
    setApplicationsInProgress: (
      state,
      action: PayloadAction<ReceivedApplicationInProgressType[]>,
    ) => {
      state.splice(0, state.length);
      state.push(...action.payload);
    },
    clearApplicationsInProgress: () => {
      return [];
    },
  },
});

export const { setApplicationsInProgress, clearApplicationsInProgress } =
  applicationsInProgressSlice.actions;

export const applicationsInProgressReducer = applicationsInProgressSlice.reducer;
