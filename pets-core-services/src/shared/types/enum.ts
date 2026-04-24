export enum TaskStatus {
  completed = "completed",
  incompleted = "incompleted",
}

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

export enum ApplicationStatusGroup {
  incomplete = "Incomplete",
  complete = "Complete",
}
