import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ApplicationDetailsType } from "@/applicant";

const initialState: ApplicationDetailsType = {
  applicationId: "",
  dateCreated: "",
};

export const applicationSlice = createSlice({
  name: "applicationDetails",
  initialState,
  reducers: {
    setApplicationId: (state, action: PayloadAction<string>) => {
      state.applicationId = action.payload;
    },
    setDateCreated: (state, action: PayloadAction<string>) => {
      state.dateCreated = action.payload;
    },
    setApplicationDetails: (state, action: PayloadAction<ApplicationDetailsType>) => {
      state.applicationId = action.payload.applicationId;
      state.dateCreated = action.payload.dateCreated;
    },
    clearApplicationDetails: (state) => {
      state.applicationId = "";
      state.dateCreated = "";
    },
  },
});

export const { setApplicationId, setDateCreated, setApplicationDetails, clearApplicationDetails } =
  applicationSlice.actions;

export const applicationReducer = applicationSlice.reducer;

export const selectApplication = (state: RootState) => state.application;
