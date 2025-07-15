//This holds all fields on the Travel Confirmation Page
export class TravelConfirmationPage {
  // Navigation
  visit(): void {
    cy.visit("/travel-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.url().should("include", "/travel-confirmation");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Travel information confirmed");
  }

  // Verify what happens next text
  verifyNextStepsText(): void {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker.").should("be.visible");
  }

  // Submit Form - button text changed
  submitForm(): void {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
  }

  // Click continue button
  clickContinue(): void {
    cy.contains("button", "Continue").should("be.visible").and("be.enabled").click();
  }

  // Verify redirection to progress tracker
  verifyRedirectionToProgressTracker(): void {
    cy.url().should("include", "/tracker");
  }

  // Verify back link points to travel summary
  verifyBackLink(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/travel-summary")
      .and("contain", "Back");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening")
      .and("have.attr", "href", "/");
  }

  // Verify confirmation panel styling and content
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");

    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Travel information confirmed");
  }

  // NEW: Verify page layout structure
  verifyPageLayout(): void {
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
  }

  // NEW: Verify continue button styling
  verifyContinueButtonStyling(): void {
    cy.contains("button", "Continue")
      .should("have.attr", "type", "submit")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs").should("exist");
  }

  // Complete confirmation and proceed to tracker
  confirmAndProceed(): void {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.clickContinue();
    this.verifyRedirectionToProgressTracker();
  }

  // Verify all elements on the page
  verifyAllPageElements(): void {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.verifyConfirmationPanel();
    this.verifyBackLink();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }
  // Comprehensive page validation
  verifyCompletePageStructure(): void {
    this.verifyPageLayout();
    this.verifyConfirmationPanel();
    this.verifyNextStepsText();
    this.verifyContinueButtonStyling();
    this.verifyBackLink();
  }

  // Descriptive method for the full flow
  completeConfirmationFlow(): void {
    this.verifyAllPageElements();
    this.clickContinue();
    this.verifyRedirectionToProgressTracker();
  }
}
