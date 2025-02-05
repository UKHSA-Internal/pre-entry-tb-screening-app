import { randomElement } from "../support/test-utils";
const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];

describe("Validate that the confirm button on the travel information page redirects to the Enter Travel Informmation Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("should redirect user to travel confirmation url", () => {
    cy.visit("http://localhost:3000/travel-details");

    // Select a Visa Type
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("17 Exmoor Rd.");
    cy.get("#address-2").type("Southampton");
    cy.get("#town-or-city").type("Hampshire");
    cy.get("#postcode").type("SO14 0AR");
    cy.get("#mobile-number").type("00447811123456");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that page navigates to travel summary page
    cy.url().should("include", "http://localhost:3000/travel-summary");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate that the page navigates to the travel confirmation page
    cy.url().should("include", "http://localhost:3000/travel-confirmation");
  });
});
