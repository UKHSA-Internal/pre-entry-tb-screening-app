export enum TaskStatus {
  completed = "completed",
  incompleted = "incompleted",
}

// If this is modified, then also the enum (StatusGroup class) in this file should be modified:
// scripts/applicant_migration/src/migration_script.py
// Also check if the Enum names in file: scripts/validate_enum_consistency.py are correct.
export enum ApplicationStatus {
  inProgress = "In Progress",
  sputumInProgress = "Sputum In Progress",
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
