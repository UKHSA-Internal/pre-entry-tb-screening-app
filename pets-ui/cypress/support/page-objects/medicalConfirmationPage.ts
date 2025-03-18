//This holds all fields of the Medical Confirmation Page
export class MedicalConfirmationPage {
  visit(): void {
    cy.visit("/medical-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Medical screening record created").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "Medical screening record created").should("be.visible");
  }

  // Verify the "What happens next" section
  verifyNextStepsSection(): void {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains(
      "p",
      "The applicant is now ready to conduct their chest x-ray or sputum test.",
    ).should("be.visible");
  }

  // Click the continue button
  clickContinueButton(): void {
    cy.contains("button", "Continue to chest X-ray").should("be.visible").click();
  }

  // Verify redirection after clicking continue
  verifyRedirectionAfterContinue(): void {
    cy.url().should("include", "/chest-xray");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
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

  // Verify footer contains license information
  verifyFooterLicense(): void {
    cy.get(".govuk-footer__licence-description")
      .should("be.visible")
      .and("contain", "Open Government Licence");
  }

  // Verify footer contains crown copyright
  verifyCrownCopyright(): void {
    cy.get(".govuk-footer__copyright-logo").should("be.visible").and("contain", "Crown copyright");
  }

  // Check all elements on confirmation page
  verifyAllConfirmationElements(): void {
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    cy.contains("button", "Continue to chest x-ray").should("be.visible");
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    this.verifyFooterLicense();
    this.verifyCrownCopyright();
  }
}
