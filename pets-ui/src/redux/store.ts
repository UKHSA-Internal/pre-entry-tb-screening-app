import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { applicantReducer } from './applicantSlice'
import { medicalScreeningReducer } from './medicalScreeningSlice'

const rootReducer = combineReducers({
  applicant: applicantReducer,
  medicalScreening: medicalScreeningReducer,
})

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // devTools: process.env.NODE_ENV !== 'production',
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
