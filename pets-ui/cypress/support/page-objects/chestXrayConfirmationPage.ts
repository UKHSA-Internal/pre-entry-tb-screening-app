//This holds all fields of the Chest X-ray Confirmation Page
export class ChestXrayConfirmationPage {
  visit(): void {
    cy.visit("/chest-xray-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1.govuk-panel__title", "Radiological outcome confirmed").should("be.visible");
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
    cy.contains("button", "Continue").click();
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.contains(".govuk-breadcrumbs__list-item", "Application progress tracker")
      .should("be.visible")
      .find("a")
      .should("have.attr", "href", "/tracker");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.contains(".govuk-header__service-name", "Complete UK Pre-Entry Health Screening").should(
      "be.visible",
    );
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
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }
}
