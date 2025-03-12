import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { NewApplicant } from "../../shared/models/applicant";
import { AllowedSex } from "../types/enums";

export const seededApplicants: NewApplicant[] = [
  {
    applicationId: seededApplications[1].applicationId,
    fullName: "Jane Doe",
    passportNumber: "ABC1234JANE",
    countryOfNationality: CountryCode.BRB,
    countryOfIssue: CountryCode.BRB,
    issueDate: "2007-05-12",
    expiryDate: "2012-05-12",
    dateOfBirth: "2003-05-12",
    sex: AllowedSex.Male,
    applicantHomeAddress1: "23 Long street",
    applicantHomeAddress2: "River Valley",
    townOrCity: "Mumbai",
    provinceOrState: "Mumbai",
    country: CountryCode.BRB,
    postcode: "1234",
    createdBy: "shane.park@iom.com",
  },
  {
    applicationId: seededApplications[2].applicationId,
    fullName: "Dave Jones",
    passportNumber: "ABC1234DAVE",
    countryOfNationality: CountryCode.MAR,
    countryOfIssue: CountryCode.MAR,
    issueDate: "2008-05-12",
    expiryDate: "2014-05-12",
    dateOfBirth: "2006-05-12",
    sex: AllowedSex.Male,
    applicantHomeAddress1: "23 Long street",
    applicantHomeAddress2: "River Valley",
    townOrCity: "Buenos Aires",
    provinceOrState: "",
    country: CountryCode.ARG,
    postcode: "1234",
    createdBy: "shawn.jones@clinic.com",
  },
];
