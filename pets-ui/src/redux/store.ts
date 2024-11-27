import { configureStore } from '@reduxjs/toolkit'
import { applicantReducer } from './applicantSlice'

export const store = configureStore({
  reducer: {
    applicant: applicantReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
