// This holds all fields for the TB Clearance Certificate Summary Page
export class TbClearanceCertificateSummaryPage {
  visit(): void {
    cy.visit("/tb-certificate-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Check TB clearance certificate declaration");

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

  // Verify TB certificate summary information
  verifyTbCertificateSummaryInfo(expectedValues: {
    "TB clearance certificate issued?"?: string;
    "Physician comments"?: string;
    "Date of TB clearance certificate"?: string;
    "TB clearance certificate number"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  // Check if fields have a "Change" link
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
    cy.contains("dt.govuk-summary-list__key", "TB clearance certificate issued?")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/tb-certificate-declaration#tb-clearance-issued");

    cy.contains("dt.govuk-summary-list__key", "Physician comments")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/tb-certificate-declaration#physician-comments");

    cy.contains("dt.govuk-summary-list__key", "Date of TB clearance certificate")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/tb-certificate-declaration#tb-certificate-date");

    cy.contains("dt.govuk-summary-list__key", "TB clearance certificate number")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", "/tb-certificate-declaration#tb-certificate-number");
  }

  // Click confirm button
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
    tbCertificateInfo: {
      "TB clearance certificate issued?"?: string;
      "Physician comments"?: string;
      "Date of TB clearance certificate"?: string;
      "TB clearance certificate number"?: string;
    },
  ): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyTbCertificateSummaryInfo(tbCertificateInfo);
    this.verifyChangeLinksExist();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }
}
