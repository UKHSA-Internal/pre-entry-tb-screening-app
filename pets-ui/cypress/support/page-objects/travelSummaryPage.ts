// This holds all the fields on the Travel Summary Page
export class TravelSummaryPage {
  visit(): void {
    cy.visit("http://localhost:3000/travel-summary");
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
    cy.url().should("include", "http://localhost:3000/travel-confirmation");
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
        cy.get("#visa-type select").should("have.value", expectedValue);
        break;
      case "UK Address Line 1":
        cy.get('input[type="text"][name="applicantUkAddress1"]').should(
          "have.value",
          expectedValue,
        );
        break;
      case "UK Address Line 2":
        cy.get('input[type="text"][name="applicantUkAddress2"]').should(
          "have.value",
          expectedValue,
        );
        break;
      case "UK Town or City":
        cy.get('input[type="text"][name="townOrCity"]').should("have.value", expectedValue);
        break;
      case "UK Postcode":
        cy.get('input[type="text"][name="postcode"]').should("have.value", expectedValue);
        break;
      case "UK Mobile Number":
        cy.get('input[type="text"][name="ukMobileNumber"]').should("have.value", expectedValue);
        break;
      case "UK Email Address":
        cy.get('input[type="text"][name="ukEmail"]').should("have.value", expectedValue);
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
    this.verifySummaryValue("UK Address Line 1", address1);
    this.verifySummaryValue("UK Town or City", townOrCity);
    this.verifySummaryValue("UK Postcode", postcode);
    this.verifySummaryValue("UK Mobile Number", mobileNumber);
    this.verifySummaryValue("UK Email Address", email);
  }
}
