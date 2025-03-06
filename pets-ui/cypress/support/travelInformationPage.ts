export class TravelInformationPage {
  // Visit the Travel Information page
  visit(): void {
    cy.visit("/travel-information");
  }

  // Verify page is loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Travel Information").should("be.visible");
  }

  // Select Visa Type
  selectVisaType(visaType: string): void {
    cy.contains("label", "Visa type").siblings("select").select(visaType);
  }

  // Fill UK Address Details
  fillAddressLine1(address: string): void {
    cy.contains("label", "Address line 1")
      .siblings(".govuk-input__wrapper")
      .find("input")
      .should("be.visible")
      .clear()
      .type(address);
  }

  fillAddressLine2(address: string): void {
    cy.contains("label", "Address line 2 (optional)")
      .siblings(".govuk-input__wrapper")
      .find("input")
      .should("be.visible")
      .clear()
      .type(address);
  }

  fillTownOrCity(townOrCity: string): void {
    cy.contains("label", "Town/City")
      .siblings(".govuk-input__wrapper")
      .find("input")
      .should("be.visible")
      .clear()
      .type(townOrCity);
  }

  fillPostcode(postcode: string): void {
    cy.contains("label", "Postcode")
      .siblings(".govuk-input__wrapper")
      .find("input")
      .should("be.visible")
      .clear()
      .type(postcode);
  }

  // Fill Contact Details
  fillMobileNumber(mobileNumber: string): void {
    cy.contains("h2", "Applicant's UK phone number")
      .siblings(".govuk-form-group")
      .find("input")
      .should("be.visible")
      .clear()
      .type(mobileNumber);
  }

  fillEmail(email: string): void {
    cy.contains("h2", "Applicant's UK email")
      .siblings(".govuk-form-group")
      .find("input")
      .should("be.visible")
      .clear()
      .type(email);
  }

  // Submit Form
  submitForm(): void {
    cy.contains("button", "Save and continue").should("be.visible").click();
  }

  // Error Validation Methods
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
  }

  validateErrorMessage(expectedText: string): void {
    this.validateErrorSummaryVisible();
    cy.get(".govuk-error-summary__list").should("contain.text", expectedText);
  }

  // Validate specific field errors
  validateVisaTypeError(): void {
    cy.contains("label", "Visa type")
      .parents(".govuk-form-group")
      .should("have.class", "govuk-form-group--error");
  }

  validateAddressLine1Error(): void {
    cy.contains("label", "Address line 1")
      .parents(".govuk-form-group")
      .should("have.class", "govuk-form-group--error");
  }

  validateTownOrCityError(): void {
    cy.contains("label", "Town/City")
      .parents(".govuk-form-group")
      .should("have.class", "govuk-form-group--error");
  }

  validatePostcodeError(): void {
    cy.contains("label", "Postcode")
      .parents(".govuk-form-group")
      .should("have.class", "govuk-form-group--error");
  }
}
