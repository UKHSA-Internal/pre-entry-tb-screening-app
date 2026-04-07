import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DateType, ReduxApplicationDetailsType } from "@/types";
import { ApplicationStatus } from "@/utils/enums";

const initialState: ReduxApplicationDetailsType = {
  applicationStatus: ApplicationStatus.NULL,
  applicationId: "",
  clinicId: "",
  dateCreated: {
    year: "",
    month: "",
    day: "",
  },
  dateUpdated: {
    year: "",
    month: "",
    day: "",
  },
  expiryDate: {
    year: "",
    month: "",
    day: "",
  },
  cancellationReason: "",
  cancellationFurtherInfo: "",
};

export const applicationSlice = createSlice({
  name: "applicationDetails",
  initialState,
  reducers: {
    setApplicationStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.applicationStatus = action.payload;
    },
    setApplicationId: (state, action: PayloadAction<string>) => {
      state.applicationId = action.payload;
    },
    setClinicId: (state, action: PayloadAction<string>) => {
      state.clinicId = action.payload;
    },
    setDateCreated: (state, action: PayloadAction<DateType>) => {
      state.dateCreated = action.payload;
    },
    setDateUpdated: (state, action: PayloadAction<DateType>) => {
      state.dateUpdated = action.payload ?? { year: "", month: "", day: "" };
    },
    setExpiryDate: (state, action: PayloadAction<DateType>) => {
      state.expiryDate = action.payload ?? { year: "", month: "", day: "" };
    },
    setCancellationReason: (state, action: PayloadAction<string>) => {
      state.cancellationReason = action.payload ?? "";
    },
    setCancellationFurtherInfo: (state, action: PayloadAction<string>) => {
      state.cancellationFurtherInfo = action.payload ?? "";
    },
    setApplicationDetails: (state, action: PayloadAction<ReduxApplicationDetailsType>) => {
      state.applicationStatus = action.payload.applicationStatus;
      state.applicationId = action.payload.applicationId;
      state.clinicId = action.payload.clinicId;
      state.dateCreated = action.payload.dateCreated;
      state.dateUpdated = action.payload.dateUpdated;
      state.expiryDate = action.payload.expiryDate;
      state.cancellationReason = action.payload.cancellationReason ?? "";
      state.cancellationFurtherInfo = action.payload.cancellationFurtherInfo ?? "";
    },
    clearApplicationDetails: (state) => {
      state.applicationStatus = ApplicationStatus.NULL;
      state.applicationId = "";
      state.clinicId = "";
      state.dateCreated = {
        year: "",
        month: "",
        day: "",
      };
      state.dateUpdated = {
        year: "",
        month: "",
        day: "",
      };
      state.expiryDate = {
        year: "",
        month: "",
        day: "",
      };
      state.cancellationReason = "";
      state.cancellationFurtherInfo = "";
    },
  },
});

export const {
  setApplicationStatus,
  setApplicationId,
  setClinicId,
  setDateCreated,
  setDateUpdated,
  setExpiryDate,
  setCancellationReason,
  setCancellationFurtherInfo,
  setApplicationDetails,
  clearApplicationDetails,
} = applicationSlice.actions;

export const applicationReducer = applicationSlice.reducer;
