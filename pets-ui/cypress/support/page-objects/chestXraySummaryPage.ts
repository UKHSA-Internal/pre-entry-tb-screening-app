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

  //Verify X-ray summary information for both populated fields and optional fields
  verifyXraySummaryInfo(expectedValues: {
    "Select X-ray status"?: string;
    "Postero anterior X-ray"?: string;
    "Enter radiological outcome"?: string;
    "Radiological details"?: string;
    "Enter radiographic findings"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, expectedValue]) => {
      if (expectedValue !== undefined) {
        this.verifyField(key, expectedValue);
      }
    });
  }

  /**
   * Check a field's status and value in the X-ray summary
   * @param fieldKey Field label to check
   * @param expectedValue Expected value if field is populated
   * @param optionalLink Whether to expect an optional link if field is not populated
   */
  verifyField(fieldKey: string, expectedValue?: string, optionalLink: boolean = false): void {
    cy.contains("dt.govuk-summary-list__key", fieldKey).then(($dt) => {
      const $value = $dt.siblings(".govuk-summary-list__value");

      // Check if this field contains an optional link
      if ($value.find("a").length > 0) {
        if (optionalLink) {
          // Verify we have the expected optional link
          cy.wrap($value).find("a").should("contain", fieldKey);
        } else if (expectedValue) {
          // This is to check where expecting a value but found a link - this should then fail
          throw new Error(
            `Expected field "${fieldKey}" to have value "${expectedValue}" but found optional link instead`,
          );
        }
      } else {
        // Field has a value, not a link
        if (expectedValue) {
          cy.wrap($value)
            .invoke("text")
            .then((text) => {
              // Trim the text to handle whitespace (This is inline with Will's fix for whitespaces)
              expect(text.trim()).to.eq(expectedValue);
            });
        }
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

  // Check change links exist with correct URLs
  verifyChangeLinksExist(): void {
    // Define fields to check with different possible states
    const fields = [
      { key: "Select X-ray status", expectedHref: "/chest-xray-question#chest-xray-taken" },
      { key: "Postero anterior X-ray", expectedHref: "/chest-xray-upload#postero-anterior-xray" },
      { key: "Enter radiological outcome", expectedHref: "/chest-xray-findings#xray-result" },
      { key: "Radiological details", expectedHref: "/chest-xray-findings#xray-result-detail" },
      {
        key: "Enter radiographic findings",
        expectedHref: "/chest-xray-findings#xray-minor-findings",
      },
    ];

    // Check each field
    fields.forEach((field) => {
      // First check if the field key exists
      cy.contains("dt.govuk-summary-list__key", field.key).then(($dt) => {
        // Get the value cell
        const $value = $dt.siblings(".govuk-summary-list__value");

        // Check if value contains a link (optional field not filled)
        if ($value.find("a").length > 0) {
          // Check the link URL for optional fields
          cy.wrap($value).find("a").should("have.attr", "href", field.expectedHref);
        } else {
          // Value is populated, should have a change link
          const $actions = $dt.siblings(".govuk-summary-list__actions");

          //Verify change link if actions cell exists
          if ($actions.length > 0) {
            cy.wrap($actions)
              .find("a")
              .should("contain", "Change")
              .and("have.attr", "href", field.expectedHref);
          }
        }
      });
    });
  }

  // Click Confirm
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
      "Select X-ray status"?: string;
      "Postero anterior X-ray"?: string;
      "Enter radiological outcome"?: string;
      "Radiological details"?: string;
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
