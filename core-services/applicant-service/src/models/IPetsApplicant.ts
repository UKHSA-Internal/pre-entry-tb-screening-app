export interface IPetsApplicant {
    "fullName": string
    "passportNumber": string
    "countryOfNationality": string
    "countryOfIssue": string
    "issueDate": {
        "day": number,
        "month": number,
        "year": number
    },
    "expiryDate": {
        "day": number,
        "month": number,
        "year": number
    },
    "dateOfBirth": {
        "day": number,
        "month": number,
        "year": number
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

