export const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const errorMessages = [
  "Select a visa type.",
  "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
  "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month.",
  "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month.",
  "Date of birth must include a day, month and year.",
  "Enter applicant's age in years.",
  "Passport issue date must include a day, month and year.",
  "Full name must contain only letters and spaces.",
  "Passport number must contain only letters and numbers.",
  "Home address must contain only letters, numbers, spaces and punctuation.",
  "Home address must contain only letters, numbers, spaces and punctuation.",
  "Home address must contain only letters, numbers, spaces and punctuation.",
  "Town name must contain only letters, spaces and punctuation.",
  "Province/state name must contain only letters, spaces and punctuation",
  "Enter the applicant's passport number.",
  "Select the country of issue.",
  "Enter UK mobile number.",
  "Email must be in correct format.",
];

export const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];

export const urlFragment = ["#age"];

