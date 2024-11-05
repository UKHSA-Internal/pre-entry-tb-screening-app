import { IFormData } from "@utils/IFormData"

const textFields = {
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
        if (field in textFields) {
            const textFieldValue = formData[field as keyof typeof formData]
            const textFieldRegex = textFields[field as keyof typeof textFields].regex
            const textFieldRegexError = textFields[field as keyof typeof textFields].regexError
            const textFieldIsMandatory = textFields[field as keyof typeof textFields].isMandatory
            const textFieldMandatoryError = textFields[field as keyof typeof textFields].mandatoryError
            
            if (textFieldIsMandatory && textFieldValue.length < 1) {
                errorsExist = true
                errorMessages[field as keyof typeof errorMessages] = textFieldMandatoryError
            } else if (textFieldValue.search(new RegExp(textFieldRegex)) > -1 ) {
                errorsExist = true
                errorMessages[field as keyof typeof errorMessages] = textFieldRegexError
            }
        }
    }

    return {
        "errorsExist": errorsExist,
        "errorMessages": errorMessages
    }
}