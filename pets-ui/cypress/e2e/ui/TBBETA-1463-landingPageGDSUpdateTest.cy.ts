// Header and Footer GDS Styling Verification Tests
// Tests verify that header and footer sections match new GDS styling
// and that all links retain their current functionality

describe("Header Styling and Functionality - Logged Out State", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display GOV.UK header with correct styling on landing page", () => {
    // Verify GOV.UK header structure
    cy.get(".govuk-header").should("be.visible").and("have.css", "background-color");

    // Verify GOV.UK logo
    cy.get(".govuk-header__logo")
      .should("be.visible")
      .within(() => {
        cy.get(".govuk-header__logotype").should("exist");
        cy.contains("GOV.UK").should("be.visible");
      });

    // Verify service name
    cy.get(".govuk-service-navigation__link")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");

    // Verify skip link for accessibility
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain", "Skip to main content");

    cy.get(".govuk-footer").should("be.visible").and("have.css", "background-color");

    // Verify footer links section
    cy.acceptCookies();
    cy.get(".govuk-footer__meta").should("be.visible");

    // Verify all required footer links are present with correct styling
    const expectedFooterLinks = ["Privacy", "Cookies", "Accessibility statement"];
    expectedFooterLinks.forEach((linkText) => {
      cy.contains(".govuk-footer__link", linkText)
        .should("be.visible")
        .and("have.class", "govuk-footer__link");
    });

    // Verify footer meta information
    cy.get(".govuk-footer__meta").within(() => {
      cy.contains("UK Health Security Agency").should("be.visible");
      cy.contains("Open Government Licence v3.0").should("be.visible");
      cy.contains("Crown copyright").should("be.visible");
    });

    // Verify OGL licensing section
    cy.get(".govuk-footer__licence-description").should("be.visible");

    // Verify Privacy link
    cy.contains(".govuk-footer__link", "Privacy").should("have.attr", "href").and("not.be.empty");
    cy.contains(".govuk-footer__link", "Privacy").click();
    cy.url().should("include", "/privacy");

    // Navigate back and verify Cookies link
    cy.visit("/");
    cy.contains(".govuk-footer__link", "Cookies").should("have.attr", "href").and("not.be.empty");
    cy.contains(".govuk-footer__link", "Cookies").click();
    cy.url().should("include", "/cookies");

    // Navigate back and verify Accessibility statement link
    cy.visit("/");
    cy.contains(".govuk-footer__link", "Accessibility statement")
      .should("have.attr", "href")
      .and("not.be.empty");
    cy.contains(".govuk-footer__link", "Accessibility statement").click();
    cy.url().should("include", "/accessibility-statement");
  });
});
