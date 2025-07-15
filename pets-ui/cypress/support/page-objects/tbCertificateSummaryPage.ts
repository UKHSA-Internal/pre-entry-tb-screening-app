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

  // Verify field shows optional link instead of value
  verifyFieldShowsOptionalLink(fieldKey: string, expectedLinkText: string): void {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("be.visible")
      .and("contain", expectedLinkText);
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
    // Check fields that may have change links (only when they have values, not optional links)
    cy.get(".govuk-summary-list__row").each(($row) => {
      const $value = $row.find("dd.govuk-summary-list__value");
      const $actions = $row.find("dd.govuk-summary-list__actions");

      // Only verify change links for rows that have actual values (not optional links)
      if ($actions.length > 0 && $value.find("a").length === 0) {
        cy.wrap($actions)
          .find("a")
          .should("contain", "Change")
          .and("have.attr", "href")
          .and("include", "/tb-certificate-declaration");
      }
    });
  }

  // Verify specific change link URLs
  verifySpecificChangeLinks(): void {
    const expectedLinks = {
      "TB clearance certificate issued?": "/tb-certificate-declaration#tb-clearance-issued",
      "Date of TB clearance certificate": "/tb-certificate-declaration#tb-certificate-date",
      "TB clearance certificate number": "/tb-certificate-declaration#tb-certificate-number",
    };

    Object.entries(expectedLinks).forEach(([fieldKey, expectedHref]) => {
      cy.contains("dt.govuk-summary-list__key", fieldKey).then(($key) => {
        const $row = $key.closest(".govuk-summary-list__row");
        const $actions = $row.find("dd.govuk-summary-list__actions");

        if ($actions.length > 0) {
          cy.wrap($actions)
            .find("a")
            .should("contain", "Change")
            .and("have.attr", "href", expectedHref);
        }
      });
    });
  }

  // Click Save and Continue button
  clickSaveAndContinue(): void {
    cy.get('button[type="submit"]').contains("Save and continue").should("be.visible").click();
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
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

  // Verify save and continue button
  verifySaveAndContinueButton(): void {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Save and continue");
  }

  // Verify all required fields are present
  verifyRequiredFieldsPresent(): void {
    const requiredFields = [
      "TB clearance certificate issued?",
      "Physician comments",
      "Date of TB clearance certificate",
      "TB clearance certificate number",
    ];

    requiredFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("be.visible");
    });
  }

  // Handle mixed scenarios where some fields have values and others show optional links
  verifyMixedFieldScenario(
    fieldsWithValues: {
      [key: string]: string;
    },
    fieldsWithOptionalLinks: {
      [key: string]: string;
    },
  ): void {
    // Verify fields with actual values
    Object.entries(fieldsWithValues).forEach(([fieldKey, expectedValue]) => {
      this.verifySummaryValue(fieldKey, expectedValue);
    });

    // Verify fields with optional links
    Object.entries(fieldsWithOptionalLinks).forEach(([fieldKey, expectedLinkText]) => {
      this.verifyFieldShowsOptionalLink(fieldKey, expectedLinkText);
    });
  }

  // Verify dynamic scenario
  verifyDynamicScenario(expectedData: {
    fieldsWithValues?: { [key: string]: string };
    fieldsWithOptionalLinks?: { [key: string]: string };
  }): void {
    if (expectedData.fieldsWithValues) {
      Object.entries(expectedData.fieldsWithValues).forEach(([fieldKey, expectedValue]) => {
        this.verifySummaryValue(fieldKey, expectedValue);
      });
    }

    if (expectedData.fieldsWithOptionalLinks) {
      Object.entries(expectedData.fieldsWithOptionalLinks).forEach(
        ([fieldKey, expectedLinkText]) => {
          this.verifyFieldShowsOptionalLink(fieldKey, expectedLinkText);
        },
      );
    }
  }

  // Check all elements on the page
  verifyAllPageElements(tbCertificateInfo?: {
    "TB clearance certificate issued?"?: string;
    "Physician comments"?: string;
    "Date of TB clearance certificate"?: string;
    "TB clearance certificate number"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyRequiredFieldsPresent();
    this.verifyChangeLinksExist();
    this.verifySaveAndContinueButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();

    if (tbCertificateInfo) {
      this.verifyTbCertificateSummaryInfo(tbCertificateInfo);
    }
  }
}
