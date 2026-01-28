/**
 * SummaryHelper - Handles all summary list interactions and verifications
 * Provides methods for reading summary values, verifying change links, and checking summary rows
 */
export class SummaryHelper {
  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): SummaryHelper {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Verify multiple summary values at once
  verifySummaryValues(expectedValues: Record<string, string>): SummaryHelper {
    Object.entries(expectedValues).forEach(([key, value]) => {
      this.verifySummaryValue(key, value);
    });
    return this;
  }

  // Get all summary values from the page
  getAllSummaryValues(): Cypress.Chainable<Record<string, string>> {
    return cy.get(".govuk-summary-list__row").then(($rows) => {
      const summaryValues: Record<string, string> = {};
      $rows.each((_, row) => {
        const key = Cypress.$(row).find(".govuk-summary-list__key").text().trim();
        const value = Cypress.$(row).find(".govuk-summary-list__value").text().trim();
        summaryValues[key] = value;
      });
      return summaryValues;
    });
  }

  // Verify summary row exists
  verifySummaryRowExists(fieldKey: string): SummaryHelper {
    cy.contains("dt.govuk-summary-list__key", fieldKey).should("exist");
    return this;
  }

  // Verify optional field shows "Enter" link or specific text
  verifyOptionalFieldLink(fieldKey: string, linkText: string): SummaryHelper {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", linkText);
    return this;
  }

  // Verify "Not provided" text for optional fields
  verifyNotProvidedText(fieldKey: string): SummaryHelper {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .should("contain.text", "Not provided");
    return this;
  }

  // Verify multiple fields show "Not provided"
  verifyMultipleNotProvidedFields(fieldKeys: string[]): SummaryHelper {
    fieldKeys.forEach((fieldKey) => {
      this.verifyNotProvidedText(fieldKey);
    });
    return this;
  }

  // Verify change links with URLs
  verifyChangeLinksWithUrls(expectedLinks: Record<string, string>): SummaryHelper {
    Object.entries(expectedLinks).forEach(([fieldKey, expectedHref]) => {
      cy.contains("dt.govuk-summary-list__key", fieldKey)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("contain", "Change")
        .and("have.attr", "href", expectedHref);
    });
    return this;
  }

  // Click change link for a summary item
  clickChangeLink(fieldKey: string): SummaryHelper {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Verify required summary fields
  verifyRequiredSummaryFields(expectedFields: string[]): SummaryHelper {
    expectedFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
    return this;
  }

  // Verify summary with optional fields handling
  verifySummaryWithOptionalFields(
    expectedValues: Record<string, string>,
    optionalFields: string[] = [],
  ): SummaryHelper {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value && value !== "") {
        this.verifySummaryValue(key, value);
      } else if (optionalFields.includes(key)) {
        // Optional field should show "Enter" link or be empty
        cy.contains("dt.govuk-summary-list__key", key).should("exist");
      }
    });
    return this;
  }

  // Check if field is present
  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy.get("dt.govuk-summary-list__key").then(($elements) => {
      const keys = $elements.map((_, el) => Cypress.$(el).text()).get();
      return keys.includes(fieldKey);
    });
  }

  // Count total summary items
  getTotalSummaryItems(): Cypress.Chainable<number> {
    return cy.get(".govuk-summary-list__row").its("length");
  }

  // Verify all summary values (with type-safe expected values)
  verifyAllSummaryValues(expectedValues: Record<string, string | undefined>): SummaryHelper {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify change link targets
  verifyChangeLinkTarget(fieldKey: string, expectedHref: string): SummaryHelper {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href", expectedHref);
    return this;
  }

  // Verify all change links work
  verifyChangeLinksTargets(expectedTargets: Record<string, string>): SummaryHelper {
    Object.entries(expectedTargets).forEach(([fieldKey, expectedHref]) => {
      this.verifyChangeLinkTarget(fieldKey, expectedHref);
    });
    return this;
  }
}
