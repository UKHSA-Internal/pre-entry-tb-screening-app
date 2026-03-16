import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceivedApplicationListType, ReduxApplicationDetailsType } from "@/types";
import { convertDateStrToObj } from "@/utils/helpers";

const initialState: ReduxApplicationDetailsType[] = [];

export const applicationsListSlice = createSlice({
  name: "applicationsListDetails",
  initialState,
  reducers: {
    setApplicationsListDetails: (state, action: PayloadAction<ReceivedApplicationListType[]>) => {
      const appListWithCorrectedDates: ReduxApplicationDetailsType[] = [];
      for (const application of action.payload) {
        appListWithCorrectedDates.push({
          ...application,
          dateCreated: convertDateStrToObj(application.dateCreated),
          dateUpdated: application.dateUpdated
            ? convertDateStrToObj(application.dateUpdated)
            : undefined,
          expiryDate: application.expiryDate
            ? convertDateStrToObj(application.expiryDate)
            : undefined,
        });
      }
      state.push(...appListWithCorrectedDates);
    },
    clearApplicationsListDetails: () => {
      return [];
    },
  },
});

export const { setApplicationsListDetails, clearApplicationsListDetails } =
  applicationsListSlice.actions;

export const applicationsListReducer = applicationsListSlice.reducer;
