// This holds all fields for the TB Certificate Confirmation Page
export class TbCertificateConfirmationPage {
  visit(): void {
    cy.visit("/tb-certificate-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.get(".govuk-panel--confirmation")
      .should("be.visible")
      .within(() => {
        cy.get(".govuk-panel__title").should("be.visible").and("contain", "TB screening complete");
      });
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title").should("be.visible").and("contain", "TB screening complete");
  }

  // Verify confirmation message
  verifyConfirmationMessage(): void {
    cy.get(".govuk-body")
      .should("be.visible")
      .and("contain", "Thank you for recording the visa applicant's TB screening.");
  }

  // Click finish button
  clickFinishButton(): void {
    cy.get('button[type="submit"]').contains("Finish").should("be.visible").click();
  }

  // Verify finish button is displayed
  verifyFinishButton(): void {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Finish");
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tb-certificate-summary");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
  }

  // Verify grid layout structure
  verifyGridLayout(): void {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
  }

  // Get the current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Check URL after clicking finish button
  checkRedirectionAfterFinish(expectedUrlPath: string): void {
    this.clickFinishButton();
    cy.url().should("include", expectedUrlPath);
  }

  // Verify all elements on the page
  verifyAllPageElements(): void {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyConfirmationMessage();
    this.verifyFinishButton();
    this.verifyGridLayout();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
  }
}
