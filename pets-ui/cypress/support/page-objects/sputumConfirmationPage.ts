//This holds all fields of the Sputum Confirmation Page
export class SputumConfirmationPage {
  visit(): void {
    cy.visit("/sputum-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
  }

  // Verify the "What happens next" section
  verifyNextStepsSection(): void {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker.").should("be.visible");
  }

  // Click the continue button
  clickContinueButton(): void {
    cy.contains("button", "Continue").should("be.visible").click();
  }

  // Verify redirection after clicking continue
  verifyRedirectionAfterContinue(): void {
    cy.url().should("include", "/tracker");
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/sputum-confirmation");
  }

  // Verify page title
  verifyPageTitle(): void {
    cy.title().should("include", "Complete UK pre-entry health screening");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
  }

  // Check all elements on confirmation page
  verifyAllConfirmationElements(): void {
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    cy.contains("button", "Continue").should("be.visible");
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
  }
}
