// This holds all the fields on the Travel Information Page
import { BasePage } from "../BasePage";

export class TravelInformationPage extends BasePage {
  constructor() {
    super("/visa-applicant-proposed-uk-address");
  }

  // Page verification
  verifyPageLoaded(): TravelInformationPage {
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.contains("h1", "Visa applicant's proposed UK address").should("be.visible");
    return this;
  }

  // Verify page heading
  verifyPageHeading(): TravelInformationPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Visa applicant's proposed UK address");
    return this;
  }

  // Verify form sections are displayed
  verifyFormSections(): TravelInformationPage {
    cy.get("#address-1").should("be.visible");
    cy.get("#address-2").should("be.visible");
    cy.get("#address-3").should("be.visible");
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
    cy.contains("label", "Address line 3 (optional)").should("be.visible");
    cy.contains("label", "Town/city (optional)").should("be.visible");
    cy.contains("label", "Postcode (optional)").should("be.visible");
    cy.contains("h2", "UK phone number (optional)").should("be.visible");
    cy.contains("h2", "UK email address (optional)").should("be.visible");
    return this;
  }

  // Fill Address Line 1
  fillAddressLine1(address: string): TravelInformationPage {
    cy.get("#address-1-field").clear().type(address);
    return this;
  }

  // Fill Address Line 2
  fillAddressLine2(address: string): TravelInformationPage {
    cy.get("#address-2-field").clear().type(address);
    return this;
  }

  // Fill Address Line 3
  fillAddressLine3(address: string): TravelInformationPage {
    cy.get("#address-3-field").clear().type(address);
    return this;
  }

  // Fill Town or City
  fillTownOrCity(townOrCity: string): TravelInformationPage {
    cy.get("#town-or-city-field").clear().type(townOrCity);
    return this;
  }

  // Fill Postcode
  fillPostcode(postcode: string): TravelInformationPage {
    cy.get("#postcode-field").clear().type(postcode);
    return this;
  }

  // Fill Mobile Number
  fillMobileNumber(mobileNumber: string): TravelInformationPage {
    cy.get('[name="ukMobileNumber"]').clear().type(mobileNumber);
    return this;
  }

  // Fill Email
  fillEmail(email: string): TravelInformationPage {
    cy.get('[name="ukEmail"]').clear().type(email);
    return this;
  }

  // Submit Form
  submitForm(): TravelInformationPage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Verify submit button
  verifySubmitButton(): TravelInformationPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Continue");
    return this;
  }

  // Verify continue button
  verifyContinueButton(): TravelInformationPage {
    cy.get('button[type="submit"]')
      .should("contain", "Continue")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify all fields are empty initially
  verifyAllFieldsEmpty(): TravelInformationPage {
    cy.get("#address-1-field").should("have.value", "");
    cy.get("#address-2-field").should("have.value", "");
    cy.get("#address-3-field").should("have.value", "");
    cy.get("#town-or-city-field").should("have.value", "");
    cy.get("#postcode-field").should("have.value", "");
    cy.get('[name="ukMobileNumber"]').should("have.value", "");
    cy.get('[name="ukEmail"]').should("have.value", "");
    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(expectedData: {
    ukAddressLine1?: string;
    ukAddressLine2?: string;
    ukAddressLine3?: string;
    ukTownOrCity?: string;
    ukPostcode?: string;
    mobileNumber?: string;
    email?: string;
  }): TravelInformationPage {
    if (expectedData.ukAddressLine1) {
      cy.get("#address-1-field").should("have.value", expectedData.ukAddressLine1);
    }
    if (expectedData.ukAddressLine2) {
      cy.get("#address-2-field").should("have.value", expectedData.ukAddressLine2);
    }
    if (expectedData.ukAddressLine3) {
      cy.get("#address-3-field").should("have.value", expectedData.ukAddressLine3);
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

  // Verify back link
  verifyBackLink(): TravelInformationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/proposed-visa-category");
    return this;
  }

  // Click back link
  clickBackLink(): TravelInformationPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TravelInformationPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): TravelInformationPage {
    cy.get(".govuk-phase-banner").should("exist");
    cy.get(".govuk-tag").should("contain", "BETA");
    cy.get(".govuk-phase-banner__text")
      .should("contain", "This is a new service")
      .and("contain", "give your feedback");
    return this;
  }

  // Verify sign out link
  verifySignOutLink(): TravelInformationPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out")
      .and("contain", "Sign out");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): TravelInformationPage {
    cy.get(".govuk-footer").should("exist");
    cy.get(".govuk-footer__link")
      .contains("Privacy")
      .should("have.attr", "href", "/privacy-notice");
    cy.get(".govuk-footer__link")
      .contains("Accessibility statement")
      .should("have.attr", "href", "/accessibility-statement");
    return this;
  }

  // Verify crown copyright
  verifyCrownCopyright(): TravelInformationPage {
    cy.get(".govuk-footer").should("contain", "Â© Crown copyright");
    return this;
  }

  // Verify Open Government Licence
  verifyOpenGovernmentLicence(): TravelInformationPage {
    cy.get(".govuk-footer__licence-description")
      .should("contain", "Open Government Licence v3.0")
      .find("a")
      .should(
        "have.attr",
        "href",
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      );
    return this;
  }

  // Fill all required fields with valid data
  fillCompleteForm(details: {
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukAddressLine3?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): TravelInformationPage {
    this.fillAddressLine1(details.ukAddressLine1);

    if (details.ukAddressLine2) {
      this.fillAddressLine2(details.ukAddressLine2);
    }

    if (details.ukAddressLine3) {
      this.fillAddressLine3(details.ukAddressLine3);
    }

    this.fillTownOrCity(details.ukTownOrCity);
    this.fillPostcode(details.ukPostcode);
    this.fillMobileNumber(details.mobileNumber);
    this.fillEmail(details.email);

    return this;
  }

  // Validate error summary is visible
  validateErrorSummaryVisible(): TravelInformationPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  // Validate error contains specific text
  validateErrorMessage(expectedText: string): TravelInformationPage {
    this.validateErrorSummaryVisible();
    cy.get(".govuk-error-summary__list").should("contain.text", expectedText);
    return this;
  }

  // Validate error summary with multiple errors
  validateErrorSummary(expectedErrors: string[]): TravelInformationPage {
    this.validateErrorSummaryVisible();

    expectedErrors.forEach((errorText) => {
      cy.get(".govuk-error-summary__list").should("contain.text", errorText);
    });

    return this;
  }

  // Validate Address Line 1 field error
  validateAddressLine1Error(errorMessage?: string): TravelInformationPage {
    this.validateFieldError("address-1", errorMessage);
    return this;
  }

  // Validate Address Line 3 field error
  validateAddressLine3Error(errorMessage?: string): TravelInformationPage {
    this.validateFieldError("address-3", errorMessage);
    return this;
  }

  // Validate Town or City field error
  validateTownOrCityError(errorMessage?: string): TravelInformationPage {
    this.validateFieldError("town-or-city", errorMessage);
    return this;
  }

  // Validate Postcode field error
  validatePostcodeError(errorMessage?: string): TravelInformationPage {
    this.validateFieldError("postcode", errorMessage);
    return this;
  }

  // Validate Mobile Number field error
  validateMobileNumberError(errorMessage?: string): TravelInformationPage {
    this.validateFieldError("mobile-number", errorMessage);
    return this;
  }

  // Validate Email field error
  validateEmailError(errorMessage?: string): TravelInformationPage {
    this.validateFieldError("email", errorMessage);
    return this;
  }

  // Comprehensive validation method for multiple fields
  validateFormErrors(errors: {
    ukAddressLine1?: string;
    ukAddressLine3?: string;
    ukTownOrCity?: string;
    ukPostcode?: string;
    mobileNumber?: string;
    email?: string;
  }): TravelInformationPage {
    if (errors.ukAddressLine1) {
      this.validateAddressLine1Error(errors.ukAddressLine1);
    }
    if (errors.ukAddressLine3) {
      this.validateAddressLine3Error(errors.ukAddressLine3);
    }
    if (errors.ukTownOrCity) {
      this.validateTownOrCityError(errors.ukTownOrCity);
    }
    if (errors.ukPostcode) {
      this.validatePostcodeError(errors.ukPostcode);
    }
    if (errors.mobileNumber) {
      this.validateMobileNumberError(errors.mobileNumber);
    }
    if (errors.email) {
      this.validateEmailError(errors.email);
    }
    return this;
  }

  // Verify redirection to check travel information page
  verifyRedirectionToCheckPage(): TravelInformationPage {
    cy.url().should("include", "/check-travel-information");
    return this;
  }

  // Verify complete page structure
  verifyPageStructure(): TravelInformationPage {
    this.verifyPageLoaded();
    this.verifyPageHeading();
    this.verifyFormSections();
    this.verifyFieldLabels();
    this.verifySubmitButton();
    this.verifyBackLink();
    return this;
  }

  // Verify all page elements
  verifyAllPageElements(): TravelInformationPage {
    this.verifyPageStructure();
    this.verifyBetaBanner();
    this.verifySignOutLink();
    this.verifyServiceName();
    this.verifyFooterLinks();
    this.verifyCrownCopyright();
    this.verifyOpenGovernmentLicence();
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(): TravelInformationPage {
    this.submitForm();
    this.verifyRedirectionToCheckPage();
    return this;
  }

  // Complete form submission flow
  completeFormSubmission(formData: {
    ukAddressLine1: string;
    ukAddressLine2?: string;
    ukAddressLine3?: string;
    ukTownOrCity: string;
    ukPostcode: string;
    mobileNumber: string;
    email: string;
  }): TravelInformationPage {
    this.fillCompleteForm(formData);
    this.submitAndVerifyRedirection();
    return this;
  }

  // Get current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Get field value
  getFieldValue(fieldId: string): Cypress.Chainable<string> {
    return cy.get(`#${fieldId}-field`).invoke("val");
  }

  // Verify form is submitted
  verifyFormSubmitted(): TravelInformationPage {
    cy.url().should("not.include", "/visa-applicant-proposed-uk-address");
    return this;
  }
}
