import { IDateData } from "@utils/IDateData";

const fieldValidationDetails = {
    "issueDate": {
        "day": "passport-issue-date-day",
        "month": "passport-issue-date-month",
        "year": "passport-issue-date-year",
        "emptyFieldError": "Passport issue date must include a day, month and year.",
        "invalidCharError": "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
        "invalidDateError": "Passport issue date must be a valid date.",
    },
    "expiryDate": {
        "day": "passport-expiry-date-day",
        "month": "passport-expiry-date-month",
        "year": "passport-expiry-date-year",
        "emptyFieldError": "Passport expiry date must include a day, month and year.",
        "invalidCharError": "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month.",
        "invalidDateError": "Passport expiry date must be a valid date.",
    },
    "dateOfBirth": {
        "day": "birth-date-day",
        "month": "birth-date-month",
        "year": "birth-date-year",
        "emptyFieldError": "Date of birth must include a day, month and year.",
        "invalidCharError": "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month.",
        "invalidDateError": "Date of birth date must be a valid date.",
    }
}

const validMonthValues = [
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
    "jan", "feb",  "mar",  "apr", "may", "jun", "jul", "aug",  "sep", "oct",  "nov", "dec",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
]

function isValidDate(day: string, month: string, year: string) {
    if (
        Number(year) < 0 ||
        Number(year) > 9999 ||
        Number(day) < 1 ||
        Number(day) > 31 ||
        (Number(day) > 28 && Number(year) % 4 != 0 && (month == "february" || month == "feb" || month == "2")) ||
        (Number(day) > 29 && Number(year) % 4 == 0 && (month == "february" || month == "feb" || month == "2")) ||
        (Number(day) > 30 && (
            month == "april" || month == "june" || month == "september" || month == "november" || 
            month == "apr" || month == "jun" || month == "sep" || month == "nov" || 
            month == "4" || month == "6" || month == "9" || month == "11"
        ))
    ) {
        return false
    } else {
        return true
    }
}

export function validateDateFields(dateData: IDateData) {
    let isValid = true
    let errorMessages = {
        issueDate: "",
        expiryDate: "",
        dateOfBirth: ""
    }

    for (let field in errorMessages) {
        const dayValue = dateData[fieldValidationDetails[field as keyof typeof fieldValidationDetails].day as keyof typeof dateData]
        const monthValue = dateData[fieldValidationDetails[field as keyof typeof fieldValidationDetails].month as keyof typeof dateData]
        const yearValue = dateData[fieldValidationDetails[field as keyof typeof fieldValidationDetails].year as keyof typeof dateData]
        const validationDetails = fieldValidationDetails[field as keyof typeof fieldValidationDetails]
        
        if (
            dayValue.length < 1 ||
            monthValue.length < 1 ||
            yearValue.length < 1
        ) {
            isValid = false
            errorMessages[field as keyof typeof errorMessages] = validationDetails.emptyFieldError
        } else if (
            dayValue.search(/\D/) > -1 ||
            !validMonthValues.includes(monthValue.toLowerCase()) ||
            yearValue.search(/\D/) > -1
        ) {
            isValid = false
            errorMessages[field as keyof typeof errorMessages] = validationDetails.invalidCharError
        } else if (
            !isValidDate(dayValue, monthValue, yearValue)
        ) {
            isValid = false
            errorMessages[field as keyof typeof errorMessages] = validationDetails.invalidDateError
        }
    }

    return {
        "isValid": isValid,
        "errorMessages": errorMessages
    }
}