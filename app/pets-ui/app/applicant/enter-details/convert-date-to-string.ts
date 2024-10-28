const fullMonthToNumber: {[key:string]:string} = {
    "january": "1",
    "february": "2",
    "march": "3",
    "april": "4",
    "may": "5",
    "june": "6",
    "july": "7",
    "august": "8",
    "september": "9",
    "october": "10",
    "november": "11",
    "december": "12",
}

const shortMonthToNumber: {[key:string]:string} = {
    "jan": "1",
    "feb": "2",
    "mar": "3",
    "apr": "4",
    "may": "5",
    "jun": "6",
    "jul": "7",
    "aug": "8",
    "sep": "9",
    "oct": "10",
    "nov": "11",
    "dec": "12",
}

export function convertDateToString(day: string, month: string, year: string) {
    if (month in fullMonthToNumber) {
        month = fullMonthToNumber[month]
    } else if (month in shortMonthToNumber) {
        month = shortMonthToNumber[month]
    }
    return day + "-" + month + "-" + year
}