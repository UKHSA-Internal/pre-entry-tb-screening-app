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
    "Apical lordotic X-ray"?: string;
    "Lateral decubitus X-ray"?: string;
    "Enter radiological outcome"?: string;
    "Radiological details"?: string;
    "Enter radiographic findings"?: string;
    "Sputum required?"?: string;
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
      const $valueColumn = $dt.siblings(".govuk-summary-value-column");

      // Check both possible value containers (some fields use different classes)
      const $actualValue = $value.length > 0 ? $value : $valueColumn;

      // Check if this field contains an optional link
      if ($actualValue.find("a").length > 0) {
        if (optionalLink) {
          // Verify we have the expected optional link
          cy.wrap($actualValue).find("a").should("contain", fieldKey);
        } else if (expectedValue) {
          // This is to check where expecting a value but found a link - this should then fail
          throw new Error(
            `Expected field "${fieldKey}" to have value "${expectedValue}" but found optional link instead`,
          );
        }
      } else {
        // Field has a value, not a link
        if (expectedValue) {
          cy.wrap($actualValue)
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
      { key: "Apical lordotic X-ray", expectedHref: "/chest-xray-upload#apical-lordotic-xray" },
      { key: "Lateral decubitus X-ray", expectedHref: "/chest-xray-upload#lateral-decubitus-xray" },
      { key: "Enter radiological outcome", expectedHref: "/chest-xray-findings#xray-result" },
      { key: "Radiological details", expectedHref: "/chest-xray-findings#xray-result-detail" },
      {
        key: "Enter radiographic findings",
        expectedHref: "/chest-xray-findings#xray-minor-findings",
      },
      { key: "Sputum required?", expectedHref: "/sputum-question" },
    ];

    // Check each field
    fields.forEach((field) => {
      // First check if the field key exists
      cy.contains("dt.govuk-summary-list__key", field.key).then(($dt) => {
        // Get the value cell (check both possible classes)
        const $value = $dt.siblings(".govuk-summary-list__value");
        const $valueColumn = $dt.siblings(".govuk-summary-value-column");
        const $actualValue = $value.length > 0 ? $value : $valueColumn;

        // Check if value contains a link (optional field not filled)
        if ($actualValue.find("a").length > 0) {
          // Check the link URL for optional fields
          cy.wrap($actualValue).find("a").should("have.attr", "href", field.expectedHref);
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

  // Click Save and continue
  clickSaveAndContinue(): void {
    cy.get('button[type="submit"]').contains("Save and continue").click();
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/sputum-question");
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
  verifyAllPageElements(xrayInfo: {
    "Select X-ray status"?: string;
    "Postero anterior X-ray"?: string;
    "Apical lordotic X-ray"?: string;
    "Lateral decubitus X-ray"?: string;
    "Enter radiological outcome"?: string;
    "Radiological details"?: string;
    "Enter radiographic findings"?: string;
    "Sputum required?"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyXraySummaryInfo(xrayInfo);
    this.verifyChangeLinksExist();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
  }
}
