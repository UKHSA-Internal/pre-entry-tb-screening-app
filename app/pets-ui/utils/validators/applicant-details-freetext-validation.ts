import { IFormData } from "@utils/IFormData"

const textFields = {
    "fullName": {
        "error": "Full name must contain only letters and spaces.",
        "regex": /[^A-Za-z\s]/
    },
    "passportNumber": {
        "error": "Passport number must contain only letters and numbers.",
        "regex": /[^A-Za-z0-9]/
    },
    "applicantHomeAddress1": {
        "error": "Home address must contain only letters, numbers, spaces and punctuation.",
        "regex": /[^A-Za-z0-9\s,-/()]/
    },
    "applicantHomeAddress2": {
        "error": "Home address must contain only letters, numbers, spaces and punctuation.",
        "regex": /[^A-Za-z0-9\s,-/()]/
    },
    "applicantHomeAddress3": {
        "error": "Home address must contain only letters, numbers, spaces and punctuation.",
        "regex": /[^A-Za-z0-9\s,-/()]/
    },
    "townOrCity": {
        "error": "Town name must contain only letters, spaces and punctuation.",
        "regex": /[^A-Za-z\s,-/()]/
    },
    "provinceOrState": {
        "error": "Province/state name must contain only letters, spaces and punctuation.",
        "regex": /[^A-Za-z\s,-/()]/
    },
    "postcode": {
        "error": "Postcode must contain only letters, numbers and spaces.",
        "regex": /[^A-Za-z0-9\s]/
    }
}

export function validateFreeTextFields(formData: IFormData) {
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
            const textFieldErrorMessage = textFields[field as keyof typeof textFields].error
            if (textFieldValue.search(new RegExp(textFieldRegex)) > -1 ) {
                errorMessages[field as keyof typeof errorMessages] = textFieldErrorMessage
            }
        }
    }

    return errorMessages
}