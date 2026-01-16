// PETS Error Page Handling Tests
// Tests for error pages and 404 page with navigation
import { loginViaB2C } from "../../support/commands";

describe("PETS Error Page Handling", () => {
  beforeEach(() => {
    loginViaB2C();
  });

  describe("Server Error Page", () => {
    it("should display 'Sorry there is a problem with the service' page", () => {
      // Visit the error page directly
      cy.visit("/sorry-there-is-problem-with-service");

      // Verify error page displays correct heading
      cy.contains("h1", "Sorry, there is a problem with the service").should("be.visible");

      // Verify error page content
      cy.contains("Try again later").should("be.visible");
      cy.contains("If you completed a section and viewed a confirmation page").should("be.visible");

      // Verify back link exists
      cy.get(".govuk-back-link").should("be.visible").should("contain.text", "Back");
    });

    it("should allow navigation back from error page", () => {
      // First visit search page successfully
      cy.visit("/search-for-visa-applicant");
      cy.url().should("include", "/search-for-visa-applicant");

      // Navigate to error page
      cy.visit("/sorry-there-is-problem-with-service");

      // Verify we're on the error page
      cy.contains("h1", "Sorry, there is a problem with the service").should("be.visible");

      // Click the back link
      cy.get(".govuk-back-link").click();

      // Verify we're back at the search page
      cy.url().should("include", "/search-for-visa-applicant");
    });
  });

  describe("404 Page Not Found Error", () => {
    it("should display 'Page not found' page for 404 error", () => {
      // Attempt to visit a non-existent page
      cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });

      // Verify 404 error page displays correct heading
      cy.contains("h1", "Page not found").should("be.visible");

      // Verify 404-specific content
      cy.contains("If you typed the web address, check it is correct").should("be.visible");
      cy.contains("If you pasted the web address, check you copied the entire address").should(
        "be.visible",
      );
      cy.contains("If the web address is correct or you selected a link or button").should(
        "be.visible",
      );

      // Verify back link exists
      cy.get(".govuk-back-link").should("be.visible").should("contain.text", "Back");
    });

    it("should allow navigation back from 404 error page", () => {
      // First visit a known working page
      cy.visit("/search");
      cy.url().should("include", "/search");

      // Navigate to non-existent page
      cy.visit("/non-existent-page", { failOnStatusCode: false });

      // Verify we're on 404 page
      cy.contains("h1", "Page not found").should("be.visible");

      // Click the back link
      cy.get(".govuk-back-link").click();

      // Verify we're back at the search page
      cy.url().should("include", "/search");
    });
  });

  it("should display service name on all error pages", () => {
    // Test error page
    cy.visit("/sorry-there-is-problem-with-service");

    // Wait for error page to load
    cy.contains("h1", "Sorry, there is a problem with the service").should("be.visible");

    // Then check for service name - need to target the link inside the service name span
    cy.get(".govuk-service-navigation__service-name .govuk-service-navigation__link")
      .should("be.visible")
      .should("contain.text", "Complete UK pre-entry health screening");

    // Test 404 error
    cy.visit("/non-existent", { failOnStatusCode: false });

    // Wait for 404 page to load
    cy.contains("h1", "Page not found").should("be.visible");

    // Then check for service name
    cy.get(".govuk-service-navigation__service-name .govuk-service-navigation__link")
      .should("be.visible")
      .should("contain.text", "Complete UK pre-entry health screening");
  });
});
