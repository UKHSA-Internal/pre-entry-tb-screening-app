import { IFormData } from "@utils/IFormData"

const fieldValidationDetails = {
    "fullName": {
        "regex": /[^A-Za-z\s]/,
        "regexError": "Full name must contain only letters and spaces.",
        "isMandatory": true,
        "emptyFieldError": "Enter the applicant's full name."
    },
    "passportNumber": {
        "regex": /[^A-Za-z0-9]/,
        "regexError": "Passport number must contain only letters and numbers.",
        "isMandatory": true,
        "emptyFieldError": "Enter the applicant's passport number."
    },
    "applicantHomeAddress1": {
        "regex": /[^A-Za-z0-9\s,-/()]/,
        "regexError": "Home address must contain only letters, numbers, spaces and punctuation.",
        "isMandatory": true,
        "emptyFieldError": "Enter the first line of the applicant's home address."
    },
    "applicantHomeAddress2": {
        "regex": /[^A-Za-z0-9\s,-/()]/,
        "regexError": "Home address must contain only letters, numbers, spaces and punctuation.",
        "isMandatory": false,
        "emptyFieldError": ""
    },
    "applicantHomeAddress3": {
        "regex": /[^A-Za-z0-9\s,-/()]/,
        "regexError": "Home address must contain only letters, numbers, spaces and punctuation.",
        "isMandatory": false,
        "emptyFieldError": ""
    },
    "townOrCity": {
        "regex": /[^A-Za-z\s,-/()]/,
        "regexError": "Town name must contain only letters, spaces and punctuation.",
        "isMandatory": true,
        "emptyFieldError": "Enter the town or city of the applicant's home address."
    },
    "provinceOrState": {
        "regex": /[^A-Za-z\s,-/()]/,
        "regexError": "Province/state name must contain only letters, spaces and punctuation.",
        "isMandatory": true,
        "emptyFieldError": "Enter the province or state of the applicant's home address."
    },
    "postcode": {
        "regex": /[^A-Za-z0-9\s]/,
        "regexError": "Postcode must contain only letters, numbers and spaces.",
        "isMandatory": false,
        "emptyFieldError": ""
    }
}

export function validateFreeTextFields(formData: IFormData) {
    let isValid = true
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
                isValid = false
                errorMessages[field as keyof typeof errorMessages] = validationDetails.emptyFieldError
            } else if (textFieldValue.search(new RegExp(validationDetails.regex)) > -1 ) {
                isValid = false
                errorMessages[field as keyof typeof errorMessages] = validationDetails.regexError
            }
        }
    }

    return {
        "isValid": isValid,
        "errorMessages": errorMessages
    }
}