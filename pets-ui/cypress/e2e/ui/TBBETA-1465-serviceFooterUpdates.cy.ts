describe("Footer New Links Verification", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.acceptCookies();
  });

  it("should display the new footer links and navigate correctly when clicked", () => {
    // GIVEN I navigate to the service footer
    // THEN I see the new links and position of the links as in the wireframe

    // Verify Cookies link is present
    cy.contains(".govuk-footer__link", "Cookies")
      .should("be.visible")
      .and("have.attr", "href")
      .and("not.be.empty");

    // Verify UK tuberculosis technical instructions link is present
    cy.contains(".govuk-footer__link", "UK tuberculosis technical instructions")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "gov.uk/government/publications/uk-tuberculosis-technical-instructions");

    // Verify UK Health Security Agency link is present
    cy.contains(".govuk-footer__link", "UK Health Security Agency")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "gov.uk/government/organisations/uk-health-security-agency");

    // GIVEN I click any of the 3 new links
    // THEN I am navigated to the page for the link

    // Test 1: Cookies link
    cy.contains(".govuk-footer__link", "Cookies")
      .should("not.have.attr", "target", "_blank")
      .click();
    cy.url().should("include", "/cookies");

    // Navigate back to test next link
    cy.go("back");

    // Test 2: UK tuberculosis technical instructions - (verifying attribute only)
    cy.contains(".govuk-footer__link", "UK tuberculosis technical instructions")
      .should("have.attr", "target", "_blank")
      .and("have.attr", "href")
      .and("include", "gov.uk/government/publications/uk-tuberculosis-technical-instructions");

    // Test 3: UK Health Security Agency link - (verifying attribute only)
    cy.contains(".govuk-footer__link", "UK Health Security Agency")
      .should("not.have.attr", "target", "_blank")
      .and("have.attr", "href")
      .and("include", "gov.uk/government/organisations/uk-health-security-agency");
  });
});
