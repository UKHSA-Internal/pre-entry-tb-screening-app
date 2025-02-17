import { ApplicationStatus } from "./utils/enums";

type ApplicantDetailsType = {
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
  applicantHomeAddress4?: string;
  townOrCity: string;
  provinceOrState: string;
  country: string;
  postcode?: string;
};

type DateType = {
  year: string;
  month: string;
  day: string;
};

type MedicalScreeningType = {
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

type TravelDetailsType = {
  status: ApplicationStatus;
  visaType: string;
  applicantUkAddress1: string;
  applicantUkAddress2?: string;
  applicantUkAddress3?: string;
  applicantUkAddress4?: string;
  townOrCity: string;
  postcode: string;
  ukMobileNumber?: string;
  ukEmail: string;
};

type ChestXrayDetailsType = {
  cxrTaken: boolean;
  posteriorAnterior: string | null;
  apicalLordotic: string | null;
  lateralDecubitus: string | null;
  reasonWhyCxrWasNotDone2: string | null;
  reasonWhyCxrWasNotDone3: string | null;
  dateOfCxr: string | null;
  radiologicalOutcome: string;
  radiologicalOutcomeNotes: string | null;
  radiologicalFinding: string | null;
  dateOfRadiologicalInterpretation: string | null;
  sputumCollected: boolean;
  reasonWhySputumNotRequired: string | null;
};

type SputumCollectionDetailsType = {
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

type CertificationDetailsType = {
  tbSuspected: boolean | null;
  tbSuspectedBasedOn: string | null;
  clearanceCertificateIssued: string | null;
  reasonForNonIssue: string | null;
  reasonForNonIssue2: string | null;
  physiciansComments: string | null;
  issueDateofMedicalCertificate: string | null;
  clearanceCertificateNumber: string | null;
  ApplicationStatus: string;
};
