//This holds all fields on the Applicant Confirmation Page
export class ApplicantConfirmationPage {
  // Navigation
  visit(): void {
    cy.visit("/applicant-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title").should("be.visible").and("contain", "Applicant record created");
  }

  // Verify what happens next text
  verifyNextStepsText(): void {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now add travel information for this applicant").should("be.visible");
  }

  // Click continue button to proceed to travel information
  clickContinueToTravelInformation(): void {
    cy.contains("button", "Continue to travel information").should("be.visible").click();
  }

  // Verify redirection to travel information page
  verifyRedirectionToTravelInformation(): void {
    cy.url().should("include", "/travel-details");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
  }

  // Complete confirmation and proceed to travel information
  confirmAndProceed(): void {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.clickContinueToTravelInformation();
    this.verifyRedirectionToTravelInformation();
  }
}
