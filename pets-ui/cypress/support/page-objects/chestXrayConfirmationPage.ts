//This holds all fields of the Chest X-ray Confirmation Page
export class ChestXrayConfirmationPage {
  visit(): void {
    cy.visit("/chest-xray-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1.govuk-panel__title", "Radiological outcome confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Verify confirmation panel
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1.govuk-panel__title", "Radiological outcome confirmed").should("be.visible");
  }

  // Verify next steps section
  verifyNextStepsSection(): void {
    cy.contains("h2.govuk-heading-m", "What happens next").should("be.visible");
    cy.contains("p.govuk-body", "You can now return to the progress tracker.").should("be.visible");
  }

  // Click continue button
  clickContinueButton(): void {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/chest-xray-summary");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
  }

  // Get the current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): void {
    this.clickContinueButton();
    cy.url().should("include", expectedUrlPath);
  }

  // Check all elements on the page
  verifyAllPageElements(): void {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
  }
}
