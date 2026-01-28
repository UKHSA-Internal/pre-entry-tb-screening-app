/**
 * ============================================================================
 * This holds all methods and selectors for the Applicant Contact Information Page
 * ============================================================================
 */

import { BasePage } from "../BasePageNew";

export class ContactInformationPage extends BasePage {
  // ============================================================================
  // SELECTORS - Centralized for easy maintenance
  // ============================================================================

  private readonly selectors = {
    // Page identifiers
    pageHeading: "h1.govuk-heading-l, h1.govuk-heading-xl, h1",
    sectionHeading: "h2.govuk-heading-m",
    homeAddressHint: "#home-address-hint",

    // Address line 1 field
    addressLine1: {
      container: "#address-1",
      input: '[data-testid="address-1"]',
      inputById: "#address-1-field",
      inputByName: 'input[name="applicantHomeAddress1"]',
      label: 'label[for="address-1-field"]',
      errorMessage: "#address-1 .govuk-error-message",
      errorContainer: "#address-1.govuk-form-group--error",
    },

    // Address line 2 field (optional)
    addressLine2: {
      container: "#address-2",
      input: '[data-testid="address-2"]',
      inputById: "#address-2-field",
      inputByName: 'input[name="applicantHomeAddress2"]',
      label: 'label[for="address-2-field"]',
      errorMessage: "#address-2 .govuk-error-message",
      errorContainer: "#address-2.govuk-form-group--error",
    },

    // Address line 3 field (optional)
    addressLine3: {
      container: "#address-3",
      input: '[data-testid="address-3"]',
      inputById: "#address-3-field",
      inputByName: 'input[name="applicantHomeAddress3"]',
      label: 'label[for="address-3-field"]',
      errorMessage: "#address-3 .govuk-error-message",
      errorContainer: "#address-3.govuk-form-group--error",
    },

    // Town/city field
    townOrCity: {
      container: "#town-or-city",
      input: '[data-testid="town-or-city"]',
      inputById: "#town-or-city-field",
      inputByName: 'input[name="townOrCity"]',
      label: 'label[for="town-or-city-field"]',
      errorMessage: "#town-or-city .govuk-error-message",
      errorContainer: "#town-or-city.govuk-form-group--error",
    },

    // Province/state field
    provinceOrState: {
      container: "#province-or-state",
      input: '[data-testid="province-or-state"]',
      inputById: "#province-or-state-field",
      inputByName: 'input[name="provinceOrState"]',
      label: 'label[for="province-or-state-field"]',
      errorMessage: "#province-or-state .govuk-error-message",
      errorContainer: "#province-or-state.govuk-form-group--error",
    },

    // Postal code field (optional)
    postcode: {
      container: "#postcode",
      input: '[data-testid="postcode"]',
      inputById: "#postcode-field",
      inputByName: 'input[name="postcode"]',
      label: 'label[for="postcode-field"]',
      errorMessage: "#postcode .govuk-error-message",
      errorContainer: "#postcode.govuk-form-group--error",
    },

    // Country dropdown
    addressCountry: {
      container: "#address-country",
      select: "#address-country-field",
      selectByName: 'select[name="country"]',
      label: 'label[for="address-country-field"]',
      errorMessage: "#address-country .govuk-error-message",
      errorContainer: "#address-country.govuk-form-group--error",
    },

    // Form submission
    submitButton: 'button[type="submit"]',
    continueButton: 'button[type="submit"]:contains("Continue")',

    // Error summary (GOV.UK Design System)
    errorSummary: {
      container: ".govuk-error-summary",
      title: ".govuk-error-summary__title",
      list: ".govuk-error-summary__list",
      listItem: ".govuk-error-summary__list li",
      link: ".govuk-error-summary__list a",
    },

    // GOV.UK header and navigation
    header: {
      skipLink: ".govuk-skip-link",
      govukLogo: ".govuk-header__logo",
      signOutLink: "#sign-out",
      serviceNavigation: ".govuk-service-navigation",
      serviceName: ".govuk-service-navigation__service-name",
    },

    // Phase banner
    phaseBanner: {
      container: ".govuk-phase-banner",
      tag: ".govuk-phase-banner__content__tag",
      text: ".govuk-phase-banner__text",
      feedbackLink: ".govuk-phase-banner__text a",
    },

    // Back link
    backLink: ".govuk-back-link",
  };

  // ============================================================================
  // CONSTRUCTOR
  // ============================================================================

  constructor() {
    super("/visa-applicant-contact-information");
  }

  // ============================================================================
  // PAGE VERIFICATION METHODS
  // ============================================================================

  /**
   * Verify the page has loaded by checking the main heading
   * @returns {ContactInformationPage} Returns this for method chaining
   */
  verifyPageLoaded(): ContactInformationPage {
    cy.get(this.selectors.pageHeading, { timeout: 10000 })
      .first()
      .should("be.visible")
      .and("contain", "Visa applicant contact information");
    return this;
  }

  /**
   * Verify the page URL matches the expected path
   * @returns {ContactInformationPage}
   */
  verifyPageUrl(): ContactInformationPage {
    cy.url().should("include", "/visa-applicant-contact-information");
    return this;
  }

  /**
   * Verify all required page elements are visible
   * @returns {ContactInformationPage}
   */
  verifyAllElementsVisible(): ContactInformationPage {
    cy.get(this.selectors.addressLine1.input).should("be.visible");
    cy.get(this.selectors.addressLine2.input).should("be.visible");
    cy.get(this.selectors.addressLine3.input).should("be.visible");
    cy.get(this.selectors.townOrCity.input).should("be.visible");
    cy.get(this.selectors.provinceOrState.input).should("be.visible");
    cy.get(this.selectors.postcode.input).should("be.visible");
    cy.get(this.selectors.addressCountry.select).should("be.visible");
    cy.get(this.selectors.submitButton).should("be.visible");
    return this;
  }

  /**
   * Verify home address hint text is visible
   * @returns {ContactInformationPage}
   */
  verifyHomeAddressHintVisible(): ContactInformationPage {
    cy.get(this.selectors.homeAddressHint)
      .should("be.visible")
      .and("contain.text", "Enter the visa applicant's address in their home country");
    return this;
  }

  // ============================================================================
  // ADDRESS LINE 1 FIELD METHODS
  // ============================================================================

  /**
   * Fill address line 1 field
   * @param {string} address - Address line 1
   * @returns {ContactInformationPage}
   */
  fillAddressLine1(address: string): ContactInformationPage {
    cy.get(this.selectors.addressLine1.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(address);
    return this;
  }

  /**
   * Verify address line 1 field is empty
   * @returns {ContactInformationPage}
   */
  verifyAddressLine1Empty(): ContactInformationPage {
    cy.get(this.selectors.addressLine1.input).should("have.value", "");
    return this;
  }

  /**
   * Verify address line 1 field contains expected value
   * @param {string} expectedAddress - Expected address value
   * @returns {ContactInformationPage}
   */
  verifyAddressLine1Value(expectedAddress: string): ContactInformationPage {
    cy.get(this.selectors.addressLine1.input).should("have.value", expectedAddress);
    return this;
  }

  /**
   * Get the current value of address line 1 field
   * @returns {Cypress.Chainable<string>}
   */
  getAddressLine1Value(): Cypress.Chainable<string> {
    return cy.get(this.selectors.addressLine1.input).invoke("val");
  }

  // ============================================================================
  // ADDRESS LINE 2 FIELD METHODS (OPTIONAL)
  // ============================================================================

  /**
   * Fill address line 2 field (optional)
   * @param {string} address - Address line 2
   * @returns {ContactInformationPage}
   */
  fillAddressLine2(address: string): ContactInformationPage {
    cy.get(this.selectors.addressLine2.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(address);
    return this;
  }

  /**
   * Verify address line 2 field is empty
   * @returns {ContactInformationPage}
   */
  verifyAddressLine2Empty(): ContactInformationPage {
    cy.get(this.selectors.addressLine2.input).should("have.value", "");
    return this;
  }

  /**
   * Verify address line 2 field contains expected value
   * @param {string} expectedAddress - Expected address value
   * @returns {ContactInformationPage}
   */
  verifyAddressLine2Value(expectedAddress: string): ContactInformationPage {
    cy.get(this.selectors.addressLine2.input).should("have.value", expectedAddress);
    return this;
  }

  /**
   * Get the current value of address line 2 field
   * @returns {Cypress.Chainable<string>}
   */
  getAddressLine2Value(): Cypress.Chainable<string> {
    return cy.get(this.selectors.addressLine2.input).invoke("val");
  }

  // ============================================================================
  // ADDRESS LINE 3 FIELD METHODS (OPTIONAL)
  // ============================================================================

  /**
   * Fill address line 3 field (optional)
   * @param {string} address - Address line 3
   * @returns {ContactInformationPage}
   */
  fillAddressLine3(address: string): ContactInformationPage {
    cy.get(this.selectors.addressLine3.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(address);
    return this;
  }

  /**
   * Verify address line 3 field is empty
   * @returns {ContactInformationPage}
   */
  verifyAddressLine3Empty(): ContactInformationPage {
    cy.get(this.selectors.addressLine3.input).should("have.value", "");
    return this;
  }

  /**
   * Verify address line 3 field contains expected value
   * @param {string} expectedAddress - Expected address value
   * @returns {ContactInformationPage}
   */
  verifyAddressLine3Value(expectedAddress: string): ContactInformationPage {
    cy.get(this.selectors.addressLine3.input).should("have.value", expectedAddress);
    return this;
  }

  /**
   * Get the current value of address line 3 field
   * @returns {Cypress.Chainable<string>}
   */
  getAddressLine3Value(): Cypress.Chainable<string> {
    return cy.get(this.selectors.addressLine3.input).invoke("val");
  }

  // ============================================================================
  // TOWN/CITY FIELD METHODS
  // ============================================================================

  /**
   * Fill town/city field
   * @param {string} townOrCity - Town or city name
   * @returns {ContactInformationPage}
   */
  fillTownOrCity(townOrCity: string): ContactInformationPage {
    cy.get(this.selectors.townOrCity.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(townOrCity);
    return this;
  }

  /**
   * Verify town/city field is empty
   * @returns {ContactInformationPage}
   */
  verifyTownOrCityEmpty(): ContactInformationPage {
    cy.get(this.selectors.townOrCity.input).should("have.value", "");
    return this;
  }

  /**
   * Verify town/city field contains expected value
   * @param {string} expectedTownOrCity - Expected town/city value
   * @returns {ContactInformationPage}
   */
  verifyTownOrCityValue(expectedTownOrCity: string): ContactInformationPage {
    cy.get(this.selectors.townOrCity.input).should("have.value", expectedTownOrCity);
    return this;
  }

  /**
   * Get the current value of town/city field
   * @returns {Cypress.Chainable<string>}
   */
  getTownOrCityValue(): Cypress.Chainable<string> {
    return cy.get(this.selectors.townOrCity.input).invoke("val");
  }

  // ============================================================================
  // PROVINCE/STATE FIELD METHODS
  // ============================================================================

  /**
   * Fill province/state field
   * @param {string} provinceOrState - Province or state name
   * @returns {ContactInformationPage}
   */
  fillProvinceOrState(provinceOrState: string): ContactInformationPage {
    cy.get(this.selectors.provinceOrState.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(provinceOrState);
    return this;
  }

  /**
   * Verify province/state field is empty
   * @returns {ContactInformationPage}
   */
  verifyProvinceOrStateEmpty(): ContactInformationPage {
    cy.get(this.selectors.provinceOrState.input).should("have.value", "");
    return this;
  }

  /**
   * Verify province/state field contains expected value
   * @param {string} expectedProvinceOrState - Expected province/state value
   * @returns {ContactInformationPage}
   */
  verifyProvinceOrStateValue(expectedProvinceOrState: string): ContactInformationPage {
    cy.get(this.selectors.provinceOrState.input).should("have.value", expectedProvinceOrState);
    return this;
  }

  /**
   * Get the current value of province/state field
   * @returns {Cypress.Chainable<string>}
   */
  getProvinceOrStateValue(): Cypress.Chainable<string> {
    return cy.get(this.selectors.provinceOrState.input).invoke("val");
  }

  // ============================================================================
  // POSTAL CODE FIELD METHODS (OPTIONAL)
  // ============================================================================

  /**
   * Fill postal code field (optional)
   * @param {string} postcode - Postal code
   * @returns {ContactInformationPage}
   */
  fillPostcode(postcode: string): ContactInformationPage {
    cy.get(this.selectors.postcode.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(postcode);
    return this;
  }

  /**
   * Verify postal code field is empty
   * @returns {ContactInformationPage}
   */
  verifyPostcodeEmpty(): ContactInformationPage {
    cy.get(this.selectors.postcode.input).should("have.value", "");
    return this;
  }

  /**
   * Verify postal code field contains expected value
   * @param {string} expectedPostcode - Expected postal code value
   * @returns {ContactInformationPage}
   */
  verifyPostcodeValue(expectedPostcode: string): ContactInformationPage {
    cy.get(this.selectors.postcode.input).should("have.value", expectedPostcode);
    return this;
  }

  /**
   * Get the current value of postal code field
   * @returns {Cypress.Chainable<string>}
   */
  getPostcodeValue(): Cypress.Chainable<string> {
    return cy.get(this.selectors.postcode.input).invoke("val");
  }

  // ============================================================================
  // COUNTRY FIELD METHODS
  // ============================================================================

  /**
   * Select country from dropdown
   * @param {string} country - Country name (e.g., "Afghanistan", "Albania")
   * @returns {ContactInformationPage}
   */
  selectCountry(country: string): ContactInformationPage {
    cy.get(this.selectors.addressCountry.select, { timeout: 10000 })
      .should("be.visible")
      .select(country);
    return this;
  }

  /**
   * Select country by country code (ISO 3166-1 alpha-3)
   * @param {string} countryCode - Three-letter country code (e.g., "AFG", "ALB")
   * @returns {ContactInformationPage}
   */
  selectCountryByCode(countryCode: string): ContactInformationPage {
    cy.get(this.selectors.addressCountry.select, { timeout: 10000 })
      .should("be.visible")
      .select(countryCode);
    return this;
  }

  /**
   * Verify country dropdown shows "Select country" placeholder
   * @returns {ContactInformationPage}
   */
  verifyCountryNotSelected(): ContactInformationPage {
    cy.get(this.selectors.addressCountry.select).should("have.value", "");
    return this;
  }

  /**
   * Verify expected country is selected
   * @param {string} expectedCountry - Expected country name or code
   * @returns {ContactInformationPage}
   */
  verifyCountrySelected(expectedCountry: string): ContactInformationPage {
    cy.get(this.selectors.addressCountry.select)
      .find("option:selected")
      .should("contain.text", expectedCountry);
    return this;
  }

  /**
   * Get the currently selected country value
   * @returns {Cypress.Chainable<string>}
   */
  getSelectedCountry(): Cypress.Chainable<string> {
    return cy.get(this.selectors.addressCountry.select).invoke("val");
  }

  // ============================================================================
  // COMPLETE FORM FILLING METHODS
  // ============================================================================

  /**
   * Fill the complete form with all address details
   * @param {object} data - Object containing all form data
   * @returns {ContactInformationPage}
   */
  fillCompleteForm(data: {
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    townOrCity: string;
    provinceOrState: string;
    postcode?: string;
    country: string;
  }): ContactInformationPage {
    this.fillAddressLine1(data.addressLine1);

    if (data.addressLine2) {
      this.fillAddressLine2(data.addressLine2);
    }

    if (data.addressLine3) {
      this.fillAddressLine3(data.addressLine3);
    }

    this.fillTownOrCity(data.townOrCity).fillProvinceOrState(data.provinceOrState);

    if (data.postcode) {
      this.fillPostcode(data.postcode);
    }

    this.selectCountry(data.country);

    return this;
  }

  /**
   * Fill only required fields (minimal valid form)
   * @param {string} addressLine1 - Address line 1
   * @param {string} townOrCity - Town or city
   * @param {string} provinceOrState - Province or state
   * @param {string} country - Country name or code
   * @returns {ContactInformationPage}
   */
  fillRequiredFields(
    addressLine1: string,
    townOrCity: string,
    provinceOrState: string,
    country: string,
  ): ContactInformationPage {
    this.fillAddressLine1(addressLine1)
      .fillTownOrCity(townOrCity)
      .fillProvinceOrState(provinceOrState)
      .selectCountry(country);
    return this;
  }

  /**
   * Fill complete address with all lines (including optional fields)
   * @param {string} addressLine1 - Address line 1
   * @param {string} addressLine2 - Address line 2
   * @param {string} addressLine3 - Address line 3
   * @param {string} townOrCity - Town or city
   * @param {string} provinceOrState - Province or state
   * @param {string} postcode - Postal code
   * @param {string} country - Country name or code
   * @returns {ContactInformationPage}
   */
  fillCompleteAddress(
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    townOrCity: string,
    provinceOrState: string,
    postcode: string,
    country: string,
  ): ContactInformationPage {
    this.fillAddressLine1(addressLine1)
      .fillAddressLine2(addressLine2)
      .fillAddressLine3(addressLine3)
      .fillTownOrCity(townOrCity)
      .fillProvinceOrState(provinceOrState)
      .fillPostcode(postcode)
      .selectCountry(country);
    return this;
  }

  // ============================================================================
  // FORM SUBMISSION METHODS
  // ============================================================================

  /**
   * Submit the form by clicking the button with specified text
   * @param {string} buttonText - Text on button (defaults to "Continue")
   * @returns {ContactInformationPage}
   */
  submitForm(buttonText: string = "Continue"): ContactInformationPage {
    cy.get(this.selectors.submitButton).contains(buttonText).should("be.visible").click();
    return this;
  }

  /**
   * Click the Continue button
   * @returns {ContactInformationPage}
   */
  clickContinue(): ContactInformationPage {
    return this.submitForm("Continue");
  }

  /**
   * Verify the Continue button is visible and enabled
   * @returns {ContactInformationPage}
   */
  verifyContinueButtonVisible(): ContactInformationPage {
    cy.get(this.selectors.submitButton).should("be.visible").and("not.be.disabled");
    return this;
  }

  // ============================================================================
  // ERROR VALIDATION METHODS - ERROR SUMMARY
  // ============================================================================

  /**
   * Verify error summary box is visible (appears at top of page)
   * @returns {ContactInformationPage}
   */
  validateErrorSummaryVisible(): ContactInformationPage {
    cy.get(this.selectors.errorSummary.container).should("be.visible");
    return this;
  }

  /**
   * Verify error summary is not visible
   * @returns {ContactInformationPage}
   */
  validateErrorSummaryNotVisible(): ContactInformationPage {
    cy.get(this.selectors.errorSummary.container).should("not.exist");
    return this;
  }

  /**
   * Verify error summary contains specific error text
   * @param {string} text - Error text to check for
   * @returns {ContactInformationPage}
   */
  validateErrorContainsText(text: string): ContactInformationPage {
    cy.get(this.selectors.errorSummary.list).should("contain.text", text);
    return this;
  }

  /**
   * Verify error summary contains multiple expected errors
   * @param {string[]} expectedErrors - Array of error messages
   * @returns {ContactInformationPage}
   */
  validateErrorSummary(expectedErrors: string[]): ContactInformationPage {
    this.validateErrorSummaryVisible();
    expectedErrors.forEach((errorText) => {
      this.validateErrorContainsText(errorText);
    });
    return this;
  }

  /**
   * Get count of errors in error summary
   * @returns {Cypress.Chainable<number>}
   */
  getErrorCount(): Cypress.Chainable<number> {
    return cy.get(this.selectors.errorSummary.listItem).its("length");
  }

  /**
   * Click on error link in error summary to focus on field
   * @param {string} errorText - Text of error to click
   * @returns {ContactInformationPage}
   */
  clickErrorLink(errorText: string): ContactInformationPage {
    cy.get(this.selectors.errorSummary.link).contains(errorText).click();
    return this;
  }

  // ============================================================================
  // ERROR VALIDATION METHODS - INDIVIDUAL FIELD ERRORS
  // ============================================================================

  /**
   * Validate address line 1 field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {ContactInformationPage}
   */
  validateAddressLine1FieldError(expectedMessage?: string): ContactInformationPage {
    cy.get(this.selectors.addressLine1.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.addressLine1.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.addressLine1.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate address line 1 field has no errors
   * @returns {ContactInformationPage}
   */
  validateAddressLine1NoError(): ContactInformationPage {
    cy.get(this.selectors.addressLine1.container).should(
      "not.have.class",
      "govuk-form-group--error",
    );
    cy.get(this.selectors.addressLine1.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate town/city field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {ContactInformationPage}
   */
  validateTownOrCityFieldError(expectedMessage?: string): ContactInformationPage {
    cy.get(this.selectors.townOrCity.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.townOrCity.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.townOrCity.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate town/city field has no errors
   * @returns {ContactInformationPage}
   */
  validateTownOrCityNoError(): ContactInformationPage {
    cy.get(this.selectors.townOrCity.container).should("not.have.class", "govuk-form-group--error");
    cy.get(this.selectors.townOrCity.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate province/state field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {ContactInformationPage}
   */
  validateProvinceOrStateFieldError(expectedMessage?: string): ContactInformationPage {
    cy.get(this.selectors.provinceOrState.container).should(
      "have.class",
      "govuk-form-group--error",
    );
    cy.get(this.selectors.provinceOrState.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.provinceOrState.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate province/state field has no errors
   * @returns {ContactInformationPage}
   */
  validateProvinceOrStateNoError(): ContactInformationPage {
    cy.get(this.selectors.provinceOrState.container).should(
      "not.have.class",
      "govuk-form-group--error",
    );
    cy.get(this.selectors.provinceOrState.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate country field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {ContactInformationPage}
   */
  validateCountryFieldError(expectedMessage?: string): ContactInformationPage {
    cy.get(this.selectors.addressCountry.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.addressCountry.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.addressCountry.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate country field has no errors
   * @returns {ContactInformationPage}
   */
  validateCountryNoError(): ContactInformationPage {
    cy.get(this.selectors.addressCountry.container).should(
      "not.have.class",
      "govuk-form-group--error",
    );
    cy.get(this.selectors.addressCountry.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate multiple form field errors at once
   * @param {object} expectedErrorMessages - Object with field error messages
   * @returns {ContactInformationPage}
   */
  validateFormErrors(expectedErrorMessages: {
    addressLine1?: string;
    townOrCity?: string;
    provinceOrState?: string;
    country?: string;
  }): ContactInformationPage {
    if (expectedErrorMessages.addressLine1) {
      this.validateAddressLine1FieldError(expectedErrorMessages.addressLine1);
    }
    if (expectedErrorMessages.townOrCity) {
      this.validateTownOrCityFieldError(expectedErrorMessages.townOrCity);
    }
    if (expectedErrorMessages.provinceOrState) {
      this.validateProvinceOrStateFieldError(expectedErrorMessages.provinceOrState);
    }
    if (expectedErrorMessages.country) {
      this.validateCountryFieldError(expectedErrorMessages.country);
    }
    return this;
  }

  /**
   * Validate that no field errors are present
   * @returns {ContactInformationPage}
   */
  validateNoFieldErrors(): ContactInformationPage {
    this.validateAddressLine1NoError()
      .validateTownOrCityNoError()
      .validateProvinceOrStateNoError()
      .validateCountryNoError();
    return this;
  }

  // ============================================================================
  // NAVIGATION METHODS
  // ============================================================================

  /**
   * Click the Back link
   * @returns {ContactInformationPage}
   */
  clickBackLink(): ContactInformationPage {
    cy.get(this.selectors.backLink).click();
    return this;
  }

  /**
   * Verify Back link is visible and has correct text
   * @returns {ContactInformationPage}
   */
  verifyBackLinkVisible(): ContactInformationPage {
    cy.get(this.selectors.backLink).should("be.visible").and("contain.text", "Back");
    return this;
  }

  /**
   * Click Sign out link in header
   * @returns {ContactInformationPage}
   */
  clickSignOut(): ContactInformationPage {
    cy.get(this.selectors.header.signOutLink).click();
    return this;
  }

  /**
   * Get the current page URL
   * @returns {Cypress.Chainable<string>}
   */
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // ============================================================================
  // ACCESSIBILITY AND GOV.UK DESIGN SYSTEM VERIFICATION
  // ============================================================================

  /**
   * Verify phase banner is visible with correct content
   * @returns {ContactInformationPage}
   */
  verifyPhaseBannerVisible(): ContactInformationPage {
    cy.get(this.selectors.phaseBanner.container).should("be.visible");
    cy.get(this.selectors.phaseBanner.tag).should("contain.text", "BETA");
    return this;
  }

  /**
   * Verify skip link is present for accessibility
   * @returns {ContactInformationPage}
   */
  verifySkipLinkPresent(): ContactInformationPage {
    cy.get(this.selectors.header.skipLink)
      .should("exist")
      .and("have.attr", "href", "#main-content");
    return this;
  }

  /**
   * Verify all form labels are associated with inputs
   * @returns {ContactInformationPage}
   */
  verifyFormLabelsAssociated(): ContactInformationPage {
    // Address line 1
    cy.get(this.selectors.addressLine1.label).should("have.attr", "for", "address-1-field");

    // Address line 2
    cy.get(this.selectors.addressLine2.label).should("have.attr", "for", "address-2-field");

    // Address line 3
    cy.get(this.selectors.addressLine3.label).should("have.attr", "for", "address-3-field");

    // Town/city
    cy.get(this.selectors.townOrCity.label).should("have.attr", "for", "town-or-city-field");

    // Province/state
    cy.get(this.selectors.provinceOrState.label).should(
      "have.attr",
      "for",
      "province-or-state-field",
    );

    // Postal code
    cy.get(this.selectors.postcode.label).should("have.attr", "for", "postcode-field");

    // Country
    cy.get(this.selectors.addressCountry.label).should("have.attr", "for", "address-country-field");

    return this;
  }
}
