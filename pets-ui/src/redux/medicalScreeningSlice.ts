import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';


const initialState: MedicalScreeningType = {
  age: "",
  tbSymptoms: "",
  tbSymptomsList: [],
  otherSymptomsDetail: "",
  underElevenConditions: [],
  underElevenConditionsDetail: "",
  previousTb: "",
  previousTbDetail: "",
  closeContactWithTb: "",
  closeContactWithTbDetail: "",
  pregnant: "",
  menstrualPeriods: "",
  physicalExamNotes: "",
};

export const medicalScreeningSlice = createSlice({
  name: 'medicalScreeningDetails',
  initialState,
  reducers: {
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setTbSymptoms: (state, action: PayloadAction<string>) => {
      state.tbSymptoms = action.payload;
    },
    setTbSymptomsList: (state, action: PayloadAction<string[]>) => {
      state.tbSymptomsList = [...action.payload];
    },
    setOtherSymptomsDetail: (state, action: PayloadAction<string>) => {
      state.otherSymptomsDetail = action.payload;
    },
    setUnderElevenConditions: (state, action: PayloadAction<string[]>) => {
      state.underElevenConditions = [...action.payload];
    },
    setUnderElevenConditionsDetail: (state, action: PayloadAction<string>) => {
      state.underElevenConditionsDetail = action.payload;
    },
    setPreviousTb: (state, action: PayloadAction<string>) => {
      state.previousTb = action.payload;
    },
    setPreviousTbDetail: (state, action: PayloadAction<string>) => {
      state.previousTbDetail = action.payload;
    },
    setCloseContactWithTb: (state, action: PayloadAction<string>) => {
      state.closeContactWithTb = action.payload;
    },
    setCloseContactWithTbDetail: (state, action: PayloadAction<string>) => {
      state.closeContactWithTbDetail = action.payload;
    },
    setPregnant: (state, action: PayloadAction<string>) => {
      state.pregnant = action.payload;
    },
    setMenstrualPeriods: (state, action: PayloadAction<string>) => {
      state.menstrualPeriods = action.payload;
    },
    setPhysicalExamNotes: (state, action: PayloadAction<string>) => {
      state.physicalExamNotes = action.payload;
    },
    clearMedicalScreeningDetails: (state) => {
      state.age = "";
      state.tbSymptoms = "";
      state.tbSymptomsList = [];
      state.otherSymptomsDetail = "";
      state.underElevenConditions = [];
      state.underElevenConditionsDetail = "";
      state.previousTb = "";
      state.previousTbDetail = "";
      state.closeContactWithTb = "";
      state.closeContactWithTbDetail = "";
      state.pregnant = "";
      state.menstrualPeriods = "";
      state.physicalExamNotes = "";
    },
  },
});


export const {
  setAge,
  setTbSymptoms,
  setTbSymptomsList,
  setOtherSymptomsDetail,
  setUnderElevenConditions,
  setUnderElevenConditionsDetail,
  setPreviousTb,
  setPreviousTbDetail,
  setCloseContactWithTb,
  setCloseContactWithTbDetail,
  setPregnant,
  setMenstrualPeriods,
  setPhysicalExamNotes,
  clearMedicalScreeningDetails,
} = medicalScreeningSlice.actions;

export const medicalScreeningReducer = medicalScreeningSlice.reducer;

export const selectMedicalScreening = (state: RootState) => state.medicalScreening
