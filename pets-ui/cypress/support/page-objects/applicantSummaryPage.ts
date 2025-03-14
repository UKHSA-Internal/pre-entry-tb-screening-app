//This holds all fields of the Applicant Summary Page
export class ApplicantSummaryPage {
  visit(): void {
    cy.visit("/applicant-summary");
  }
  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Check applicant details").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
  }

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

  // Click change link for a specific field
  clickChangeLink(fieldKey: string): void {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
  }
  // Verify all summary values
  verifyAllSummaryValues(expectedValues: {
    Name?: string;
    Sex?: string;
    "Country of Nationality"?: string;
    "Date of Birth"?: string;
    "Passport number"?: string;
    "Country of Issue"?: string;
    "Passport Issue Date"?: string;
    "Passport Expiry Date"?: string;
    "Home Address Line 1"?: string;
    "Home Address Line 2"?: string;
    "Home Address Line 3"?: string;
    "Town or City"?: string;
    "Province or State"?: string;
    Country?: string;
    Postcode?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }
  confirmDetails(): void {
    cy.contains("button", "Confirm").should("be.visible").click();
  }
  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy.get("dt.govuk-summary-list__key").then(($elements) => {
      const keys = $elements.map((_, el) => Cypress.$(el).text()).get();
      return keys.includes(fieldKey);
    });
  }

  // Verify redirection after confirming details
  verifyRedirectionAfterConfirm(): void {
    cy.url().should("include", "/travel-details");
  }

  // Count total number of summary list items
  getTotalSummaryItems(): Cypress.Chainable<number> {
    return cy.get(".govuk-summary-list__row").its("length");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
  }

  // Verify all change links work
  verifyChangeLinksTargets(): void {
    const expectedFragments = {
      Name: "#name",
      Sex: "#sex",
      "Country of Nationality": "#country-of-nationality",
      "Date of Birth": "#birth-date",
      "Passport number": "#passportNumber",
      "Country of Issue": "#country-of-issue",
      "Passport Issue Date": "#passport-issue-date",
      "Passport Expiry Date": "#passport-expiry-date",
      "Home Address Line 1": "#address-1",
      "Home Address Line 2": "#address-2",
      "Home Address Line 3": "#address-3",
      "Town or City": "#town-or-city",
      "Province or State": "#province-or-state",
      Country: "#address-country",
      Postcode: "#postcode",
    };

    Object.entries(expectedFragments).forEach(([key, fragment]) => {
      cy.contains("dt.govuk-summary-list__key", key)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("have.attr", "href")
        .and("include", fragment);
    });
  }
}
