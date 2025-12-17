const stringAssert = (value: unknown): string => {
  if (!value) {
    throw new Error("Value is required");
  }
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
  return value;
};

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
    email: stringAssert(Cypress.env("USER_1_EMAIL")),
    password: stringAssert(Cypress.env("USER_1_PASSWORD")),
  },
  {
    email: stringAssert(Cypress.env("USER_2_EMAIL")),
    password: stringAssert(Cypress.env("USER_2_PASSWORD")),
  },
  {
    email: stringAssert(Cypress.env("USER_3_EMAIL")),
    password: stringAssert(Cypress.env("USER_3_PASSWORD")),
  },
  {
    email: stringAssert(Cypress.env("USER_4_EMAIL")),
    password: stringAssert(Cypress.env("USER_4_PASSWORD")),
  },
  {
    email: stringAssert(Cypress.env("USER_5_EMAIL")),
    password: stringAssert(Cypress.env("USER_5_PASSWORD")),
  },
  {
    email: stringAssert(Cypress.env("USER_6_EMAIL")),
    password: stringAssert(Cypress.env("USER_6_PASSWORD")),
  },
];
