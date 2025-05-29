import { ApplicationStatus, BackendApplicationStatus, ImageType, YesOrNo } from "./utils/enums";

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
  visaType: string;
  applicantUkAddress1?: string;
  applicantUkAddress2?: string;
  applicantUkAddress3?: string;
  townOrCity?: string;
  postcode?: string;
  ukMobileNumber?: string;
  ukEmail: string;
};

type PostedTravelDetailsType = {
  ukAddressLine1?: string;
  ukAddressLine2?: string;
  ukAddressLine3?: string;
  ukAddressTownOrCity?: string;
  ukAddressPostcode?: string;
  ukEmailAddress: string;
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

type ReceivedMedicalScreeningType = PostedMedicalScreeningType & ReceivedApplicationAttributesType;

// Chest X-ray types
type ReduxChestXrayDetailsType = {
  status: ApplicationStatus;
  chestXrayTaken: YesOrNo;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXrayFile: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXrayFile?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXrayFile?: string;
  reasonXrayWasNotTaken: string;
  xrayWasNotTakenFurtherDetails: string;
  xrayResult: string;
  xrayResultDetail: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
};

type PostedChestXrayDetailsType = {
  chestXrayTaken: YesOrNo;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXray?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXray?: string;
  xrayResult: string;
  xrayResultDetail: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
};

type ReceivedChestXrayDetailsType = PostedChestXrayDetailsType & ReceivedApplicationAttributesType;

type PostedChestXrayNotTakenType = {
  reasonXrayWasNotTaken: string;
  xrayWasNotTakenFurtherDetails: string;
};

type ReceivedChestXrayNotTakenType = PostedChestXrayNotTakenType &
  ReceivedApplicationAttributesType;

// TB Declaration certificate types
type ReduxTbCertificateType = {
  status: ApplicationStatus;
  isIssued: YesOrNo;
  comments: string;
  certificateDate: DateType;
  certificateNumber: string;
};

type PostedTbCertificateType = {
  isIssued: YesOrNo;
  comments: string;
  issueDate: string;
  certificateNumber: string;
};

type ReceivedTbCertificateType = PostedTbCertificateType & ReceivedApplicationAttributesType;

type PostedTbCertificateNotIssuedType = {
  isIssued: YesOrNo;
  comments: string;
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
  fields: Record<string, string>;
};
