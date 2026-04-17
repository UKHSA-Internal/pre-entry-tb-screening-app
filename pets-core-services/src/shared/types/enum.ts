export enum TaskStatus {
  completed = "completed",
  incompleted = "incompleted",
}

// If this is modified, then also the enum (StatusGroup class) in this file should be modified:
// scripts/applicant_migration/src/migration_script.py
export enum ApplicationStatus {
  inProgress = "In Progress",
  sputumInProgress = "Sputum In Progress",
  certificateNotIssued = "Certificate Not Issued",
  certificateAvailable = "Certificate Available",
  cancelled = "Cancelled",
}

// If this is modified, then also the enum (StatusGroup class) in this file should be modified:
// scripts/applicant_migration/src/migration_script.py
export enum ApplicationStatusGroup {
  incomplete = "Incomplete",
  complete = "Complete",
}
