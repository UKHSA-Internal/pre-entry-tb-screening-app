// This holds all the fields on the Travel Summary Page
import { BasePage } from "../BasePage";

export class TravelSummaryPage extends BasePage {
  constructor() {
    super("/travel-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): TravelSummaryPage {
    this.verifyUrlContains("/travel-summary");
    return this;
  }

  // Submit Form
  submitForm(): TravelSummaryPage {
    super.submitForm();
    return this;
  }

  // Verify redirection to confirmation page
  verifyRedirectionToConfirmationPage(): TravelSummaryPage {
    this.verifyUrlContains("/travel-confirmation");
    return this;
  }

  // Click the change link for a specific summary entry
  clickChangeLink(summaryItemKey: string): TravelSummaryPage {
    super.clickChangeLink(summaryItemKey);
    return this;
  }

  // Verify field value after clicking change
  verifyFieldValueOnChangePage(fieldName: string, expectedValue: string): TravelSummaryPage {
    const fieldSelectors: Record<string, string> = {
      "Visa type": '[name="visaType"]',
      "UK address line 1": "#address-1-field",
      "UK address line 2": "#address-2-field",
      "UK town or city": "#town-or-city-field",
      "UK postcode": "#postcode-field",
      "UK mobile number": '[name="ukMobileNumber"]',
      "UK email address": '[name="ukEmail"]',
    };

    const selector = fieldSelectors[fieldName];
    if (selector) {
      cy.get(selector).should("exist").should("have.value", expectedValue);
    }

    // Go back to summary page
    cy.go("back");
    return this;
  }

  // Verify URL after clicking change
  verifyUrlOnChangePage(expectedUrl: string): TravelSummaryPage {
    cy.url().should("include", expectedUrl);
    return this;
  }

  // Verify summary value
  verifySummaryValue(summaryItemKey: string, expectedValue: string): TravelSummaryPage {
    super.verifySummaryValue(summaryItemKey, expectedValue);
    return this;
  }

  // Verify all required summary values are present
  verifyRequiredSummaryValues(
    visaType: string,
    address1: string,
    townOrCity: string,
    postcode: string,
    mobileNumber: string,
    email: string,
  ): TravelSummaryPage {
    const expectedValues = {
      "Visa type": visaType,
      "UK address line 1": address1,
      "UK town or city": townOrCity,
      "UK postcode": postcode,
      "UK mobile number": mobileNumber,
      "UK email address": email,
    };

    this.verifySummaryValues(expectedValues);
    return this;
  }
}
