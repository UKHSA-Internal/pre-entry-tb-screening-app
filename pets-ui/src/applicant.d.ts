type ApplicantDetailsType = {
  fullName: string
  sex: string
  dateOfBirth: DateType
  countryOfNationality: string
  passportNumber: string
  countryOfIssue: string
  passportIssueDate: DateType
  passportExpiryDate: DateType 
  applicantHomeAddress1: string
  applicantHomeAddress2?: string
  applicantHomeAddress3?: string
  townOrCity: string
  provinceOrState: string
  country: string
  postcode?: string
}

type DateType = {
  year: string
  month: string
  day: string
}

type TravelDetailsType = {
  visaType: string
  applicantUkAddress1: string
  applicantUkAddress2?: string
  townOrCity: string
  postcode: string
  ukMobileNumber?: string
  ukEmail: string
}