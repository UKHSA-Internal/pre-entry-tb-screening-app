export interface IPetsApplicant {
    "fullName": string
    "passportNumber": string
    "countryOfNationality": string
    "countryOfIssue": string
    "issueDate": {
        "day": string,
        "month": string,
        "year": string
    },
    "expiryDate": {
        "day": string,
        "month": string,
        "year": string
    },
    "dateOfBirth": {
        "day": string,
        "month": string,
        "year": string
    },
    "sex": string
    "typesOfVisa": string
    "applicantHomeAddress1": string
    "applicantHomeAddress2": string
    "applicantHomeAddress3": string
    "townOrCity": string
    "provinceOrState": string
    "country": string
    "postcode": string
}

