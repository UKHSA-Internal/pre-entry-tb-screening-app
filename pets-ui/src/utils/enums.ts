export enum ButtonClass {
  DEFAULT = "govuk-button",
  SECONDARY = "govuk-button govuk-button--secondary",
  WARNING = "govuk-button govuk-button--warning",
}

export enum ButtonType {
  SUBMIT = "submit",
  RESET = "reset",
  BUTTON = "button",
}

export enum RadioIsInline {
  TRUE = "govuk-radios govuk-radios--inline",
  FALSE = "govuk-radios",
}

export enum TaskStatus {
  NOT_YET_STARTED = "Not yet started",
  COMPLETE = "Complete",
  IN_PROGRESS = "In progress",
  NOT_REQUIRED = "Not required",
  CERTIFICATE_ISSUED = "Certificate issued",
  CERTIFICATE_NOT_ISSUED = "Certificate not issued",
}

export enum ApplicationStatus {
  NULL = "",
  IN_PROGRESS = "In Progress",
  CERTIFICATE_NOT_ISSUED = "Certificate Not Issued",
  CERTIFICATE_AVAILABLE = "Certificate Available",
  CANCELLED = "Cancelled",
  TRAVEL_IN_PROGRESS = "Travel Information In Progress",
  MEDICAL_SCREENING_IN_PROGRESS = "Medical Screening In Progress",
  CHEST_XRAY_IN_PROGRESS = "Chest Xray In Progress",
  RADIOLOGICAL_OUTCOME_IN_PROGRESS = "Radiological Outcome In Progress",
  SPUTUM_DECISION_IN_PROGRESS = "Sputum Decision In Progress",
  SPUTUM_IN_PROGRESS = "Sputum In Progress",
  CERTIFICATE_IN_PROGRESS = "Certificate In Progress",
}

export enum BackendTaskStatus {
  INCOMPLETE = "incompleted",
  COMPLETE = "completed",
}

export enum YesOrNo {
  YES = "Yes",
  NO = "No",
  NULL = "",
}

export enum PositiveOrNegative {
  POSITIVE = "Positive",
  NEGATIVE = "Negative",
  INCONCLUSIVE = "Inconclusive",
  NOT_YET_ENTERED = "Not yet entered",
}

export enum SputumCollectionMethod {
  COUGHED_UP = "Coughed up",
  INDUCED = "Induced",
  GASTRIC_LAVAGE = "Gastric lavage",
  NOT_KNOWN = "Not known",
}

export enum ImageType {
  Dicom = "Dicom",
  Photo = "Photo",
}

export enum TBCertNotIssuedReason {
  CONFIRMED_SUSPECTED_TB = "Confirmed or suspected TB",
  TESTING_POSTPONED = "Testing postponed",
  APPLICATION_WITHDRAWN = "Visa applicant has withdrawn their TB screening",
  IDENTITY_CANNOT_BE_VERIFIED = "The applicant's identity could not be conclusively established despite reasonable verification efforts, including review of passport, supporting identification documents, photographs, and other available records",
  SUSPETED_FRAUD_OR_TEMPERED_DOCUMENTS = "The applicant submitted false identity documents or provided materially misleading information during the screening process",
  APPLICANT_DECEASED_BEFORE_ISSUANCE = "The applicant passed away before completing the screening process",
  QUALITY_ASSURANC_REVIEW_INVALIDATED_SCREENING = "New verified information shows the certificate should not have been issued",
  SCREENING_WAS_NOT_COMPLETED_DUE_TO_EXCEPTIONAL_EXTERNAL_CIRCUMSTANCES = "Exceptional external circumstances, such as pandemic-related travel restrictions, airport closures, or government-imposed lockdowns, prevented the applicant from attending or completing the required screening appointments",
}

export enum AdditionalStatusTagTexts {
  CANNOT_START_YET = "Cannot start yet",
  SCREENING_CANCELLED = "Screening cancelled",
  CERTIFICATE_EXPIRED = "Certificate expired",
}
export type StatusTagText = TaskStatus | ApplicationStatus | AdditionalStatusTagTexts;
