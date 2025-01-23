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
WHEN I click on the "Create New Application" button
THEN I am navigated to the "Enter applicant details" page.*/


describe("Validate that page navigates to 'Enter applicant details' page when user clicks on 'Create New Application'", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/applicant-results");
      cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
        statusCode: 200,
        body: { success: true, message: "Data successfully posted" },
      }).as("formSubmit");
    });
    it("Should navigate to create new application page", () => {

    //validate that 'No matching record found ' is visible
    cy.get('h1').should('be.visible').and('have.text', 'No matching record found')
  
    // Click create new applicant button
    cy.get('button[id="create-new-applicant"]').click();

    //Validate that page navigates to enter applicant details page
    cy.url().should('include','http://localhost:3000/contact');

    });
});