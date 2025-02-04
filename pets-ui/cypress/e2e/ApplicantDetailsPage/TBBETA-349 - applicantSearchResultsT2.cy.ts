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

/*Scenario:
GIVEN I am on the "Search results" page for no matching applicant
WHEN I click on the "Search again" Link
THEN I am navigated to the "Search for Applicant" page.*/


describe("Validate that page navigates to 'Applicant Search' page when user clicks on 'searh again' link'", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/applicant-results");
      cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
        statusCode: 200,
        body: { success: true, message: "Data successfully posted" },
      }).as("formSubmit");
    });
    it("Should navigate to create new application page", () => {
  
      // Click 'search again' link
      cy.get('.govuk-link').click();

      //Validate that page navigates to 'search applicant' page
      cy.url().should('include','http://localhost:3000/applicant-search');

    });
});