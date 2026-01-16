//This holds all fields of the Chest X-ray Summary Page
import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper, SummaryHelper } from "../helpers";

export class ChestXraySummaryPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private summary = new SummaryHelper();

  constructor() {
    super("/chest-xray-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXraySummaryPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Check chest X-ray information");

    // check summary list is present
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Note: getSummaryValue and verifySummaryValue are now inherited from BasePage

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
  }): ChestXraySummaryPage {
    Object.entries(expectedValues).forEach(([key, expectedValue]) => {
      if (expectedValue !== undefined) {
        this.verifyField(key, expectedValue);
      }
    });
    return this;
  }

  /**
   * Check a field's status and value in the X-ray summary
   * @param fieldKey Field label to check
   * @param expectedValue Expected value if field is populated
   * @param optionalLink Whether to expect an optional link if field is not populated
   */
  verifyField(
    fieldKey: string,
    expectedValue?: string,
    optionalLink: boolean = false,
  ): ChestXraySummaryPage {
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
    return this;
  }

  // Check if a specific field has a "Change" link
  checkChangeLink(fieldKey: string): Cypress.Chainable {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change");
  }

  // Note: clickChangeLink is inherited from BasePage

  // Check change links exist with correct URLs
  verifyChangeLinksExist(): ChestXraySummaryPage {
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

          // Verify change link if actions cell exists
          if ($actions.length > 0) {
            cy.wrap($actions)
              .find("a")
              .should("contain", "Change")
              .and("have.attr", "href", field.expectedHref);
          }
        }
      });
    });
    return this;
  }

  // Click Save and Continue button
  clickSaveAndContinue(): ChestXraySummaryPage {
    this.button.clickSaveAndContinue();
    return this;
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): ChestXraySummaryPage {
    this.clickSaveAndContinue();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Method to handle case-insensitive field matching
  getSummaryValueCaseInsensitive(fieldKey: string): Cypress.Chainable<string> {
    // First try exact match
    return cy.get("dt.govuk-summary-list__key").then(($keys) => {
      const exactMatch = $keys.filter((_index, element) => {
        return Cypress.$(element).text().trim() === fieldKey;
      });

      if (exactMatch.length > 0) {
        return cy
          .wrap(exactMatch.first())
          .siblings(".govuk-summary-list__value")
          .invoke("text")
          .then((text) => text.trim());
      }

      // If no exact match, try case-insensitive match
      const caseInsensitiveMatch = $keys.filter((_index, element) => {
        return Cypress.$(element).text().trim().toLowerCase() === fieldKey.toLowerCase();
      });

      if (caseInsensitiveMatch.length > 0) {
        return cy
          .wrap(caseInsensitiveMatch.first())
          .siblings(".govuk-summary-list__value")
          .invoke("text")
          .then((text) => text.trim());
      }

      throw new Error(`Field "${fieldKey}" not found in summary list`);
    });
  }

  // Updated verify summary value method with case-insensitive support
  verifySummaryValueCaseInsensitive(fieldKey: string, expectedValue: string): ChestXraySummaryPage {
    this.getSummaryValueCaseInsensitive(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Method specifically for X-ray not taken scenarios
  verifyXrayNotTakenSummaryInfo(expectedValues: {
    "Select X-ray status"?: string;
    "Select x-ray status"?: string;
    "Enter reason X-ray not taken"?: string;
    Details?: string;
    "Sputum required?"?: string;
  }): ChestXraySummaryPage {
    Object.entries(expectedValues).forEach(([key, expectedValue]) => {
      if (expectedValue !== undefined) {
        this.verifyFieldCaseInsensitive(key, expectedValue);
      }
    });
    return this;
  }

  // VerifyF ield method with case-insensitive support
  verifyFieldCaseInsensitive(
    fieldKey: string,
    expectedValue?: string,
    optionalLink: boolean = false,
  ): ChestXraySummaryPage {
    // Try both exact case and lowercase versions
    const fieldsToTry = [fieldKey, fieldKey.toLowerCase()];
    let fieldFound = false;

    cy.get("dt.govuk-summary-list__key")
      .each(($dt) => {
        const actualFieldText = $dt.text().trim();

        if (
          fieldsToTry.some(
            (field) =>
              actualFieldText === field || actualFieldText.toLowerCase() === field.toLowerCase(),
          )
        ) {
          fieldFound = true;
          const $value = $dt.siblings(".govuk-summary-list__value");
          const $valueColumn = $dt.siblings(".govuk-summary-value-column");
          const $actualValue = $value.length > 0 ? $value : $valueColumn;

          if ($actualValue.find("a").length > 0) {
            if (optionalLink) {
              cy.wrap($actualValue).find("a").should("contain", fieldKey);
            } else if (expectedValue) {
              throw new Error(
                `Expected field "${fieldKey}" to have value "${expectedValue}" but found optional link instead`,
              );
            }
          } else {
            if (expectedValue) {
              cy.wrap($actualValue)
                .invoke("text")
                .then((text) => {
                  expect(text.trim()).to.eq(expectedValue);
                });
            }
          }
          return false; // Break out of each loop
        }
      })
      .then(() => {
        if (!fieldFound) {
          throw new Error(`Field "${fieldKey}" not found in summary list`);
        }
      });
    return this;
  }

  // Method to verify X-ray not taken specific fields
  verifyXrayNotTakenFields(): ChestXraySummaryPage {
    // Verify the fields that appear when X-ray is not taken
    cy.contains("dt.govuk-summary-list__key", "Enter reason X-ray not taken").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Details").should("be.visible");
    return this;
  }

  // Change links verification for X-ray not taken scenario
  verifyXrayNotTakenChangeLinks(): ChestXraySummaryPage {
    const fields = [
      { key: "Select x-ray status", expectedHref: "/chest-xray-question#chest-xray-taken" },
      {
        key: "Enter reason X-ray not taken",
        expectedHref: "/chest-xray-not-taken#reason-xray-not-taken",
      },
      { key: "Details", expectedHref: "/chest-xray-not-taken#xray-not-taken-further-details" },
      { key: "Sputum required?", expectedHref: "/sputum-question" },
    ];

    fields.forEach((field) => {
      cy.get("dt.govuk-summary-list__key").each(($dt) => {
        const fieldText = $dt.text().trim();
        if (fieldText.toLowerCase() === field.key.toLowerCase() || fieldText === field.key) {
          const $actions = $dt.siblings(".govuk-summary-list__actions");
          if ($actions.length > 0) {
            cy.wrap($actions)
              .find("a")
              .should("contain", "Change")
              .and("have.attr", "href", field.expectedHref);
          }
          return false; // Break out of each loop
        }
      });
    });
    return this;
  }

  // Comprehensive method for X-ray not taken scenarios
  verifyXrayNotTakenPageElements(xrayInfo: {
    "Select X-ray status"?: string;
    "Enter reason X-ray not taken"?: string;
    Details?: string;
    "Sputum required?"?: string;
  }): ChestXraySummaryPage {
    this.verifyPageLoaded();
    this.verifyXrayNotTakenSummaryInfo(xrayInfo);
    this.verifyXrayNotTakenFields();
    this.verifyXrayNotTakenChangeLinks();
    return this;
  }

  // Method to handle mixed case field names
  getActualFieldKey(expectedKey: string): Cypress.Chainable<string> {
    return cy.get("dt.govuk-summary-list__key").then(($keys) => {
      let actualKey = "";
      $keys.each((_index, element) => {
        const text = Cypress.$(element).text().trim();
        if (text.toLowerCase() === expectedKey.toLowerCase()) {
          actualKey = text;
          return false; // Break the loop
        }
      });
      return actualKey || expectedKey;
    });
  }

  // Verify Xray Summary Info to handle case sensitivity
  verifyXraySummaryInfoFlexible(expectedValues: { [key: string]: string }): ChestXraySummaryPage {
    Object.entries(expectedValues).forEach(([key, expectedValue]) => {
      if (expectedValue !== undefined) {
        this.verifyFieldCaseInsensitive(key, expectedValue);
      }
    });
    return this;
  }

  // Helper method to debug available fields
  logAvailableFields(): ChestXraySummaryPage {
    cy.get("dt.govuk-summary-list__key").each(($dt) => {
      const fieldText = $dt.text().trim();
      cy.log(`Available field: "${fieldText}"`);
    });
    return this;
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
  }): ChestXraySummaryPage {
    this.verifyPageLoaded();
    this.verifyXraySummaryInfo(xrayInfo);
    this.verifyChangeLinksExist();
    return this;
  }
}
