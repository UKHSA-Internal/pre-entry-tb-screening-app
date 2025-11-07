import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { applicantReducer } from "./applicantSlice";
import { applicationReducer } from "./applicationSlice";
import { chestXrayReducer } from "./chestXraySlice";
import { medicalScreeningReducer } from "./medicalScreeningSlice";
import { radiologicalOutcomeReducer } from "./radiologicalOutcomeSlice";
import { sputumDecisionReducer } from "./sputumDecisionSlice";
import { sputumReducer } from "./sputumSlice";
import { tbCertificateReducer } from "./tbCertificateSlice";
import { travelReducer } from "./travelSlice";

const rootReducer = combineReducers({
  applicant: applicantReducer,
  application: applicationReducer,
  chestXray: chestXrayReducer,
  radiologicalOutcome: radiologicalOutcomeReducer,
  medicalScreening: medicalScreeningReducer,
  sputum: sputumReducer,
  sputumDecision: sputumDecisionReducer,
  tbCertificate: tbCertificateReducer,
  travel: travelReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: import.meta.env.DEV,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export const selectApplicant = (state: RootState) => state.applicant;
export const selectApplication = (state: RootState) => state.application;
export const selectChestXray = (state: RootState) => state.chestXray;
export const selectRadiologicalOutcome = (state: RootState) => state.radiologicalOutcome;
export const selectMedicalScreening = (state: RootState) => state.medicalScreening;
export const selectSputum = (state: RootState) => state.sputum;
export const selectSputumDecision = (state: RootState) => state.sputumDecision;
export const selectTbCertificate = (state: RootState) => state.tbCertificate;
export const selectClinic = (state: RootState) => state.tbCertificate.clinic;
export const selectTravel = (state: RootState) => state.travel;
