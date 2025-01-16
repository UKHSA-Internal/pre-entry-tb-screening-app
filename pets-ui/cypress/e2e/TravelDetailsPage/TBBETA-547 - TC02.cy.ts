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

describe("Enter VALID Data for Applicant Travel Information", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should be redirected to travel confirmation page on submission", () => {
  
    //Select a Visa Type
    cy.get('#visa-type.govuk-select').select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("61 Legard Drive");
    cy.get("#address-2").type("Anlaby");
    cy.get("#town-or-city").type("Hull");
    cy.get("#postcode").type("HU10 6UH");
    cy.get("#mobile-number").type("07123402876");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate that the page navigates to the summary page 
    cy.url().should('include', 'http://localhost:3000/travel-summary'); 
    });
  });

