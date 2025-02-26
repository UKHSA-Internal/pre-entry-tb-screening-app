export const testData = {
  fullName: "John Doe",
  sex: "male",
  birthDate: { day: "04", month: "01", year: "2001" },
  passport: {
    number: "AA1235467",
    issueDate: { day: "11", month: "11", year: "2019" },
    expiryDate: { day: "11", month: "11", year: "2029" },
  },
  address: {
    line1: "123",
    line2: "100th St",
    line3: "West Lane",
    town: "North Battleford",
    province: "Saskatchewan",
    postcode: "S4R 0M6",
  },
};

export const testCredentials: Array<{ email: string; password: string }> = [
  {
    email: String(Cypress.env("USER_1_EMAIL") || "pets.tester@hotmail.com"),
    password: String(Cypress.env("USER_1_PASSWORD") || "qa!T3ster1"),
  },
  {
    email: String(Cypress.env("USER_2_EMAIL") || "pets.tester1@hotmail.com"),
    password: String(Cypress.env("USER_2_PASSWORD") || "qa!T3ster1"),
  },
  {
    email: String(Cypress.env("USER_3_EMAIL") || "pets.tester2@hotmail.com"),
    password: String(Cypress.env("USER_3_PASSWORD") || "qa!T3ster1"),
  },
  {
    email: String(Cypress.env("USER_4_EMAIL") || "pets.tester3@hotmail.com"),
    password: String(Cypress.env("USER_4_PASSWORD") || "qa!T3ster1"),
  },
  {
    email: String(Cypress.env("USER_5_EMAIL") || "pets.tester4@hotmail.com"),
    password: String(Cypress.env("USER_5_PASSWORD") || "qa!T3ster1"),
  },
  {
    email: String(Cypress.env("USER_6_EMAIL") || "pets.tester5@hotmail.com"),
    password: String(Cypress.env("USER_6_PASSWORD") || "qa!T3ster1"),
  },
];
