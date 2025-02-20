import { seededApplications } from "../../shared/fixtures/application";
import { IMedicalScreening } from "../models/medical-screening";
import {
  HistoryOfConditionsUnder11,
  MenstrualPeriods,
  PregnancyStatus,
  TbSymptomsOptions,
  YesOrNo,
} from "../types/enums";

export const seededMedicalScreening: Omit<IMedicalScreening, "dateCreated" | "status">[] = [
  {
    applicationId: seededApplications[1].applicationId,
    age: 25,
    symptomsOfTb: YesOrNo.Yes,
    symptoms: [TbSymptomsOptions.Cough, TbSymptomsOptions.Haemoptysis],
    historyOfConditionsUnder11: [],
    historyOfConditionsUnder11Details: "Physician Notes",
    historyOfPreviousTb: YesOrNo.Yes,
    previousTbDetails: "Previous TB notes",
    contactWithPersonWithTb: YesOrNo.Yes,
    contactWithTbDetails: "More Physician Notes",
    pregnant: PregnancyStatus.Yes,
    haveMenstralPeriod: MenstrualPeriods.Yes,
    physicalExaminationNotes: "NA",
    createdBy: "shane.park@iom.com",
  },
  {
    applicationId: seededApplications[2].applicationId,
    age: 10,
    symptomsOfTb: YesOrNo.Yes,
    symptoms: [TbSymptomsOptions.Cough],
    historyOfConditionsUnder11: [HistoryOfConditionsUnder11.Cyanosis],
    historyOfConditionsUnder11Details: "Physician Notes",
    historyOfPreviousTb: YesOrNo.No,
    contactWithPersonWithTb: YesOrNo.Yes,
    contactWithTbDetails: "More Physician Notes",
    pregnant: PregnancyStatus.No,
    haveMenstralPeriod: MenstrualPeriods.No,
    physicalExaminationNotes: "NA",
    createdBy: "shawn.jones@clinic.com",
  },
];
