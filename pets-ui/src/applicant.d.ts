import { ApplicationStatus, BackendApplicationStatus } from "./utils/enums";

// Misc types
type ApplicantSearchFormType = {
  passportNumber: string;
  countryOfIssue: string;
};

type DateType = {
  year: string;
  month: string;
  day: string;
};

// Application types
type ApplicationIdAndDateCreatedType = {
  applicationId: string;
  dateCreated: string;
};

type ReceivedApplicationDetailsType = {
  applicationId: string;
  travelInformation: ReceivedTravelDetailsType | undefined;
  medicalScreening: ReceivedMedicalScreeningType | undefined;
};

// Applicant types
type ReduxApplicantDetailsType = {
  status: ApplicationStatus;
  fullName: string;
  sex: string;
  dateOfBirth: DateType;
  countryOfNationality: string;
  passportNumber: string;
  countryOfIssue: string;
  passportIssueDate: DateType;
  passportExpiryDate: DateType;
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  applicantHomeAddress3?: string;
  townOrCity: string;
  provinceOrState: string;
  country: string;
  postcode?: string;
};

type ReceivedApplicantDetailsType = {
  applicationId: string;
  dateCreated: string;
  status: BackendApplicationStatus;
  fullName: string;
  sex: string;
  dateOfBirth: string;
  countryOfNationality: string;
  passportNumber: string;
  countryOfIssue: string;
  issueDate: string;
  expiryDate: string;
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  applicantHomeAddress3?: string;
  townOrCity: string;
  provinceOrState: string;
  country: string;
  postcode?: string;
};

type PostedApplicantDetailsType = {
  fullName: string;
  sex: string;
  dateOfBirth: string;
  countryOfNationality: string;
  passportNumber: string;
  countryOfIssue: string;
  issueDate: string;
  expiryDate: string;
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  applicantHomeAddress3?: string;
  townOrCity: string;
  provinceOrState: string;
  country: string;
  postcode?: string;
};

// Travel types
type ReduxTravelDetailsType = {
  status: ApplicationStatus;
  visaType: string;
  applicantUkAddress1: string;
  applicantUkAddress2?: string;
  applicantUkAddress3?: string;
  townOrCity: string;
  postcode: string;
  ukMobileNumber?: string;
  ukEmail: string;
};

type ReceivedTravelDetailsType = {
  applicationId: string;
  dateCreated: string;
  status: BackendApplicationStatus;
  ukAddressLine1: string;
  ukAddressLine2?: string;
  ukAddressLine3?: string;
  ukAddressTownOrCity: string;
  ukAddressPostcode: string;
  ukEmailAddress: string;
  ukMobileNumber?: string;
  visaCategory: string;
};

type PostedTravelDetailsType = {
  ukAddressLine1: string;
  ukAddressLine2?: string;
  ukAddressLine3?: string;
  ukAddressTownOrCity: string;
  ukAddressPostcode: string;
  ukEmailAddress: string;
  ukMobileNumber?: string;
  visaCategory: string;
};

// Medical Screening types
type ReduxMedicalScreeningType = {
  status: ApplicationStatus;
  age: string;
  tbSymptoms: string;
  tbSymptomsList: string[];
  otherSymptomsDetail: string;
  underElevenConditions: string[];
  underElevenConditionsDetail: string;
  previousTb: string;
  previousTbDetail: string;
  closeContactWithTb: string;
  closeContactWithTbDetail: string;
  pregnant: string;
  menstrualPeriods: string;
  physicalExamNotes: string;
};

type ReceivedMedicalScreeningType = {
  applicationId: string;
  dateCreated: string;
  status: BackendApplicationStatus;
  age: number;
  contactWithPersonWithTb: string;
  contactWithTbDetails: string;
  haveMenstralPeriod: string;
  historyOfConditionsUnder11: string[];
  historyOfConditionsUnder11Details: string;
  historyOfPreviousTb: string;
  physicalExaminationNotes: string;
  pregnant: string;
  previousTbDetails: string;
  symptoms: string[];
  symptomsOfTb: string;
  symptomsOther: string;
};

type PostedMedicalScreeningType = {
  age: number;
  contactWithPersonWithTb: string;
  contactWithTbDetails: string;
  haveMenstralPeriod: string;
  historyOfConditionsUnder11: string[];
  historyOfConditionsUnder11Details: string;
  historyOfPreviousTb: string;
  physicalExaminationNotes: string;
  pregnant: string;
  previousTbDetails: string;
  symptoms: string[];
  symptomsOfTb: string;
  symptomsOther: string;
};

// Chest X-ray types
type ReduxChestXrayDetailsType = {
  chestXrayTaken: boolean | string;
  posteroAnteriorXray: boolean | string; // allows for yes -> true, no -> false
  posteroAnteriorXrayFile: string | null;
  apicalLordoticXray: boolean | string; // allows for yes -> true, no -> false
  apicalLordoticXrayFile: string | null;
  lateralDecubitusXray: boolean | string; // allows for yes -> true, no -> false
  lateralDecubitusXrayFile: string | null;
  reasonXrayWasNotTaken: string | null;
  xrayWasNotTakenFurtherDetails: string | null;
  reasonXrayNotTakenDetail: string | null;
  dateOfCxr: string | null;
  radiologicalOutcome: string;
  radiologicalOutcomeNotes: string | null;
  radiologicalFinding: string | null;
  dateOfRadiologicalInterpretation: string | null;
  sputumCollected: boolean;
  reasonWhySputumNotRequired: string | null;
  xrayResult: string;
  xrayResultDetail: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
};

// Sputum types
type ReduxSputumCollectionDetailsType = {
  dateOfSputumSample1: string | null;
  collectionMethodSample1: string | null;
  collectionMethodOtherSample1: string | null;
  smearResult1: string | null;
  cultureResult1: string | null;
  dateOfSputumSample2: string | null;
  collectionMethodSample2: string | null;
  collectionMethodOtherSample2: string | null;
  smearResult2: string | null;
  cultureResult2: string | null;
  dateOfSputumSample3: string | null;
  collectionMethodSample3: string | null;
  collectionMethodOtherSample3: string | null;
  smearResult3: string | null;
  cultureResult3: string | null;
  dstConducted: boolean;
  drugTested: string | null;
  drugResistance: "Yes" | "No" | "Not applicable";
  drugResistanceDetails: string | null;
};

// TB Declaration certificate type
type ReduxTbCertificateType = {
  status: ApplicationStatus;
  tbClearanceIssued: string;
  physicianComments: string;
  tbCertificateDate: DateType;
  tbCertificateNumber: string;
};
