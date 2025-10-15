import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReceivedMedicalScreeningType, ReduxMedicalScreeningType } from "@/types";
import { ApplicationStatus, BackendApplicationStatus, YesOrNo } from "@/utils/enums";

const initialState: ReduxMedicalScreeningType = {
  status: ApplicationStatus.NOT_YET_STARTED,
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
  chestXrayTaken: YesOrNo.NULL,
  reasonXrayNotRequired: "",
  reasonXrayNotRequiredFurtherDetails: "",
  completionDate: {
    year: "",
    month: "",
    day: "",
  },
};

export const medicalScreeningSlice = createSlice({
  name: "medicalScreeningDetails",
  initialState,
  reducers: {
    setMedicalScreeningStatus: (state, action: PayloadAction<ApplicationStatus>) => {
      state.status = action.payload;
    },
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
    setChestXrayTaken: (state, action: PayloadAction<YesOrNo>) => {
      state.chestXrayTaken = action.payload;
    },
    setReasonXrayNotRequired: (state, action: PayloadAction<string>) => {
      state.reasonXrayNotRequired = action.payload;
    },
    setReasonXrayNotRequiredFurtherDetails: (state, action: PayloadAction<string>) => {
      state.reasonXrayNotRequiredFurtherDetails = action.payload;
    },
    setMedicalScreeningDetails: (state, action: PayloadAction<ReduxMedicalScreeningType>) => {
      state.age = action.payload.age;
      state.completionDate = action.payload.completionDate;
      state.tbSymptoms = action.payload.tbSymptoms;
      state.tbSymptomsList = action.payload.tbSymptomsList
        ? [...action.payload.tbSymptomsList]
        : [];
      state.otherSymptomsDetail = action.payload.otherSymptomsDetail;
      state.underElevenConditions = action.payload.underElevenConditions
        ? [...action.payload.underElevenConditions]
        : [];
      state.underElevenConditionsDetail = action.payload.underElevenConditionsDetail;
      state.previousTb = action.payload.previousTb;
      state.previousTbDetail = action.payload.previousTbDetail;
      state.closeContactWithTb = action.payload.closeContactWithTb;
      state.closeContactWithTbDetail = action.payload.closeContactWithTbDetail;
      state.pregnant = action.payload.pregnant;
      state.menstrualPeriods = action.payload.menstrualPeriods;
      state.physicalExamNotes = action.payload.physicalExamNotes;
      state.chestXrayTaken = action.payload.chestXrayTaken || YesOrNo.NULL;
      state.reasonXrayNotRequired = action.payload.reasonXrayNotRequired || "";
      state.reasonXrayNotRequiredFurtherDetails =
        action.payload.reasonXrayNotRequiredFurtherDetails || "";
    },
    clearMedicalScreeningDetails: (state) => {
      state.status = ApplicationStatus.NOT_YET_STARTED;
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
      state.chestXrayTaken = YesOrNo.NULL;
      state.reasonXrayNotRequired = "";
      state.reasonXrayNotRequiredFurtherDetails = "";
      state.completionDate = {
        year: "",
        month: "",
        day: "",
      };
    },
    setMedicalScreeningDetailsFromApiResponse: (
      state,
      action: PayloadAction<ReceivedMedicalScreeningType>,
    ) => {
      state.status =
        action.payload.status == BackendApplicationStatus.COMPLETE
          ? ApplicationStatus.COMPLETE
          : ApplicationStatus.IN_PROGRESS;
      state.age = action.payload.age.toString();
      state.tbSymptoms = action.payload.symptomsOfTb;
      state.tbSymptomsList = action.payload.symptoms ? [...action.payload.symptoms] : [];
      state.otherSymptomsDetail = action.payload.symptomsOther;
      state.underElevenConditions = action.payload.historyOfConditionsUnder11
        ? [...action.payload.historyOfConditionsUnder11]
        : [];
      state.underElevenConditionsDetail = action.payload.historyOfConditionsUnder11Details;
      state.previousTb = action.payload.historyOfPreviousTb;
      state.previousTbDetail = action.payload.previousTbDetails;
      state.closeContactWithTb = action.payload.contactWithPersonWithTb;
      state.closeContactWithTbDetail = action.payload.contactWithTbDetails;
      state.pregnant = action.payload.pregnant;
      state.menstrualPeriods = action.payload.haveMenstralPeriod;
      state.physicalExamNotes = action.payload.physicalExaminationNotes;
      state.chestXrayTaken = action.payload.isXrayRequired ?? YesOrNo.NULL;
      state.reasonXrayNotRequired = action.payload.reasonXrayNotRequired ?? "";
      state.reasonXrayNotRequiredFurtherDetails =
        action.payload.reasonXrayNotRequiredFurtherDetails ?? "";
      state.completionDate = action.payload.dateCreated
        ? {
            year: action.payload.dateCreated.split("-")[0],
            month: action.payload.dateCreated.split("-")[1],
            day: action.payload.dateCreated.includes("T")
              ? action.payload.dateCreated.split("-")[2].split("T")[0]
              : action.payload.dateCreated.split("-")[2],
          }
        : {
            year: "",
            month: "",
            day: "",
          };
    },
  },
});

export const {
  setMedicalScreeningStatus,
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
  setChestXrayTaken,
  setReasonXrayNotRequired,
  setReasonXrayNotRequiredFurtherDetails,
  clearMedicalScreeningDetails,
  setMedicalScreeningDetails,
  setMedicalScreeningDetailsFromApiResponse,
} = medicalScreeningSlice.actions;

export const medicalScreeningReducer = medicalScreeningSlice.reducer;
