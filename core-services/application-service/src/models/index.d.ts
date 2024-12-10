import { Handler } from "aws-lambda";

interface IDBConfig {
  params: { region: string; endpoint: string; convertEmptyValues: boolean };
  table: string;
}

interface IFunctionConfig {
  name: string;
  path: string;
  function: Handler;
  method: string;
}

type StringOrNull = string | null
type BooleanOrNull = boolean | null
type NumberOrNull = number | null

type Symptoms = "Cough" |
    "Haemoptysis" |
    "Weight loss" |
    "Night sweats" |
    "Fever" |
    "Other symptoms" |
    null

type ApplicationStatus = "CREATED" | "CLOSED" | "COMPLETED_WT_PASS" | "COMPLETED_WT_FAIL"

type YesNoNone = "Yes" | "No" | "Don't know"

type Conditions = "Chronic respiratry disease" |
  "Thoracic surgery" |
  "Cyanosis" |
  "Respiratory insufficiency that limits activity" |
  null

type CxrNotTakenReason = "Child" |
  "Pregnant, sputum smears instead" |
  "Unable/unwilling to do CXR, smear and culture instead" |
  "CXR Deferred" |
  "Declined" |
  "No Show" |
  "Other(specify)" |
  "N/A" |
  null
