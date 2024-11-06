import { IFormData } from "@utils/IFormData"

const fieldValidationDetails = {
    "sex": {
        "isMandatory": true,
        "emptyFieldError": "Select the applicant's sex."
    },
}

export function validateRadioFields(formData: IFormData) {
    let isValid = true
    let errorMessages = {
        sex: "",
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