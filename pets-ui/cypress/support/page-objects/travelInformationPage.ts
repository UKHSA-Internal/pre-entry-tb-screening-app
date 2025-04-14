import { BasePage } from "../BasePage";

export class TravelInformationPage extends BasePage {
  constructor() {
    super("/travel-details");
  }

  // Page verification
  verifyPageLoaded(): TravelInformationPage {
    this.verifyPageHeading("Travel information");
    cy.contains("p", "Enter the applicant's travel information below.").should("be.visible");
    return this;
  }

  // Form field methods
  selectVisaType(visaType: string): TravelInformationPage {
    cy.get('[name="visaType"]').select(visaType);
    return this;
  }

  fillAddressLine1(address: string): TravelInformationPage {
    this.fillTextInput("Address line 1", address);
    return this;
  }

  fillAddressLine2(address: string): TravelInformationPage {
    this.fillTextInput("Address line 2", address);
    return this;
  }

  fillTownOrCity(townOrCity: string): TravelInformationPage {
    this.fillTextInput("Town/city", townOrCity);
    return this;
  }

  fillPostcode(postcode: string): TravelInformationPage {
    this.fillTextInput("Postcode", postcode);
    return this;
  }

  fillMobileNumber(mobileNumber: string): TravelInformationPage {
    cy.get('[name="ukMobileNumber"]').type(mobileNumber);
    return this;
  }

  fillEmail(email: string): TravelInformationPage {
    cy.get('[name="ukEmail"]').type(email);
    return this;
  }

  // Submit Form
  submitForm(): TravelInformationPage {
    cy.contains("button", "Save and continue").click();
    return this;
  }

  // Fill all required fields with valid data
  fillCompleteForm(details: {
    visaType: string;
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): TravelInformationPage {
    this.selectVisaType(details.visaType);
    this.fillAddressLine1(details.ukAddressLine1);

    if (details.ukAddressLine2) {
      this.fillAddressLine2(details.ukAddressLine2);
    }

    this.fillTownOrCity(details.ukTownOrCity);
    this.fillPostcode(details.ukPostcode);
    this.fillMobileNumber(details.mobileNumber);
    this.fillEmail(details.email);

    return this;
  }

  // Error validation methods
  validateErrorSummaryVisible(): TravelInformationPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  validateErrorMessage(expectedText: string): TravelInformationPage {
    this.validateErrorSummaryVisible();
    cy.get(".govuk-error-summary__list").should("contain.text", expectedText);
    return this;
  }

  // Validate field errors
  validateVisaTypeError(): TravelInformationPage {
    this.validateFieldError("visa-type");
    return this;
  }

  validateAddressLine1Error(): TravelInformationPage {
    this.validateFieldError("address-1");
    return this;
  }

  validateTownOrCityError(): TravelInformationPage {
    this.validateFieldError("town-or-city");
    return this;
  }

  validatePostcodeError(): TravelInformationPage {
    this.validateFieldError("postcode");
    return this;
  }

  validateMobileNumberError(): TravelInformationPage {
    this.validateFieldError("mobile-number");
    return this;
  }

  validateEmailError(): TravelInformationPage {
    this.validateFieldError("email");
    return this;
  }

  // Comprehensive validation method
  validateFormErrors(errors: {
    visaType?: string;
    ukAddressLine1?: string;
    ukTownOrCity?: string;
    ukPostcode?: string;
    mobileNumber?: string;
    email?: string;
  }): TravelInformationPage {
    if (errors.visaType) {
      this.validateFieldError("visa-type", errors.visaType);
    }

    if (errors.ukAddressLine1) {
      this.validateFieldError("address-1", errors.ukAddressLine1);
    }

    if (errors.ukTownOrCity) {
      this.validateFieldError("town-or-city", errors.ukTownOrCity);
    }

    if (errors.ukPostcode) {
      this.validateFieldError("postcode", errors.ukPostcode);
    }

    if (errors.mobileNumber) {
      this.validateFieldError("mobile-number", errors.mobileNumber);
    }

    if (errors.email) {
      this.validateFieldError("email", errors.email);
    }

    return this;
  }

  // Verify redirection to confirmation page
  verifyRedirectionToSummaryPage(): TravelInformationPage {
    this.verifyUrlContains("/travel-summary");
    return this;
  }
}
