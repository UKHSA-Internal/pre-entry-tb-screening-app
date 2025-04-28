// This holds all the fields on the Travel Summary Page
export class TravelSummaryPage {
  visit(): void {
    cy.visit("/travel-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.url().should("include", "/travel-summary");
  }

  // Submit Form
  submitForm(): void {
    cy.get('button[type="submit"]').should("be.visible").click();
  }

  // Verify redirection to confirmation page
  verifyRedirectionToConfirmationPage(): void {
    cy.url().should("include", "/travel-confirmation");
  }

  // Click the change link for a specific summary entry
  clickChangeLink(summaryItemKey: string): void {
    cy.get(".govuk-summary-list__key")
      .contains(summaryItemKey)
      .closest(".govuk-summary-list__row")
      .find(".govuk-link")
      .contains("Change")
      .click();
  }

  // Verify field value after clicking change
  verifyFieldValueOnChangePage(fieldName: string, expectedValue: string): void {
    switch (fieldName) {
      case "Visa type":
        // Use multiple selectors to handle different DOM structures
        cy.get('select[name="visaType"], #visa-type select')
          .should("exist")
          .then(($select) => {
            if ($select.length > 0) {
              cy.wrap($select).should("have.value", expectedValue);
            } else {
              // Try an alternative approach for visa type
              cy.contains("Visa type").parent().find("select").should("have.value", expectedValue);
            }
          });
        break;
      case "UK address line 1":
        cy.get('input[type="text"][name="applicantUkAddress1"], #address-1').should(
          "have.value",
          expectedValue,
        );
        break;
      case "UK address line 2":
        cy.get('input[type="text"][name="applicantUkAddress2"], #address-2').should(
          "have.value",
          expectedValue,
        );
        break;
      case "UK town or city":
        cy.get('input[type="text"][name="townOrCity"], #town-or-city').should(
          "have.value",
          expectedValue,
        );
        break;
      case "UK postcode":
        cy.get('input[type="text"][name="postcode"], #postcode').should(
          "have.value",
          expectedValue,
        );
        break;
      case "UK mobile number":
        cy.get(
          'input[type="text"][name="ukMobileNumber"], [aria-labelledby="mobile-number"]',
        ).should("have.value", expectedValue);
        break;
      case "UK email address":
        cy.get('input[type="text"][name="ukEmail"], [aria-labelledby="email"]').should(
          "have.value",
          expectedValue,
        );
        break;
    }

    // Go back to summary page
    cy.go("back");
  }

  // Verify URL after clicking change
  verifyUrlOnChangePage(expectedUrl: string): void {
    cy.url().should("include", expectedUrl);
  }

  getSummaryValue(summaryItemKey: string): Cypress.Chainable<string> {
    return cy
      .get(".govuk-summary-list__key")
      .contains(summaryItemKey)
      .closest(".govuk-summary-list__row")
      .find(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify summary value
  verifySummaryValue(summaryItemKey: string, expectedValue: string): void {
    this.getSummaryValue(summaryItemKey).should("eq", expectedValue);
  }

  // Verify all required summary values are present
  verifyRequiredSummaryValues(
    visaType: string,
    address1: string,
    townOrCity: string,
    postcode: string,
    mobileNumber: string,
    email: string,
  ): void {
    this.verifySummaryValue("Visa type", visaType);
    this.verifySummaryValue("UK address line 1", address1);
    this.verifySummaryValue("UK town or city", townOrCity);
    this.verifySummaryValue("UK postcode", postcode);
    this.verifySummaryValue("UK mobile number", mobileNumber);
    this.verifySummaryValue("UK email address", email);
  }
}
