import { IFormData } from "@utils/IFormData"

const fieldValidationDetails = {
    "countryOfNationality": {
        "isMandatory": true,
        "emptyFieldError": "Select the applicant's country of nationality."
    },
    "countryOfIssue": {
        "isMandatory": true,
        "emptyFieldError": "Select the passport country of issue."
    },
    "sex": {
        "isMandatory": true,
        "emptyFieldError": "Select the applicant's sex."
    },
    "typesOfVisa": {
        "isMandatory": true,
        "emptyFieldError": "Select the applicant's visa type."
    },
    "country": {
        "isMandatory": true,
        "emptyFieldError": "Select the country of the applicant's home address."
    }
}

export function validateRadioAndDropdownFields(formData: IFormData) {
    let isValid = true
    let errorMessages = {
        countryOfNationality: "",
        countryOfIssue: "",
        sex: "",
        typesOfVisa: "",
        country: "",
    }

    for (let field in formData) {
        if (field in fieldValidationDetails) {
            const radioFieldValue = formData[field as keyof typeof formData]
            const validationDetails = fieldValidationDetails[field as keyof typeof fieldValidationDetails]
            if (validationDetails.isMandatory && radioFieldValue.length < 1) {
                isValid = false
                errorMessages[field as keyof typeof errorMessages] = validationDetails.emptyFieldError
            }
        }
    }

    return {
        "isValid": isValid,
        "errorMessages": errorMessages
    }
}