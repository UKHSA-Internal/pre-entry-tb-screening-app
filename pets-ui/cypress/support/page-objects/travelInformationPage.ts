//This holds all fields on the Travel Information Page
export class TravelInformationPage {
  // Visit the Travel Information page
  visit(): void {
    cy.visit("http://localhost:3000/travel-details");
  }

  // Verify page is loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Travel Information").should("be.visible");
    cy.contains("p", "Enter the applicant's travel information below.").should("be.visible");
  }

  // Select Visa Type
  selectVisaType(visaType: string): void {
    cy.get("#visa-type select").select(visaType);
  }

  // Fill UK Address Details
  fillAddressLine1(address: string): void {
    cy.get("#address-1 input").clear().type(address);
  }

  fillAddressLine2(address: string): void {
    cy.get("#address-2 input").clear().type(address);
  }

  fillTownOrCity(townOrCity: string): void {
    cy.get("#town-or-city input").clear().type(townOrCity);
  }

  fillPostcode(postcode: string): void {
    cy.get("#postcode input").clear().type(postcode);
  }

  // Fill Contact Details
  fillMobileNumber(mobileNumber: string): void {
    cy.get("#mobile-number input").clear().type(mobileNumber);
  }

  fillEmail(email: string): void {
    cy.get("#email input").clear().type(email);
  }

  // Submit Form
  submitForm(): void {
    cy.contains("button", "Save and continue").click();
  }

  // Error Validation Methods
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
  }

  validateErrorMessage(expectedText: string): void {
    this.validateErrorSummaryVisible();
    cy.get(".govuk-error-summary__list").should("contain.text", expectedText);
  }

  // Validate field errors
  validateVisaTypeError(): void {
    cy.get("#visa-type").should("have.class", "govuk-form-group--error");
  }

  validateAddressLine1Error(): void {
    cy.get("#address-1").should("have.class", "govuk-form-group--error");
  }

  validateTownOrCityError(): void {
    cy.get("#town-or-city").should("have.class", "govuk-form-group--error");
  }

  validatePostcodeError(): void {
    cy.get("#postcode").should("have.class", "govuk-form-group--error");
  }

  // Fill all required fields with valid data
  fillAllRequiredFields(
    visaType: string,
    addressLine1: string,
    townOrCity: string,
    postcode: string,
    mobileNumber: string,
    email: string,
  ): void {
    this.selectVisaType(visaType);
    this.fillAddressLine1(addressLine1);
    this.fillTownOrCity(townOrCity);
    this.fillPostcode(postcode);
    this.fillMobileNumber(mobileNumber);
    this.fillEmail(email);
  }
}
