 interface IPetApplication {
    // identifiers
    "applicantPassportNumber": string,
    "applicantCountryofIssue": string,
    "clinicId": string,

    // travel-information
    "visaCategory": string,
    "ukAddressLine1": string,
    "ukAddressLine2": string,
    "ukAddressLine3": StringOrNull,
    "ukAddressLine4": StringOrNull,
    "ukAddressPostcode": string,
    "ukTelephoneNumber": string,
    "ukMobileNumber": StringOrNull,
    "ukEmailAddress": string,

    // medical-screening
    "age": NumberOrNull,
    "symptomsOfTb": BooleanOrNull,
    "symptoms": Symptoms,
    "symptomsOther": StringOrNull,
    "historyOfConditions": Conditions,
    "contactWithPersonWithTb": YesNoNone,
    "historyOfPreviousTb": YesNoNone,
    "previousTbDetails": StringOrNull,
    "pregnant": BooleanOrNull,
    "lastMenstralPeriod": StringOrNull,
    "physicalExaminationConducted": BooleanOrNull,
    "dateOfMedicalScreening": StringOrNull,

    // chest_x-ray
    "cxrTaken": BooleanOrNull,
    "posteriorAnterior": StringOrNull,
    "apicalLordotic": StringOrNull,
    "lateralDecubitus": StringOrNull,
    "reasonWhyCxrWasNotDone2": CxrNotTakenReason,
    "reasonWhyCxrWasNotDone3": StringOrNull,
    "dateOfCxr": StringOrNull,

    // radiological-interpretation
    "radiologicalFinding": StringOrNull,
    "radiologicalOutcome": StringOrNull,
    "radiologicalOutcomeNotes": StringOrNull,
    "dateOfRadiologicalInterpretation": StringOrNull,

    // sputum
    "sputumCollection": StringOrNull,
    "dateOfSputumSample1": StringOrNull,
    "smearResult1": StringOrNull,
    "cultureResult1": StringOrNull,
    "dateOfSputumSample2": StringOrNull,
    "smearResult2": StringOrNull,
    "cultureResult2": StringOrNull,
    "dateOfSputumSample3": StringOrNull,
    "smearResult3": StringOrNull,
    "cultureResult3": StringOrNull,

    // medical-assessment
    "tbSuspected": StringOrNull,
    "tbSuspectedBasedOn": StringOrNull,
    "clearanceCertificateIssued": StringOrNull,
    "reasonForNonIssue": StringOrNull,
    "reasonForNonIssue2": StringOrNull,
    "physiciansComments": StringOrNull,
    "issueDateofMedicalCertificate": StringOrNull,
    "clearanceCertificateNumber": StringOrNull,

    "ApplicationStatus": ApplicationStatus,

    // metadata
    "applicationCreatedBy": string,
    "applicationCreationTimestamp": string,
    "applicationModifiedBy": string,
    "applicationModificationTimestamp": string,
}
