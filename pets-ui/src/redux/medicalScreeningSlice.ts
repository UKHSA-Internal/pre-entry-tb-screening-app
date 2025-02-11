import { RootState } from "@redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  name: "medicalScreeningDetails",
  initialState,
  reducers: {
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setTbSymptoms: (state, action: PayloadAction<string>) => {
      state.tbSymptoms = action.payload;
    },
    setTbSymptomsList: (state, action: PayloadAction<string[] | false>) => {
      state.tbSymptomsList = action.payload ? [...action.payload] : [];
    },
    setOtherSymptomsDetail: (state, action: PayloadAction<string>) => {
      state.otherSymptomsDetail = action.payload;
    },
    setUnderElevenConditions: (state, action: PayloadAction<string[] | false>) => {
      state.underElevenConditions = action.payload ? [...action.payload] : [];
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
    setMedicalScreeningDetails: (state, action: PayloadAction<MedicalScreeningType>) => {
      state.age = action.payload.age;
      state.tbSymptoms = action.payload.tbSymptoms;
      state.tbSymptomsList = action.payload.tbSymptomsList ?? [];
      state.otherSymptomsDetail = action.payload.otherSymptomsDetail;
      state.underElevenConditions = action.payload.underElevenConditions ?? [];
      state.underElevenConditionsDetail = action.payload.underElevenConditionsDetail;
      state.previousTb = action.payload.previousTb;
      state.previousTbDetail = action.payload.previousTbDetail;
      state.closeContactWithTb = action.payload.closeContactWithTb;
      state.closeContactWithTbDetail = action.payload.closeContactWithTbDetail;
      state.pregnant = action.payload.pregnant;
      state.menstrualPeriods = action.payload.menstrualPeriods;
      state.physicalExamNotes = action.payload.physicalExamNotes;
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
  setMedicalScreeningDetails,
} = medicalScreeningSlice.actions;

export const medicalScreeningReducer = medicalScreeningSlice.reducer;

export const selectMedicalScreening = (state: RootState) => state.medicalScreening;
