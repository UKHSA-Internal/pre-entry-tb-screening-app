//This holds all fields of the Chest X-ray Summary Page
export class ChestXraySummaryPage {
  visit(): void {
    cy.visit("/chest-xray-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Check chest X-ray information");

    // check summary list is present
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

  // Verify X-ray summary information
  verifyXraySummaryInfo(expectedValues: {
    "Select x-ray status"?: string;
    "Postero anterior x-ray"?: string;
    "Enter radiological outcome"?: string;
    "Enter radiographic findings"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  // Check if a specific field has a "Change" link
  checkChangeLink(fieldKey: string): Cypress.Chainable {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change");
  }

  // Click on change link for a specific field
  clickChangeLink(fieldKey: string): void {
    this.checkChangeLink(fieldKey).click();
  }

  // Check specific change links exist with correct URLs
  verifyChangeLinksExist(): void {
    cy.contains("dt.govuk-summary-list__key", "Select x-ray status")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/chest-xray-question#chest-xray-taken");

    cy.contains("dt.govuk-summary-list__key", "Postero anterior x-ray")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/chest-xray-upload#postero-anterior-xray");

    cy.contains("dt.govuk-summary-list__key", "Enter radiological outcome")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/chest-xray-findings#xray-result");

    cy.contains("dt.govuk-summary-list__key", "Enter radiographic findings")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/chest-xray-findings#xray-minor-findings");
  }

  // Click save and continue button
  clickSaveAndContinue(): void {
    cy.contains("button", "Save and continue").click();
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

  // Get the current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): void {
    this.clickSaveAndContinue();
    cy.url().should("include", expectedUrlPath);
  }

  // Check all elements on the page
  verifyAllPageElements(
    applicantInfo: {
      Name?: string;
      "Date of birth"?: string;
      "Passport number"?: string;
    },
    xrayInfo: {
      "Select x-ray status"?: string;
      "Postero anterior x-ray"?: string;
      "Enter radiological outcome"?: string;
      "Enter radiographic findings"?: string;
    },
  ): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyXraySummaryInfo(xrayInfo);
    this.verifyChangeLinksExist();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }
}
