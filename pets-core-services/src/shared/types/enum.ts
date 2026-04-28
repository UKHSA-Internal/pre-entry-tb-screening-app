export enum TaskStatus {
  completed = "completed",
  incompleted = "incompleted",
}

// If this is modified, then also the enum (StatusGroup class) in this file should be modified:
// scripts/applicant_migration/src/migration_script.py
// Also check if the Enum names in file: scripts/validate_enum_consistency.py are correct.
export enum ApplicationStatus {
  inProgress = "In Progress",
  sputumDecisionInProgress = "Sputum Decision In Progress",
  sputumInProgress = "Sputum In Progress",
  sputumResultsInProgress = "Sputum Results In Progress",
  travelInfoInProgress = "Travel Information In Progress",
  medicalScreeningInProgress = "Medical Screening In Progress",
  chestXrayInProgress = "Chest Xray In Progress",
  radiologicalOutcomeInProgress = "Radiological Outcome In Progress",
  certificateInProgress = "Certificate In Progress",
  certificateNotIssued = "Certificate Not Issued",
  certificateAvailable = "Certificate Available",
  cancelled = "Cancelled",
}

// If this is modified, then also the enum (StatusGroup class) in this file should be modified:
// scripts/applicant_migration/src/migration_script.py
// Also check if the Enum names in file: scripts/validate_enum_consistency.py are correct.
export enum ApplicationStatusGroup {
  incomplete = "Incomplete",
  complete = "Complete",
}
