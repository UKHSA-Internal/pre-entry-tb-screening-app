import { CountryCode } from "../country";

export const seededApplications = [
  {
    applicationId: "generated-app-id-1",
    passportNumber: "Test01",
    countryOfIssue: CountryCode.IND,
    clinicId: "Apollo Clinic",
    createdBy: "clinic-one-user@email",
  },
  {
    applicationId: "generated-app-id-2",
    passportNumber: "ABC1234JANE",
    countryOfIssue: CountryCode.BRB,
    clinicId: "Apollo Clinic",
    createdBy: "appollo-clinic-user@email",
  },
  {
    applicationId: "generated-app-id-3",
    passportNumber: "ABC1234KAT",
    countryOfIssue: CountryCode.ARG,
    clinicId: "test-clinic-id-3",
    createdBy: "clinic-three-user@email",
  },
  {
    applicationId: "generated-app-id-4",
    passportNumber: "ABC1234KAT",
    countryOfIssue: CountryCode.ARG,
    clinicId: "Apollo Clinic",
    createdBy: "clinic-four-user@email",
  },
  {
    applicationId: "generated-app-id-5",
    passportNumber: "Test05",
    countryOfIssue: CountryCode.IND,
    clinicId: "Apollo Clinic",
    createdBy: "clinic-four-user@email",
  },
];
