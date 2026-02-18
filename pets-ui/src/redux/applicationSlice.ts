import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReduxApplicationDetailsType } from "@/types";
import { ApplicationStatus } from "@/utils/enums";

const initialState: ReduxApplicationDetailsType = {
  applicationId: "",
  dateCreated: {
    year: "",
    month: "",
    day: "",
  },
  applicationStatus: ApplicationStatus.NULL,
  cancellationReason: "",
  cancellationFurtherInfo: "",
};

export const applicationSlice = createSlice({
  name: "applicationDetails",
  initialState,
  reducers: {
    setApplicationId: (state, action: PayloadAction<string>) => {
      state.applicationId = action.payload;
    },
    setDateCreated: (state, action: PayloadAction<DateType>) => {
      state.dateCreated = action.payload;
    },
    setTaskStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.applicationStatus = action.payload;
    },
    setCancellationReason: (state, action: PayloadAction<string>) => {
      state.cancellationReason = action.payload;
    },
    setCancellationFurtherInfo: (state, action: PayloadAction<string>) => {
      state.cancellationFurtherInfo = action.payload;
    },
    setApplicationDetails: (state, action: PayloadAction<ReduxApplicationDetailsType>) => {
      state.applicationId = action.payload.applicationId;
      state.dateCreated = action.payload.dateCreated;
      state.applicationStatus = action.payload.applicationStatus;
      state.cancellationReason = action.payload.cancellationReason || "";
      state.cancellationFurtherInfo = action.payload.cancellationFurtherInfo || "";
    },
    clearApplicationDetails: (state) => {
      state.applicationId = "";
      state.dateCreated = {
        year: "",
        month: "",
        day: "",
      };
      state.applicationStatus = ApplicationStatus.NULL;
      state.cancellationReason = "";
      state.cancellationFurtherInfo = "";
    },
  },
});

export const {
  setApplicationId,
  setDateCreated,
  setTaskStatus,
  setCancellationReason,
  setCancellationFurtherInfo,
  setApplicationDetails,
  clearApplicationDetails,
} = applicationSlice.actions;

export const applicationReducer = applicationSlice.reducer;
