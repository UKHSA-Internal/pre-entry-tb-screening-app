// This holds all the fields on the Travel Information Page
import { BasePage } from "../BasePage";
import { randomElement, visaType } from "../test-utils";

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
    cy.get('[name="visaCategory"]').select(visaType);
    return this;
  }

  // Method to select a random visa type
  selectRandomVisaType(): TravelInformationPage {
    const randomVisa = randomElement(visaType);
    cy.log(`Selecting random visa type: ${randomVisa}`);
    this.selectVisaType(randomVisa);
    return this;
  }

  // Method to get the currently selected visa type
  getSelectedVisaType(): Cypress.Chainable<string> {
    return cy
      .get('[name="visaCategory"]')
      .invoke("val")
      .then((value) => value as string);
  }

  fillAddressLine1(address: string): TravelInformationPage {
    cy.get("#address-1-field").clear().type(address);
    return this;
  }

  fillAddressLine2(address: string): TravelInformationPage {
    cy.get("#address-2-field").clear().type(address);
    return this;
  }

  fillTownOrCity(townOrCity: string): TravelInformationPage {
    cy.get("#town-or-city-field").clear().type(townOrCity);
    return this;
  }

  fillPostcode(postcode: string): TravelInformationPage {
    cy.get("#postcode-field").clear().type(postcode);
    return this;
  }

  fillMobileNumber(mobileNumber: string): TravelInformationPage {
    cy.get('[name="ukMobileNumber"]').clear().type(mobileNumber);
    return this;
  }

  fillEmail(email: string): TravelInformationPage {
    cy.get('[name="ukEmail"]').clear().type(email);
    return this;
  }

  // Submit Form
  submitForm(): TravelInformationPage {
    cy.get('button[type="submit"]').contains("Save and continue").click();
    return this;
  }

  // Verify form sections are displayed
  verifyFormSections(): TravelInformationPage {
    cy.contains("h2", "Applicant's UK address (optional)").should("be.visible");
    cy.get("#visa-category").should("be.visible");
    cy.get("#address-1").should("be.visible");
    cy.get("#address-2").should("be.visible");
    cy.get("#town-or-city").should("be.visible");
    cy.get("#postcode").should("be.visible");
    cy.get("#mobile-number").should("be.visible");
    cy.get("#email").should("be.visible");
    return this;
  }

  // Verify field labels
  verifyFieldLabels(): TravelInformationPage {
    cy.contains("label", "Address line 1 (optional)").should("be.visible");
    cy.contains("label", "Address line 2 (optional)").should("be.visible");
    cy.contains("label", "Town/city (optional)").should("be.visible");
    cy.contains("label", "Postcode (optional)").should("be.visible");
    cy.contains("h2", "Phone number (optional)").should("be.visible");
    cy.contains("h2", "Email address (optional)").should("be.visible");
    return this;
  }

  // Verify all fields are empty initially
  verifyAllFieldsEmpty(): TravelInformationPage {
    cy.get("#address-1-field").should("have.value", "");
    cy.get("#address-2-field").should("have.value", "");
    cy.get("#town-or-city-field").should("have.value", "");
    cy.get("#postcode-field").should("have.value", "");
    cy.get('[name="ukMobileNumber"]').should("have.value", "");
    cy.get('[name="ukEmail"]').should("have.value", "");
    return this;
  }

  // Verify visa type dropdown options
  verifyVisaTypeOptions(): TravelInformationPage {
    cy.get('[name="visaCategory"]').should("be.visible");
    cy.get('[name="visaCategory"] option').should("have.length.at.least", 20);
    cy.get('[name="visaCategory"] option[value="Student"]').should("exist");
    cy.get('[name="visaCategory"] option[value="Visitor"]').should("exist");
    cy.get('[name="visaCategory"] option[value="HM Armed Forces"]').should("exist");
    return this;
  }

  // Verify back link
  verifyBackLink(): TravelInformationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tracker");
    return this;
  }

  // Verify submit button
  verifySubmitButton(): TravelInformationPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Save and continue");
    return this;
  }

  // Fill all required fields with valid data
  fillCompleteForm(details: {
    visaType?: string;
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): TravelInformationPage {
    // Use provided visa type or select random one
    if (details.visaType) {
      this.selectVisaType(details.visaType);
    } else {
      this.selectRandomVisaType();
    }

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

  // Method to fill form with random visa type and return the selected visa
  fillCompleteFormWithRandomVisa(details: {
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): Cypress.Chainable<string> {
    const randomVisa = randomElement(visaType);
    cy.log(`Using random visa type: ${randomVisa}`);

    this.selectVisaType(randomVisa);
    this.fillAddressLine1(details.ukAddressLine1);

    if (details.ukAddressLine2) {
      this.fillAddressLine2(details.ukAddressLine2);
    }

    this.fillTownOrCity(details.ukTownOrCity);
    this.fillPostcode(details.ukPostcode);
    this.fillMobileNumber(details.mobileNumber);
    this.fillEmail(details.email);

    return cy.wrap(randomVisa);
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(expectedData: {
    visaType?: string;
    ukAddressLine1?: string;
    ukAddressLine2?: string;
    ukTownOrCity?: string;
    ukPostcode?: string;
    mobileNumber?: string;
    email?: string;
  }): TravelInformationPage {
    if (expectedData.visaType) {
      cy.get('[name="visaCategory"]').should("have.value", expectedData.visaType);
    }
    if (expectedData.ukAddressLine1) {
      cy.get("#address-1-field").should("have.value", expectedData.ukAddressLine1);
    }
    if (expectedData.ukAddressLine2) {
      cy.get("#address-2-field").should("have.value", expectedData.ukAddressLine2);
    }
    if (expectedData.ukTownOrCity) {
      cy.get("#town-or-city-field").should("have.value", expectedData.ukTownOrCity);
    }
    if (expectedData.ukPostcode) {
      cy.get("#postcode-field").should("have.value", expectedData.ukPostcode);
    }
    if (expectedData.mobileNumber) {
      cy.get('[name="ukMobileNumber"]').should("have.value", expectedData.mobileNumber);
    }
    if (expectedData.email) {
      cy.get('[name="ukEmail"]').should("have.value", expectedData.email);
    }
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

  // Validate field errors - Updated with correct field IDs
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
      this.validateFieldError("visa-category", errors.visaType);
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

  // Verify redirection to summary page
  verifyRedirectionToSummaryPage(): TravelInformationPage {
    this.verifyUrlContains("/travel-summary");
    return this;
  }

  // Verify all page elements
  verifyAllPageElements(): TravelInformationPage {
    this.verifyPageLoaded();
    this.verifyFormSections();
    this.verifyFieldLabels();
    this.verifyVisaTypeOptions();
    this.verifySubmitButton();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(): TravelInformationPage {
    this.submitForm();
    this.verifyRedirectionToSummaryPage();
    return this;
  }

  // Complete form submission flow
  completeFormSubmission(formData: {
    visaType?: string; // Made optional
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): TravelInformationPage {
    this.fillCompleteForm(formData);
    this.submitAndVerifyRedirection();
    return this;
  }

  // Complete form submission with random visa and return the selected visa
  completeFormSubmissionWithRandomVisa(formData: {
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): Cypress.Chainable<string> {
    return this.fillCompleteFormWithRandomVisa(formData).then((selectedVisa) => {
      this.submitAndVerifyRedirection();
      return cy.wrap(selectedVisa);
    });
  }
}
