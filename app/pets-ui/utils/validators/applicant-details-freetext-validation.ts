import { IFormData } from "@utils/IFormData"

const fieldValidationDetails = {
    "fullName": {
        "regex": /[^A-Za-z\s]/,
        "regexError": "Full name must contain only letters and spaces.",
        "isMandatory": true,
        "mandatoryError": "Enter the applicant's full name."
    },
    "passportNumber": {
        "regex": /[^A-Za-z0-9]/,
        "regexError": "Passport number must contain only letters and numbers.",
        "isMandatory": true,
        "mandatoryError": "Enter the applicant's passport number."
    },
    "applicantHomeAddress1": {
        "regex": /[^A-Za-z0-9\s,-/()]/,
        "regexError": "Home address must contain only letters, numbers, spaces and punctuation.",
        "isMandatory": true,
        "mandatoryError": "Enter the first line of the applicant's home address."
    },
    "applicantHomeAddress2": {
        "regex": /[^A-Za-z0-9\s,-/()]/,
        "regexError": "Home address must contain only letters, numbers, spaces and punctuation.",
        "isMandatory": false,
        "mandatoryError": ""
    },
    "applicantHomeAddress3": {
        "regex": /[^A-Za-z0-9\s,-/()]/,
        "regexError": "Home address must contain only letters, numbers, spaces and punctuation.",
        "isMandatory": false,
        "mandatoryError": ""
    },
    "townOrCity": {
        "regex": /[^A-Za-z\s,-/()]/,
        "regexError": "Town name must contain only letters, spaces and punctuation.",
        "isMandatory": true,
        "mandatoryError": "Enter the town or city of the applicant's home address."
    },
    "provinceOrState": {
        "regex": /[^A-Za-z\s,-/()]/,
        "regexError": "Province/state name must contain only letters, spaces and punctuation.",
        "isMandatory": true,
        "mandatoryError": "Enter the province or state of the applicant's home address."
    },
    "postcode": {
        "regex": /[^A-Za-z0-9\s]/,
        "regexError": "Postcode must contain only letters, numbers and spaces.",
        "isMandatory": false,
        "mandatoryError": ""
    }
}

export function validateFreeTextFields(formData: IFormData) {
    let errorsExist = false
    let errorMessages = {
        fullName: "",
        passportNumber: "",
        applicantHomeAddress1: "",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "",
        provinceOrState: "",
        postcode: ""
    }

    for (let field in formData) {
        if (field in fieldValidationDetails) {
            const textFieldValue = formData[field as keyof typeof formData]
            const validationDetails = fieldValidationDetails[field as keyof typeof fieldValidationDetails]
            if (validationDetails.isMandatory && textFieldValue.length < 1) {
                errorsExist = true
                errorMessages[field as keyof typeof errorMessages] = validationDetails.mandatoryError
            } else if (textFieldValue.search(new RegExp(validationDetails.regex)) > -1 ) {
                errorsExist = true
                errorMessages[field as keyof typeof errorMessages] = validationDetails.regexError
            }
        }
    }

    return {
        "errorsExist": errorsExist,
        "errorMessages": errorMessages
    }
}