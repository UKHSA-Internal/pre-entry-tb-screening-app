import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceivedApplicationInProgressType, ReceivedApplicationsInProgressType } from "@/types";

const initialState: ReceivedApplicationsInProgressType = { applications: [], cursor: null };

export const applicationsInProgressSlice = createSlice({
  name: "applicationsInProgress",
  initialState,
  reducers: {
    setApplicationsInProgress: (
      state,
      action: PayloadAction<ReceivedApplicationInProgressType[]>,
    ) => {
      state.applications.splice(0, state.applications.length);
      state.applications.push(...action.payload);
    },
    clearApplicationsInProgress: () => {
      return { applications: [], cursor: null };
    },
  },
});

export const { setApplicationsInProgress, clearApplicationsInProgress } =
  applicationsInProgressSlice.actions;

export const applicationsInProgressReducer = applicationsInProgressSlice.reducer;
