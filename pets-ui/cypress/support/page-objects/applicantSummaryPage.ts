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
    "Country of nationality"?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
    "Country of issue"?: string;
    "Passport issue date"?: string;
    "Passport expiry date"?: string;
    "Home address line 1"?: string;
    "Home address line 2"?: string;
    "Home address line 3"?: string;
    "Town or city"?: string;
    "Province or state"?: string;
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
      "Country of nationality": "#country-of-nationality",
      "Date of birth": "#birth-date",
      "Passport number": "#passportNumber",
      "Country of issue": "#country-of-issue",
      "Passport issue date": "#passport-issue-date",
      "Passport expiry date": "#passport-expiry-date",
      "Home address line 1": "#address-1",
      "Home address line 2": "#address-2",
      "Home address line 3": "#address-3",
      "Town or city": "#town-or-city",
      "Province or state": "#province-or-state",
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
