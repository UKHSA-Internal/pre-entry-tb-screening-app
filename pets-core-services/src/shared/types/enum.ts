export enum TaskStatus {
  completed = "completed",
  incompleted = "incompleted",
}

export enum ApplicationStatus {
  inProgress = "In Progress",
  certificateNotIssued = "Certificate Not Issued",
  certificateAvailable = "Certificate Available",
  cancelled = "Cancelled",
}

// If this is modified, then also the enum (StatusGroup class) in this file should be modified:
// scripts/application_updates/src/update_application.py
export enum StatusGroup {
  complete = "Complete",
  notComplete = "Not Complete",
}
