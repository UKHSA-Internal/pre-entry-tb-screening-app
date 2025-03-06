import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { applicantReducer } from "./applicantSlice";
import { applicationReducer } from "./applicationSlice";
import { chestXrayReducer } from "./chestXraySlice";
import { medicalScreeningReducer } from "./medicalScreeningSlice";
import { travelReducer } from "./travelSlice";

const rootReducer = combineReducers({
  applicant: applicantReducer,
  application: applicationReducer,
  medicalScreening: medicalScreeningReducer,
  travel: travelReducer,
  chestXray: chestXrayReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // devTools: process.env.NODE_ENV !== 'production',
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
