import { countryList } from "../../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;
const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];

/*Scenario:As a Clinic user
I want to view the results from the applicant search
So that I can see applicants that match the criteria entered during the search process.*/

// Validate the error messages above each text box are correct
const errorMessages = [
  "Enter the applicant's passport number.",
  "Select a country.",
];

describe("Validate that error message is displayed when user clicks the search button without entering a search criteria", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/applicant-search");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display error messages", () => {
    // Click the search button
    cy.get('button[type="submit"]').click();

    // Validate that error message is displayed above each field
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-message").should("contain.text", error);
    });
  });
});
