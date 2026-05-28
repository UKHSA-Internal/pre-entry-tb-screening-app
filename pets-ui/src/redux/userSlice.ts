import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReduxUserDetailsType } from "@/types";

const initialState: ReduxUserDetailsType = {
  jobTitle: "",
  clinicId: "",
  name: "",
  isSuperUser: false,
};

export const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<ReduxUserDetailsType>) => {
      state.jobTitle = action.payload.jobTitle;
      state.clinicId = action.payload.clinicId;
      state.name = action.payload.name;
      state.isSuperUser = action.payload.isSuperUser;
    },
    clearUserDetails: (state) => {
      state.jobTitle = "";
      state.clinicId = "";
      state.name = "";
      state.isSuperUser = false;
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;

export const userReducer = userSlice.reducer;
