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
  // Verify all fields are present on the page
  verifyAllFieldsPresent(): void {
    const requiredFields = [
      "Name",
      "Sex",
      "Country of nationality",
      "Date of birth",
      "Passport number",
      "Country of issue",
      "Passport issue date",
      "Passport expiry date",
      "Home address line 1",
      "Home address line 2",
      "Home address line 3",
      "Town or city",
      "Province or state",
      "Country",
      "Postcode",
      "Applicant Photo",
    ];

    requiredFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
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
    "Applicant Photo"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  confirmDetails(): void {
    cy.contains("button", "Save and continue").should("be.visible").click();
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
    cy.get(".govuk-breadcrumbs").should("exist");
  }

  // Verify all change links work
  verifyChangeLinksTargets(): void {
    const expectedFragments = {
      Name: "#name",
      Sex: "#sex",
      "Country of nationality": "#country-of-nationality",
      "Date of birth": "#birth-date",
      "Passport number": "#passport-number",
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
      "Applicant Photo": "/applicant-photo",
    };

    Object.entries(expectedFragments).forEach(([key, fragment]) => {
      cy.contains("dt.govuk-summary-list__key", key)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("have.attr", "href")
        .and("include", fragment);
    });
  }

  // Verify optional address fields show "Enter" links when empty
  verifyOptionalAddressFields(): void {
    // Check if address line 2 shows "Enter" link when empty
    cy.contains("dt.govuk-summary-list__key", "Home address line 2")
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", "Enter home address line 2 (optional)");

    // Check if address line 3 shows "Enter" link when empty
    cy.contains("dt.govuk-summary-list__key", "Home address line 3")
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", "Enter home address line 3 (optional)");
  }

  // Verify back link points to correct page
  verifyBackLink(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/applicant-photo")
      .and("contain", "Back");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
  }

  // Verify that optional fields can be empty or have "Enter" links
  verifyOptionalFieldsHandling(): void {
    // Verify address line 2 and 3 can show "Enter" links (Where no data has been entered in those fields)
    cy.get(".govuk-summary-list__row").each(($row) => {
      const key = $row.find(".govuk-summary-list__key").text();
      const value = $row.find(".govuk-summary-list__value");

      if (key.includes("Home address line 2") || key.includes("Home address line 3")) {
        // These fields might contain "Enter" links when empty
        cy.wrap(value).should("exist");
      }
    });
  }

  //Get change link URL for a specific field
  getChangeLinkUrl(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .invoke("attr", "href");
  }

  //Verify applicant photo filename is displayed
  verifyApplicantPhotoDisplayed(expectedFilename?: string): void {
    if (expectedFilename) {
      this.verifySummaryValue("Applicant Photo", expectedFilename);
    } else {
      // Just verify the field exists
      cy.contains("dt.govuk-summary-list__key", "Applicant Photo").should("exist");
    }
  }
}
