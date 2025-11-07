import {
  ApplicationStatus,
  BackendApplicationStatus,
  ImageType,
  PositiveOrNegative,
  YesOrNo,
} from "./utils/enums";

// Misc types
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
  var gtag: ((...args: unknown[]) => void) | undefined;
}

type ApplicantSearchFormType = {
  passportNumber: string;
  countryOfIssue: string;
};

type DateType = {
  year: string;
  month: string;
  day: string;
};

type ReceivedApplicationAttributesType = {
  applicationId: string;
  dateCreated: string;
  status: BackendApplicationStatus;
};

// Application types
type ApplicationIdAndDateCreatedType = {
  applicationId: string;
  dateCreated: string;
};

type ReceivedApplicationDetailsType = {
  applicationId: string;
  applicantPhotoUrl?: string;
  travelInformation: ReceivedTravelDetailsType | undefined;
  medicalScreening: ReceivedMedicalScreeningType | undefined;
  chestXray: ReceivedChestXrayDetailsType | undefined;
  radiologicalOutcome: ReceivedRadiologicalOutcomeDetailsType | undefined;
  sputumRequirement: ReceivedSputumRequirementType | undefined;
  sputumDetails: ReceivedSputumType | undefined;
  tbCertificate: ReceivedTbCertificateType | undefined;
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
  applicantPhotoFileName?: string;
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
  applicantPhotoFileName?: string;
};

type ReceivedApplicantDetailsType = PostedApplicantDetailsType & ReceivedApplicationAttributesType;

// Travel types
type ReduxTravelDetailsType = {
  status: ApplicationStatus;
  visaCategory: string;
  applicantUkAddress1?: string;
  applicantUkAddress2?: string;
  applicantUkAddress3?: string;
  townOrCity?: string;
  postcode?: string;
  ukMobileNumber?: string;
  ukEmail?: string;
};

type PostedTravelDetailsType = {
  ukAddressLine1?: string;
  ukAddressLine2?: string;
  ukAddressLine3?: string;
  ukAddressTownOrCity?: string;
  ukAddressPostcode?: string;
  ukEmailAddress?: string;
  ukMobileNumber?: string;
  visaCategory: string;
};

type ReceivedTravelDetailsType = PostedTravelDetailsType & ReceivedApplicationAttributesType;

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
  chestXrayTaken: YesOrNo;
  reasonXrayNotRequired: string;
  reasonXrayNotRequiredFurtherDetails?: string;
  completionDate: DateType;
};

type PostedMedicalScreeningType = {
  dateOfMedicalScreening: string;
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
  isXrayRequired: YesOrNo;
  reasonXrayNotRequired?: string;
  reasonXrayNotRequiredFurtherDetails?: string;
};

type ReceivedMedicalScreeningType = PostedMedicalScreeningType &
  ReceivedApplicationAttributesType & {
    isXrayRequired?: YesOrNo;
    reasonXrayNotRequired?: string;
    reasonXrayNotRequiredFurtherDetails?: string;
  };

// Chest X-ray types
type ReduxChestXrayDetailsType = {
  status: ApplicationStatus;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXrayFile: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXrayFile?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXrayFile?: string;
  dateXrayTaken: DateType;
};

type PostedChestXrayDetailsType = {
  chestXrayTaken: YesOrNo.YES;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXray?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXray?: string;
  dateXrayTaken: string;
};

type ReceivedChestXrayDetailsType = PostedChestXrayDetailsType & ReceivedApplicationAttributesType;

// Radiological outcome types
type ReduxRadiologicalOutcomeDetailsType = {
  status: ApplicationStatus;
  reasonXrayWasNotTaken: string;
  xrayWasNotTakenFurtherDetails: string;
  xrayResult: string;
  xrayResultDetail: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
  completionDate: DateType;
};

type PostedRadiologicalOutcomeDetailsType = {
  xrayResult: string;
  xrayResultDetail: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
};

type ReceivedRadiologicalOutcomeDetailsType = PostedRadiologicalOutcomeDetailsType &
  ReceivedApplicationAttributesType;

type PostedRadiologicalOutcomeChestXrayNotTakenType = {
  chestXrayTaken: YesOrNo;
  reasonXrayWasNotTaken: string;
  xrayWasNotTakenFurtherDetails: string;
};

type ReceivedRadiologicalOutcomeNotTakenType = PostedRadiologicalOutcomeChestXrayNotTakenType &
  ReceivedApplicationAttributesType;

type PostedChestXrayNotTakenDetailsType = {
  chestXrayTaken: YesOrNo.NO;
  reasonXrayWasNotTaken: string;
  xrayWasNotTakenFurtherDetails: string;
};

type PostedChestXrayUnionType = PostedChestXrayDetailsType | PostedChestXrayNotTakenDetailsType;

type ReduxSputumRequirementType = {
  status: ApplicationStatus;
  isSputumRequired: YesOrNo;
  completionDate?: DateType;
};

type PostedSputumRequirementType = {
  sputumRequired: YesOrNo;
};

type ReceivedSputumRequirementType = PostedSputumRequirementType &
  ReceivedApplicationAttributesType;

// Sputum types
type ReduxSputumCollectionType = {
  submittedToDatabase: boolean;
  dateOfSample: DateType;
  collectionMethod: string;
};

type ReduxSputumSmearResultType = {
  submittedToDatabase: boolean;
  smearResult: PositiveOrNegative;
};

type ReduxSputumCultureResultType = {
  submittedToDatabase: boolean;
  cultureResult: PositiveOrNegative;
};

type ReduxSputumSampleType = {
  collection: ReduxSputumCollectionType;
  smearResults: ReduxSputumSmearResultType;
  cultureResults: ReduxSputumCultureResultType;
  lastUpdatedDate: DateType;
};

type ReduxSputumType = {
  status: ApplicationStatus;
  version?: number;
  sample1: ReduxSputumSampleType;
  sample2: ReduxSputumSampleType;
  sample3: ReduxSputumSampleType;
};

type ReduxSputumSampleKeys = Exclude<keyof ReduxSputumType, "status" | "version">;

type PostedSputumSampleType = {
  dateOfSample: string;
  collectionMethod: string;
  smearResult?: PositiveOrNegative;
  cultureResult?: PositiveOrNegative;
  dateUpdated: string;
};

type PostedSputumType = {
  sample1?: PostedSputumSampleType;
  sample2?: PostedSputumSampleType;
  sample3?: PostedSputumSampleType;
};

type ReceivedSputumType = ReceivedApplicationAttributesType & {
  sputumSamples: PostedSputumType;
  version?: number;
};

// TB Declaration certificate types
type ReduxTbCertificateType = {
  status: ApplicationStatus;
  isIssued: YesOrNo;
  comments: string;
  certificateDate: DateType;
  certificateNumber: string;
  reasonNotIssued?: string;
  declaringPhysicianName: string;
  clinic: ClinicType;
};

type PostedTbCertificateType = {
  isIssued: YesOrNo;
  comments?: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  clinicName: string;
  physicianName: string;
  referenceNumber: string;
};

type ReceivedTbCertificateType = {
  applicationId: string;
  status: BackendApplicationStatus;
  isIssued: YesOrNo;
  comments?: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  clinicName: string;
  physicianName: string;
  referenceNumber: string;
  notIssuedReason?: string;
  dateCreated: Date;
};

type PostedTbCertificateNotIssuedType = {
  isIssued: YesOrNo;
  comments?: string;
  notIssuedReason: string;
  clinicName: string;
  physicianName: string;
  referenceNumber: string;
};

type ReceivedTbCertificateNotIssuedType = PostedTbCertificateNotIssuedType &
  ReceivedApplicationAttributesType;

// Image upload types
type GenerateImageUploadUrlRequest = {
  fileName: string;
  checksum?: string;
  imageType: ImageType;
};

type GenerateImageUploadUrlResponse = {
  uploadUrl: string;
  bucketPath: string;
};

// Clinic type
type ClinicType = {
  clinicId: string;
  name: string;
  country: string;
  city: string;
  startDate: string;
  endDate?: string | null;
  createdBy: string;
};
