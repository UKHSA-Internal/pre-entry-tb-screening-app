//This holds all fields of the Medical Confirmation Page
export class MedicalConfirmationPage {
  visit(): void {
    cy.visit("/medical-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Medical history and TB symptoms confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "Medical history and TB symptoms confirmed").should("be.visible");
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
      .and("have.attr", "href", "/medical-summary");
  }

  // Verify page title
  verifyPageTitle(): void {
    cy.title().should("include", "Complete UK Pre-Entry Health Screening");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
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
