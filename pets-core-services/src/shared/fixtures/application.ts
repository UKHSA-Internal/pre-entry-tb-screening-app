import { IApplication } from "../models/application";

export const seededApplications: Omit<IApplication, "dateCreated">[] = [
  {
    applicationId: "generated-app-id-1",
    clinicId: "Apollo Clinic",
    createdBy: "clinic-one-user@email",
  },
  {
    applicationId: "generated-app-id-2",
    clinicId: "Apollo Clinic",
    createdBy: "appollo-clinic-user@email",
  },
  {
    applicationId: "generated-app-id-3",
    clinicId: "test-clinic-id-3",
    createdBy: "clinic-three-user@email",
  },
];
