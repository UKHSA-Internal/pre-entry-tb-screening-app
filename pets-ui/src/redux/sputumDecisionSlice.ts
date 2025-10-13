import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ApplicationStatus, YesOrNo } from "@/utils/enums";

interface SputumDecisionState {
  status: ApplicationStatus;
  isSputumRequired: YesOrNo;
  completionDate: {
    year: string;
    month: string;
    day: string;
  };
}

const initialState: SputumDecisionState = {
  status: ApplicationStatus.NOT_YET_STARTED,
  isSputumRequired: YesOrNo.NULL,
  completionDate: {
    year: "",
    month: "",
    day: "",
  },
};

export const sputumDecisionSlice = createSlice({
  name: "sputumDecision",
  initialState,
  reducers: {
    setSputumDecisionStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
    setSputumDecisionRequired: (state, action: PayloadAction<YesOrNo>) => {
      state.isSputumRequired = action.payload;
    },
    setSputumDecisionCompletionDate: (
      state,
      action: PayloadAction<{ year: string; month: string; day: string }>,
    ) => {
      state.completionDate = action.payload;
    },
    clearSputumDecision: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
      state.isSputumRequired = YesOrNo.NULL;
      state.completionDate = {
        year: "",
        month: "",
        day: "",
      };
    },
  },
});

export const {
  setSputumDecisionStatus,
  setSputumDecisionRequired,
  setSputumDecisionCompletionDate,
  clearSputumDecision,
} = sputumDecisionSlice.actions;

export const sputumDecisionReducer = sputumDecisionSlice.reducer;
