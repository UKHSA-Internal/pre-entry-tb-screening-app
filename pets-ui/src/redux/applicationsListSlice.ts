import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceivedApplicationListType, ReduxApplicationDetailsType } from "@/types";
import { convertDateStrToObj } from "@/utils/helpers";

const initialState: ReduxApplicationDetailsType[] = [];

export const applicationsListSlice = createSlice({
  name: "applicationsListDetails",
  initialState,
  reducers: {
    setApplicationsListDetails: (state, action: PayloadAction<ReduxApplicationDetailsType[]>) => {
      state.splice(0, state.length);
      state.push(...action.payload);
    },
    setApplicationsListDetailsFromApiResponse: (
      state,
      action: PayloadAction<ReceivedApplicationListType[]>,
    ) => {
      const appListWithCorrectedDates: ReduxApplicationDetailsType[] = [];
      for (const application of action.payload) {
        appListWithCorrectedDates.push({
          ...application,
          dateCreated: convertDateStrToObj(application.dateCreated),
          dateUpdated: application.dateUpdated
            ? convertDateStrToObj(application.dateUpdated)
            : { year: "", month: "", day: "" },
          expiryDate: application.expiryDate
            ? convertDateStrToObj(application.expiryDate)
            : { year: "", month: "", day: "" },
        });
      }
      state.push(...appListWithCorrectedDates);
    },
    clearApplicationsListDetails: () => {
      return [];
    },
  },
});

export const {
  setApplicationsListDetails,
  setApplicationsListDetailsFromApiResponse,
  clearApplicationsListDetails,
} = applicationsListSlice.actions;

export const applicationsListReducer = applicationsListSlice.reducer;
