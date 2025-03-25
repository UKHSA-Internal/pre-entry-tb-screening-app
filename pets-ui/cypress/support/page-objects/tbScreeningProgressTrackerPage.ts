// This holds all fields for the TB Screening Progress Tracker Page
export class TbScreeningProgressTrackerPage {
  visit(): void {
    cy.visit("/tracker");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "TB screening progress tracker");

    // Check summary list is present
    cy.get(".govuk-summary-list").should("be.visible");
  }

  // Verify applicant information
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): void {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
  }

  // Verify task list status
  verifyTaskStatus(taskName: string, expectedStatus: string): void {
    cy.contains(".govuk-task-list__link", taskName)
      .closest(".govuk-task-list__item")
      .find(".govuk-task-list__status")
      .should("contain", expectedStatus);
  }

  // Click on a task link
  clickTaskLink(taskName: string): void {
    cy.contains(".govuk-task-list__link", taskName).click();
  }

  // Verify specific text is present on the page
  verifyTextPresent(text: string): void {
    cy.contains(".govuk-body", text).should("be.visible");
  }

  // Verify sputum test information text
  verifySputumTestInformationText(): void {
    this.verifyTextPresent("You cannot currently log sputum test information in this system.");
  }

  // Verify complete all sections text
  verifyCompleteAllSectionsText(): void {
    this.verifyTextPresent("Complete all sections.");
  }

  // Click search again button
  clickSearchAgainButton(): void {
    cy.contains("button", "Search again").click();
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

  // Check URL after clicking search again button
  checkRedirectionAfterSearchAgain(expectedUrlPath: string): void {
    this.clickSearchAgainButton();
    cy.url().should("include", expectedUrlPath);
  }

  // Verify visa applicant details task is completed
  verifyVisaApplicantDetailsCompleted(): void {
    this.verifyTaskStatus("Visa applicant details", "Completed");
  }

  // Verify all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyCompleteAllSectionsText();
    this.verifyVisaApplicantDetailsCompleted();
    this.verifySputumTestInformationText();
    this.verifyServiceName();
  }
}
