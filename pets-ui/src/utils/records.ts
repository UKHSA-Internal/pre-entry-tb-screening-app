import { countryList } from "./countryList";

const attributeToComponentId: { [key: string]: string } = {
  fullName: "name",
  passportNumber: "passport-number",
  countryOfNationality: "country-of-nationality",
  countryOfIssue: "country-of-issue",
  dateOfBirth: "birth-date",
  sex: "sex",
  passportIssueDate: "passport-issue-date",
  passportExpiryDate: "passport-expiry-date",
  applicantHomeAddress1: "address-1",
  applicantHomeAddress2: "address-2",
  applicantHomeAddress3: "address-3",
  townOrCity: "town-or-city",
  provinceOrState: "province-or-state",
  country: "address-country",
  postcode: "postcode",
  applicantPhotoFileName: "applicant-photo",
  visaCategory: "visa-category",
  applicantUkAddress1: "address-1",
  applicantUkAddress2: "address-2",
  ukMobileNumber: "mobile-number",
  ukEmail: "email",
  completionDate: "medical-screening-completion-date",
  age: "age",
  tbSymptoms: "tb-symptoms",
  tbSymptomsList: "tb-symptoms-list",
  otherSymptomsDetail: "other-symptoms-detail",
  underElevenConditions: "under-eleven-conditions",
  underElevenConditionsDetail: "under-eleven-conditions-detail",
  previousTb: "previous-tb",
  previousTbDetail: "previous-tb-detail",
  closeContactWithTb: "close-contact-with-tb",
  closeContactWithTbDetail: "close-contact-with-tb-detail",
  pregnant: "pregnant",
  menstrualPeriods: "menstrual-periods",
  physicalExamNotes: "physical-exam-notes",
  isSputumRequired: "sputum-required",
  chestXrayTaken: "chest-xray-taken",
  posteroAnteriorXrayFileName: "postero-anterior-xray",
  apicalLordoticXrayFileName: "apical-lordotic-xray",
  lateralDecubitusXrayFileName: "lateral-decubitus-xray",
  xrayResult: "xray-result",
  xrayResultDetail: "xray-result-detail",
  xrayMinorFindings: "xray-minor-findings",
  reasonXrayWasNotTaken: "reason-xray-not-taken",
  reasonXrayNotRequired: "reason-xray-not-taken",
  reasonXrayNotRequiredFurtherDetails: "conditional-reason-xray-not-required-other-detail",
  xrayWasNotTakenFurtherDetails: "xray-not-taken-further-details",
  isIssued: "tb-clearance-issued",
  comments: "physician-comments",
  certificateDate: "tb-certificate-date",
  certificateNumber: "tb-certificate-number",
  sample1SmearResult: "sample1-smear-result",
  sample1CultureResult: "sample1-culture-result",
  sample2SmearResult: "sample2-smear-result",
  sample2CultureResult: "sample2-culture-result",
  sample3SmearResult: "sample3-smear-result",
  sample3CultureResult: "sample3-culture-result",
  dateOfSputumSample1: "date-sample-1-taken",
  dateOfSputumSample2: "date-sample-2-taken",
  dateOfSputumSample3: "date-sample-3-taken",
  collectionMethodSample1: "collection-method-sample-1",
  collectionMethodSample2: "collection-method-sample-2",
  collectionMethodSample3: "collection-method-sample-3",
  dateXrayTaken: "date-xray-taken",
};

const formRegex = {
  lettersAndNumbers: /^[A-Za-z0-9]+$/,
  lettersAndSpaces: /^[A-Za-z\s]+$/,
  lettersNumbersAndSpaces: /^[A-Za-z0-9\s]+$/,
  lettersSpacesAndPunctuation: /^[A-Za-z\s,-/()']+$/,
  lettersNumbersSpacesAndPunctuation: /^[A-Za-z0-9\s,-/()']+$/,
  numbersOnly: /^\d+$/,
  emailAddress: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/,
  fullName: /^[A-Za-z\s-'.]+$/,
};

const dateValidationMessages: Record<string, Record<string, string>> = {
  completionDate: {
    emptyFieldError: "The date the medical screening took place must include a day, month and year",
    invalidCharError:
      "The date the medical screening took place day, month and year must contain only numbers",
    invalidDateError: "The date the medical screening took place must be a real date",
    dateMustBeInPastError: "The date the medical screening took place must be today or in the past",
  },
  passportIssueDate: {
    emptyFieldError: "Passport issue date must include a day, month and year",
    invalidCharError: "Passport issue day, month and year must contain only numbers",
    invalidDateError: "Passport issue date must be a real date",
    dateMustBeInPastError: "Passport issue date must be today or in the past",
  },
  passportExpiryDate: {
    emptyFieldError: "Passport expiry date must include a day, month and year",
    invalidCharError: "Passport expiry day, month and year must contain only numbers",
    invalidDateError: "Passport expiry date must be a real date",
    dateMustBeInFutureError: "Passport expiry date must be in the future",
  },
  dateOfBirth: {
    emptyFieldError: "Date of birth must include a day, month and year",
    invalidCharError: "Date of birth day, month and year must contain only numbers",
    invalidDateError: "Date of birth must be a real date",
    dateMustBeInPastError: "Date of birth date must be in the past",
  },
  certificateDate: {
    emptyFieldError: "TB clearance certificate date must include a day, month and year",
    invalidCharError: "TB clearance certificate day, month and year must contain only numbers",
    invalidDateError: "TB clearance certificate date must be a real date",
    dateMustBeInPastError: "TB clearance certificate date must be today or in the past",
  },
  sputumSampleDate: {
    emptyFieldError: "Sputum sample {sampleNumber} date must include a day, month and year",
    invalidCharError: "Sputum sample {sampleNumber} day, month and year must contain only numbers",
    invalidDateError: "Sputum sample {sampleNumber} date must be a real date",
    dateMustBeInPastError: "Sputum sample {sampleNumber} date must be today or in the past",
  },
  dateXrayTaken: {
    emptyFieldError: "Enter the date the X-ray was taken",
    invalidCharError: "The date the X-ray was taken day, month and year must contain only numbers",
    invalidDateError: "The date the X-ray was taken must be a real date",
    dateMustBeInPastError: "The date the X-ray was taken must be today or in the past",
  },
};

const sputumResultsValidationMessages = {
  smearTestRequired: "Select result of smear test",
  cultureTestRequired: "Select result of culture test",
};

const longNumericStrings = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
const shortNumericStrings = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const dateEntryNames: Record<string, string> = {
  completionDate: "The date the medical screening took place",
  dateOfBirth: "Date of birth",
  passportIssueDate: "Passport issue date",
  passportExpiryDate: "Passport expiry date",
  tbCertificateDate: "TB clearance certificate date",
  dateXrayTaken: "The date the X-ray was taken",
};

const dateEntryMustBeInThePast: string[] = [
  "completionDate",
  "dateOfBirth",
  "passportIssueDate",
  "tbCertificateDate",
  "sputumSampleDate",
  "dateXrayTaken",
];

const dateEntryMustBeInTheFuture: string[] = ["passportExpiryDate"];

const visaOptions = [
  {
    value: "Work",
    label: "Work",
  },
  {
    value: "Study",
    label: "Study",
  },
  {
    value: "Family reunion",
    label: "Family reunion",
  },
  {
    value: "Other",
    label: "Other",
  },
  {
    value: "Do not know",
    label: "Do not know",
  },
];

const legacyVisaOptions = [
  {
    value: "HM Armed Forces",
    label: "HM Armed Forces",
  },
  {
    value: "Visitor",
    label: "Visitor",
  },
  {
    value: "Student",
    label: "Student",
  },
  {
    value: "Short-term Student (English language)",
    label: "Short-term Student (English language)",
  },
  {
    value: "Child student",
    label: "Child student",
  },
  {
    value: "Parent of child student",
    label: "Parent of child student",
  },
  {
    value: "Skilled worker",
    label: "Skilled worker",
  },
  {
    value: "Global Business Mobility routes",
    label: "Global Business Mobility routes",
  },
  {
    value: "T2 Minister of religion",
    label: "T2 Minister of religion",
  },
  {
    value: "Representative of an Overseas Business",
    label: "Representative of an Overseas Business",
  },
  {
    value: "UK Ancestry",
    label: "UK Ancestry",
  },
  {
    value: "Global Talent",
    label: "Global Talent",
  },
  {
    value: "High Potential Individual (HPI)",
    label: "High Potential Individual (HPI)",
  },
  {
    value: "Scale-Up",
    label: "Scale-Up",
  },
  {
    value: "Start-Up",
    label: "Start-Up",
  },
  {
    value: "Innovator Founder",
    label: "Innovator Founder",
  },
  {
    value: "International Sportsperson",
    label: "International Sportsperson",
  },
  {
    value: "Domestic Workers in a Private Household",
    label: "Domestic Workers in a Private Household",
  },
  {
    value: "Temporary Work – Youth Mobility Scheme",
    label: "Temporary Work – Youth Mobility Scheme",
  },
  {
    value: "Temporary Work – Creative Worker",
    label: "Temporary Work – Creative Worker",
  },
  {
    value: "Temporary Work – Religious Worker",
    label: "Temporary Work – Religious Worker",
  },
  {
    value: "Temporary Work - Charity Worker",
    label: "Temporary Work - Charity Worker",
  },
  {
    value: "Temporary Work – International Agreement",
    label: "Temporary Work – International Agreement",
  },
  {
    value: "Temporary Work – Government Authorised Exchange",
    label: "Temporary Work – Government Authorised Exchange",
  },
  {
    value: "Hong Kong British National (Overseas)",
    label: "Hong Kong British National (Overseas)",
  },
  {
    value: "Adult Dependent Relative",
    label: "Adult Dependent Relative",
  },
  {
    value: "Victim of Domestic Abuse",
    label: "Victim of Domestic Abuse",
  },
  {
    value: "Bereaved Partner",
    label: "Bereaved Partner",
  },
  {
    value: "Gurkha and Hong Kong military unit veteran discharged before 1 July 1997",
    label: "Gurkha and Hong Kong military unit veteran discharged before 1 July 1997",
  },
  {
    value: "Returning Resident",
    label: "Returning Resident",
  },
];

export {
  attributeToComponentId,
  countryList,
  dateEntryMustBeInTheFuture,
  dateEntryMustBeInThePast,
  dateEntryNames,
  dateValidationMessages,
  formRegex,
  legacyVisaOptions,
  longNumericStrings,
  shortNumericStrings,
  sputumResultsValidationMessages,
  visaOptions,
};
