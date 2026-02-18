import { CountryCode } from "../country";
import { IApplication } from "../models/application";
import { ApplicationStatus } from "../types/enum";

export const seededApplications: IApplication[] = [
  {
    applicationId: "generated-app-id-1",
    passportNumber: "Test01",
    countryOfIssue: CountryCode.IND,
    clinicId: "Apollo Clinic",
    createdBy: "clinic-one-user@email",
    dateCreated: new Date("16-01-2025"),
    applicationStatus: ApplicationStatus.inProgress,
  },
  {
    applicationId: "generated-app-id-2",
    passportNumber: "ABC1234JANE",
    countryOfIssue: CountryCode.BRB,
    clinicId: "Apollo Clinic",
    createdBy: "appollo-clinic-user@email",
    dateCreated: new Date("17-01-2025"),
    applicationStatus: ApplicationStatus.inProgress,
  },
  {
    applicationId: "generated-app-id-3",
    passportNumber: "ABC1234KAT",
    countryOfIssue: CountryCode.ARG,
    clinicId: "test-clinic-id-3",
    createdBy: "clinic-three-user@email",
    dateCreated: new Date("18-01-2025"),
    applicationStatus: ApplicationStatus.inProgress,
  },
  {
    applicationId: "generated-app-id-4",
    passportNumber: "ABC1234KAT",
    countryOfIssue: CountryCode.ARG,
    clinicId: "Apollo Clinic",
    createdBy: "clinic-four-user@email",
    dateCreated: new Date("19-01-2025"),
    applicationStatus: ApplicationStatus.inProgress,
  },
  {
    applicationId: "generated-app-id-5",
    passportNumber: "Test05",
    countryOfIssue: CountryCode.IND,
    clinicId: "Apollo Clinic",
    createdBy: "clinic-four-user@email",
    dateCreated: new Date("26-01-2025"),
    applicationStatus: ApplicationStatus.inProgress,
  },
];
