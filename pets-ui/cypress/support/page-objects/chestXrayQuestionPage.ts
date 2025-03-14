//This holds all fields of the Chest X-ray Question Page
export class ChestXrayPage {
  visit(): void {
    cy.visit("/chest-xray");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Select X-ray status").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of Birth"?: string;
    "Passport Number"?: string;
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

  // Verify X-ray question is displayed
  verifyXrayQuestionDisplayed(): void {
    cy.contains("h2", "Has the visa applicant had a chest X-ray?").should("be.visible");
    cy.get(".govuk-fieldset__legend")
      .contains("This would typically be the postero-anterior chest X-ray")
      .should("be.visible");
  }

  // Select "Yes" for X-ray taken
  selectXrayTakenYes(): void {
    cy.get('input[name="chestXrayTaken"][value="Yes"]').check();
  }

  // Select "No" for X-ray taken
  selectXrayTakenNo(): void {
    cy.get('input[name="chestXrayTaken"][value="No"]').check();
  }

  // Get current X-ray selection
  getCurrentXraySelection(): Cypress.Chainable<string> {
    return cy.get('input[name="chestXrayTaken"]:checked').invoke("val");
  }

  // Check if X-ray option is selected
  isXrayOptionSelected(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="chestXrayTaken"]:checked').should("exist");
  }
  // Click continue button
  clickContinue(): void {
    cy.contains("button", "Continue").click();
  }

  // Verify form submission with selected option
  submitFormWithOption(option: "Yes" | "No"): void {
    if (option === "Yes") {
      this.selectXrayTakenYes();
    } else {
      this.selectXrayTakenNo();
    }
    this.clickContinue();
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
  }

  // Verify form validation - ensure an option is selected
  verifyFormValidation(): void {
    // Submit form without selecting an option
    this.clickContinue();

    // Verify validation error is displayed
    cy.get(".govuk-error-message").should("be.visible");
    cy.get("#chest-xray-taken-error").should("be.visible");
  }

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of Birth"?: string;
    "Passport Number"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyXrayQuestionDisplayed();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }
}
