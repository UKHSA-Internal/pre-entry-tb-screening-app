import { randomElement } from "../support/test-utils";

const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];

describe("Validate formed is prefilled with data when user navigates back to the Enter Travel Information", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Form should be prefilled with the data that was entered initially", () => {
    cy.visit("http://localhost:3000/travel-details");

    // Select a Visa Type
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("Flat 2, 26 Monmouth St.");
    cy.get("#address-2").type("Bath");
    cy.get("#town-or-city").type("Somerset");
    cy.get("#postcode").type("BA1 0AP");
    cy.get("#mobile-number").type("00447123402876");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that page navigates to travel summary page
    cy.url().should("include", "http://localhost:3000/travel-summary");

    //Click on a Change link
    cy.get(".govuk-link").then((links) => {
      const randomIndex = Math.floor(Math.random() * links.length);
      const randomLink = links[randomIndex];
      cy.wrap(randomLink).click();

      // Validate that the page navigates to the prefilled travel information page
      cy.url().should("include", "http://localhost:3000/travel-details");
    });
  });
});
