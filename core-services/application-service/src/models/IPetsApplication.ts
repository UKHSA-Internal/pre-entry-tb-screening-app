// field types could be more precise for at least drop-down components
type Symptoms = "Cough" |
    "Haemoptysis" |
    "Weight loss" |
    "Night sweats" |
    "Fever" |
    "Other symptoms" |
    null

interface IPetApplication {
    // identifiers
    "applicantPassportNumber": string,
    "applicantCountryofIssue": string,
    "clinicId": string,

    // travel-information
    "visaCategory": string,
    "ukAddressLine1": string,
    "ukAddressLine2": string,
    "ukAddressLine3": string | undefined,
    "ukAddressLine4": string | undefined,
    "ukAddressPostcode": string,
    "ukTelephoneNumber": string,
    "ukMobileNumber": string | undefined,
    "ukEmailAddress": string,

    // medical-screening
    "age": number,
    "symptomsOfTb": boolean,
    "symptoms": Symptoms,
    "symptomsOther": string | undefined,
    "contactWithPersonWithTb": string,
    "historyOfPreviousTb": string,
    "previousTbDetails": string,
    "pregnant": boolean,
    "lastMenstralPeriod": string | undefined,
    "physicalExaminationConducted": boolean,
    "dateOfMedicalScreening": string | undefined,

    // chest_x-ray
    "cxrTaken": boolean,
    "posteriorAnterior": string,
    "apicalLordotic": string | undefined,
    "lateralDecubitus": string | undefined,
    "reasonWhyCxrWasNotDone2": string,
    "reasonWhyCxrWasNotDone3": string,
    "dateOfCxr": string | undefined,

    // radiological-interpretation
    "radiologicalFinding": string,
    "radiologicalOutcome": string,
    "radiologicalOutcomeNotes": string | undefined,
    "dateOfRadiologicalInterpretation": string,

    // sputum
    "sputumCollection": string,
    "dateOfSputumSample1": string,
    "smearResult1": string,
    "cultureResult1": string,
    "dateOfSputumSample2": string,
    "smearResult2": string,
    "cultureResult2": string,
    "dateOfSputumSample3": string,
    "smearResult3": string,
    "cultureResult3": string,

    // medical-assessment
    "tbSuspected": string,
    "tbSuspectedBasedOn": string,
    "clearanceCertificateIssued": string,
    "reasonForNonIssue": string,
    "reasonForNonIssue2": string,
    "physiciansComments": string,
    "issueDateofMedicalCertificate": string,
    "clearanceCertificateNumber": string,

    "ApplicationStatus": string,

    // metadata
    "applicationCreatedBy": string,
    "applicationCreationTimestamp": string,
    "applicationModifiedBy": string,
    "applicationModificationTimestamp": string,
}
