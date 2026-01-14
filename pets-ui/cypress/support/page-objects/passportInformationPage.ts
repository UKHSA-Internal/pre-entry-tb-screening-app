/**
 * ============================================================================
 * PASSPORT INFORMATION PAGE - PAGE OBJECT MODEL
 * ============================================================================
 */
import { BasePage } from "../BasePageNew";

export class PassportInformationPage extends BasePage {
  // ============================================================================
  // SELECTORS - Centralized for easy maintenance
  // ============================================================================

  private readonly selectors = {
    // Page identifiers
    pageHeading: "h1.govuk-heading-l, h1.govuk-heading-xl, h1",

    // Passport number field
    passportNumber: {
      container: "#passport-number",
      input: '[data-testid="passport-number"]',
      inputByName: 'input[name="passportNumber"]',
      label: "#passport-number-field",
      hint: "#passport-number-hint",
      errorMessage: "#passport-number .govuk-error-message",
      errorContainer: "#passport-number.govuk-form-group--error",
    },

    // Country of issue dropdown
    countryOfIssue: {
      container: "#country-of-issue",
      select: 'select[name="countryOfIssue"]',
      label: "#country-of-issue-field",
      hint: "#country-of-issue-hint",
      errorMessage: "#country-of-issue .govuk-error-message",
      errorContainer: "#country-of-issue.govuk-form-group--error",
    },

    // Passport issue date fields
    issueDate: {
      container: "#passport-issue-date",
      fieldset: "#passport-issue-date fieldset",
      legend: "#passport-issue-date .govuk-fieldset__legend h2",
      hint: "#passport-issue-date-hint",
      dayInput: "#passport-issue-date-day",
      monthInput: "#passport-issue-date-month",
      yearInput: "#passport-issue-date-year",
      dayInputAlt: '[data-testid="passport-issue-date-day"]',
      monthInputAlt: '[data-testid="passport-issue-date-month"]',
      yearInputAlt: '[data-testid="passport-issue-date-year"]',
      errorMessage: "#passport-issue-date .govuk-error-message",
      errorContainer: "#passport-issue-date.govuk-form-group--error",
    },

    // Passport expiry date fields
    expiryDate: {
      container: "#passport-expiry-date",
      fieldset: "#passport-expiry-date fieldset",
      legend: "#passport-expiry-date .govuk-fieldset__legend h2",
      hint: "#passport-expiry-date-hint",
      dayInput: "#passport-expiry-date-day",
      monthInput: "#passport-expiry-date-month",
      yearInput: "#passport-expiry-date-year",
      dayInputAlt: '[data-testid="passport-expiry-date-day"]',
      monthInputAlt: '[data-testid="passport-expiry-date-month"]',
      yearInputAlt: '[data-testid="passport-expiry-date-year"]',
      errorMessage: "#passport-expiry-date .govuk-error-message",
      errorContainer: "#passport-expiry-date.govuk-form-group--error",
    },

    // Form submission
    submitButton: 'button[type="submit"]',
    continueButton: 'button[type="submit"]:contains("Continue")',

    // Error summary (GDS standard)
    errorSummary: {
      container: ".govuk-error-summary",
      title: ".govuk-error-summary__title",
      list: ".govuk-error-summary__list",
      listItem: ".govuk-error-summary__list li",
      link: ".govuk-error-summary__list a",
    },

    // GDS standard header and navigation
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
    super("/visa-applicant-passport-information");
  }

  // ============================================================================
  // PAGE VERIFICATION METHODS
  // ============================================================================

  /**
   * Verify the page has loaded by checking the main heading
   * @returns {PassportInformationPage} Returns this for method chaining
   */
  verifyPageLoaded(): PassportInformationPage {
    cy.get(this.selectors.pageHeading, { timeout: 10000 })
      .first()
      .should("be.visible")
      .and("contain", "Visa applicant passport information");
    return this;
  }

  /**
   * Verify the page URL matches the expected path
   * @returns {PassportInformationPage}
   */
  verifyPageUrl(): PassportInformationPage {
    cy.url().should("include", "/visa-applicant-passport-information");
    return this;
  }

  /**
   * Verify all required page elements are visible
   * @returns {PassportInformationPage}
   */
  verifyAllElementsVisible(): PassportInformationPage {
    cy.get(this.selectors.passportNumber.input).should("be.visible");
    cy.get(this.selectors.countryOfIssue.select).should("be.visible");
    cy.get(this.selectors.issueDate.dayInput).should("be.visible");
    cy.get(this.selectors.issueDate.monthInput).should("be.visible");
    cy.get(this.selectors.issueDate.yearInput).should("be.visible");
    cy.get(this.selectors.expiryDate.dayInput).should("be.visible");
    cy.get(this.selectors.expiryDate.monthInput).should("be.visible");
    cy.get(this.selectors.expiryDate.yearInput).should("be.visible");
    cy.get(this.selectors.submitButton).should("be.visible");
    return this;
  }

  // ============================================================================
  // PASSPORT NUMBER FIELD METHODS
  // ============================================================================

  /**
   * Fill the passport number field
   * @param {string} passportNumber - The passport number
   * @returns {PassportInformationPage}
   */
  fillPassportNumber(passportNumber: string): PassportInformationPage {
    cy.get(this.selectors.passportNumber.input, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(passportNumber);
    return this;
  }

  /**
   * Verify passport number field is empty
   * @returns {PassportInformationPage}
   */
  verifyPassportNumberEmpty(): PassportInformationPage {
    cy.get(this.selectors.passportNumber.input).should("have.value", "");
    return this;
  }

  /**
   * Verify passport number field contains expected value
   * @param {string} expectedNumber - Expected passport number
   * @returns {PassportInformationPage}
   */
  verifyPassportNumberValue(expectedNumber: string): PassportInformationPage {
    cy.get(this.selectors.passportNumber.input).should("have.value", expectedNumber);
    return this;
  }

  /**
   * Get the current value of the passport number field
   * @returns {Cypress.Chainable<string>}
   */
  getPassportNumberValue(): Cypress.Chainable<string> {
    return cy.get(this.selectors.passportNumber.input).invoke("val");
  }

  // ============================================================================
  // COUNTRY OF ISSUE METHODS
  // ============================================================================

  /**
   * Select country of issue from dropdown
   * @param {string} country - Country name (e.g., "Afghanistan", "Albania")
   * @returns {PassportInformationPage}
   */
  selectCountryOfIssue(country: string): PassportInformationPage {
    cy.get(this.selectors.countryOfIssue.select, { timeout: 10000 })
      .should("be.visible")
      .select(country);
    return this;
  }

  /**
   * Select country of issue by country code (ISO 3166-1 alpha-3)
   * @param {string} countryCode - Three-letter country code (e.g., "AFG", "ALB")
   * @returns {PassportInformationPage}
   */
  selectCountryOfIssueByCode(countryCode: string): PassportInformationPage {
    cy.get(this.selectors.countryOfIssue.select, { timeout: 10000 })
      .should("be.visible")
      .select(countryCode);
    return this;
  }

  /**
   * Verify country of issue dropdown shows "Select country" placeholder
   * @returns {PassportInformationPage}
   */
  verifyCountryOfIssueNotSelected(): PassportInformationPage {
    cy.get(this.selectors.countryOfIssue.select).should("have.value", "");
    return this;
  }

  /**
   * Verify expected country of issue is selected
   * @param {string} expectedCountry - Expected country name or code
   * @returns {PassportInformationPage}
   */
  verifyCountryOfIssueSelected(expectedCountry: string): PassportInformationPage {
    cy.get(this.selectors.countryOfIssue.select)
      .find("option:selected")
      .should("contain.text", expectedCountry);
    return this;
  }

  /**
   * Get the currently selected country of issue value
   * @returns {Cypress.Chainable<string>}
   */
  getSelectedCountryOfIssue(): Cypress.Chainable<string> {
    return cy.get(this.selectors.countryOfIssue.select).invoke("val");
  }

  // ============================================================================
  // PASSPORT ISSUE DATE METHODS
  // ============================================================================

  /**
   * Fill passport issue date fields with individual day, month, year values
   * @param {string} day - Day (1-31)
   * @param {string} month - Month (1-12)
   * @param {string} year - Year (YYYY)
   * @returns {PassportInformationPage}
   */
  fillIssueDate(day: string, month: string, year: string): PassportInformationPage {
    cy.get(this.selectors.issueDate.dayInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(day);

    cy.get(this.selectors.issueDate.monthInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(month);

    cy.get(this.selectors.issueDate.yearInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(year);

    return this;
  }

  /**
   * Fill issue date with a date object
   * @param {Date} date - Date object for issue date
   * @returns {PassportInformationPage}
   */
  fillIssueDateFromDate(date: Date): PassportInformationPage {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    return this.fillIssueDate(day, month, year);
  }

  /**
   * Fill issue date with years ago from today
   * @param {number} yearsAgo - Number of years ago from today
   * @returns {PassportInformationPage}
   */
  fillIssueDateYearsAgo(yearsAgo: number): PassportInformationPage {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    return this.fillIssueDateFromDate(date);
  }

  /**
   * Verify issue date fields are empty
   * @returns {PassportInformationPage}
   */
  verifyIssueDateEmpty(): PassportInformationPage {
    cy.get(this.selectors.issueDate.dayInput).should("have.value", "");
    cy.get(this.selectors.issueDate.monthInput).should("have.value", "");
    cy.get(this.selectors.issueDate.yearInput).should("have.value", "");
    return this;
  }

  /**
   * Verify issue date fields contain expected values
   * @param {string} day - Expected day
   * @param {string} month - Expected month
   * @param {string} year - Expected year
   * @returns {PassportInformationPage}
   */
  verifyIssueDateValues(day: string, month: string, year: string): PassportInformationPage {
    cy.get(this.selectors.issueDate.dayInput).should("have.value", day);
    cy.get(this.selectors.issueDate.monthInput).should("have.value", month);
    cy.get(this.selectors.issueDate.yearInput).should("have.value", year);
    return this;
  }

  /**
   * Get the current issue date values
   * @returns {Cypress.Chainable<{day: string, month: string, year: string}>}
   */
  getIssueDateValues(): Cypress.Chainable<{ day: string; month: string; year: string }> {
    return cy
      .get(this.selectors.issueDate.dayInput)
      .invoke("val")
      .then((day) => {
        return cy
          .get(this.selectors.issueDate.monthInput)
          .invoke("val")
          .then((month) => {
            return cy
              .get(this.selectors.issueDate.yearInput)
              .invoke("val")
              .then((year) => {
                return { day: String(day), month: String(month), year: String(year) };
              });
          });
      });
  }

  // ============================================================================
  // PASSPORT EXPIRY DATE METHODS
  // ============================================================================

  /**
   * Fill passport expiry date fields with individual day, month, year values
   * @param {string} day - Day (1-31)
   * @param {string} month - Month (1-12)
   * @param {string} year - Year (YYYY)
   * @returns {PassportInformationPage}
   */
  fillExpiryDate(day: string, month: string, year: string): PassportInformationPage {
    cy.get(this.selectors.expiryDate.dayInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(day);

    cy.get(this.selectors.expiryDate.monthInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(month);

    cy.get(this.selectors.expiryDate.yearInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(year);

    return this;
  }

  /**
   * Fill expiry date with a date object
   * @param {Date} date - Date object for expiry date
   * @returns {PassportInformationPage}
   */
  fillExpiryDateFromDate(date: Date): PassportInformationPage {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    return this.fillExpiryDate(day, month, year);
  }

  /**
   * Fill expiry date with years from today
   * @param {number} yearsFromNow - Number of years from today
   * @returns {PassportInformationPage}
   */
  fillExpiryDateYearsFromNow(yearsFromNow: number): PassportInformationPage {
    const date = new Date();
    date.setFullYear(date.getFullYear() + yearsFromNow);
    return this.fillExpiryDateFromDate(date);
  }

  /**
   * Verify expiry date fields are empty
   * @returns {PassportInformationPage}
   */
  verifyExpiryDateEmpty(): PassportInformationPage {
    cy.get(this.selectors.expiryDate.dayInput).should("have.value", "");
    cy.get(this.selectors.expiryDate.monthInput).should("have.value", "");
    cy.get(this.selectors.expiryDate.yearInput).should("have.value", "");
    return this;
  }

  /**
   * Verify expiry date fields contain expected values
   * @param {string} day - Expected day
   * @param {string} month - Expected month
   * @param {string} year - Expected year
   * @returns {PassportInformationPage}
   */
  verifyExpiryDateValues(day: string, month: string, year: string): PassportInformationPage {
    cy.get(this.selectors.expiryDate.dayInput).should("have.value", day);
    cy.get(this.selectors.expiryDate.monthInput).should("have.value", month);
    cy.get(this.selectors.expiryDate.yearInput).should("have.value", year);
    return this;
  }

  /**
   * Get the current expiry date values
   * @returns {Cypress.Chainable<{day: string, month: string, year: string}>}
   */
  getExpiryDateValues(): Cypress.Chainable<{ day: string; month: string; year: string }> {
    return cy
      .get(this.selectors.expiryDate.dayInput)
      .invoke("val")
      .then((day) => {
        return cy
          .get(this.selectors.expiryDate.monthInput)
          .invoke("val")
          .then((month) => {
            return cy
              .get(this.selectors.expiryDate.yearInput)
              .invoke("val")
              .then((year) => {
                return { day: String(day), month: String(month), year: String(year) };
              });
          });
      });
  }

  // ============================================================================
  // COMPLETE FORM FILLING METHODS
  // ============================================================================

  /**
   * Fill the complete form with all passport details
   * @param {object} data - Object containing all form data
   * @returns {PassportInformationPage}
   */
  fillCompleteForm(data: {
    passportNumber: string;
    countryOfIssue: string;
    issueDate: { day: string; month: string; year: string };
    expiryDate: { day: string; month: string; year: string };
  }): PassportInformationPage {
    this.fillPassportNumber(data.passportNumber)
      .selectCountryOfIssue(data.countryOfIssue)
      .fillIssueDate(data.issueDate.day, data.issueDate.month, data.issueDate.year)
      .fillExpiryDate(data.expiryDate.day, data.expiryDate.month, data.expiryDate.year);
    return this;
  }

  /**
   * Fill form with typical valid passport (issued 5 years ago, expires in 5 years)
   * @param {string} passportNumber - Passport number
   * @param {string} countryOfIssue - Country of issue (name or code)
   * @returns {PassportInformationPage}
   */
  fillTypicalValidPassport(
    passportNumber: string,
    countryOfIssue: string,
  ): PassportInformationPage {
    this.fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryOfIssue)
      .fillIssueDateYearsAgo(5)
      .fillExpiryDateYearsFromNow(5);
    return this;
  }

  /**
   * Fill form with recently issued passport (issued 1 month ago, expires in 10 years)
   * @param {string} passportNumber - Passport number
   * @param {string} countryOfIssue - Country of issue
   * @returns {PassportInformationPage}
   */
  fillRecentlyIssuedPassport(
    passportNumber: string,
    countryOfIssue: string,
  ): PassportInformationPage {
    const issueDate = new Date();
    issueDate.setMonth(issueDate.getMonth() - 1);

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10);

    this.fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryOfIssue)
      .fillIssueDateFromDate(issueDate)
      .fillExpiryDateFromDate(expiryDate);
    return this;
  }

  /**
   * Fill form with soon-to-expire passport (issued 9 years ago, expires in 1 year)
   * @param {string} passportNumber - Passport number
   * @param {string} countryOfIssue - Country of issue
   * @returns {PassportInformationPage}
   */
  fillSoonToExpirePassport(
    passportNumber: string,
    countryOfIssue: string,
  ): PassportInformationPage {
    this.fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryOfIssue)
      .fillIssueDateYearsAgo(9)
      .fillExpiryDateYearsFromNow(1);
    return this;
  }

  // ============================================================================
  // FORM SUBMISSION METHODS
  // ============================================================================

  /**
   * Submit the form by clicking the button with specified text
   * @param {string} buttonText - Text on button (defaults to "Continue")
   * @returns {PassportInformationPage}
   */
  submitForm(buttonText: string = "Continue"): PassportInformationPage {
    cy.get(this.selectors.submitButton).contains(buttonText).should("be.visible").click();
    return this;
  }

  /**
   * Click the Continue button
   * @returns {PassportInformationPage}
   */
  clickContinue(): PassportInformationPage {
    return this.submitForm("Continue");
  }

  /**
   * Verify the Continue button is visible and enabled
   * @returns {PassportInformationPage}
   */
  verifyContinueButtonVisible(): PassportInformationPage {
    cy.get(this.selectors.submitButton).should("be.visible").and("not.be.disabled");
    return this;
  }

  // ============================================================================
  // ERROR VALIDATION METHODS - ERROR SUMMARY
  // ============================================================================

  /**
   * Verify error summary box is visible (appears at top of page)
   * @returns {PassportInformationPage}
   */
  validateErrorSummaryVisible(): PassportInformationPage {
    cy.get(this.selectors.errorSummary.container).should("be.visible");
    return this;
  }

  /**
   * Verify error summary is not visible
   * @returns {PassportInformationPage}
   */
  validateErrorSummaryNotVisible(): PassportInformationPage {
    cy.get(this.selectors.errorSummary.container).should("not.exist");
    return this;
  }

  /**
   * Verify error summary contains specific error text
   * @param {string} text - Error text to check for
   * @returns {PassportInformationPage}
   */
  validateErrorContainsText(text: string): PassportInformationPage {
    cy.get(this.selectors.errorSummary.list).should("contain.text", text);
    return this;
  }

  /**
   * Verify error summary contains multiple expected errors
   * @param {string[]} expectedErrors - Array of error messages
   * @returns {PassportInformationPage}
   */
  validateErrorSummary(expectedErrors: string[]): PassportInformationPage {
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
   * @returns {PassportInformationPage}
   */
  clickErrorLink(errorText: string): PassportInformationPage {
    cy.get(this.selectors.errorSummary.link).contains(errorText).click();
    return this;
  }

  // ============================================================================
  // ERROR VALIDATION METHODS - INDIVIDUAL FIELD ERRORS
  // ============================================================================

  /**
   * Validate passport number field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {PassportInformationPage}
   */
  validatePassportNumberFieldError(expectedMessage?: string): PassportInformationPage {
    cy.get(this.selectors.passportNumber.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.passportNumber.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.passportNumber.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate passport number field has no errors
   * @returns {PassportInformationPage}
   */
  validatePassportNumberNoError(): PassportInformationPage {
    cy.get(this.selectors.passportNumber.container).should(
      "not.have.class",
      "govuk-form-group--error",
    );
    cy.get(this.selectors.passportNumber.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate country of issue field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {PassportInformationPage}
   */
  validateCountryOfIssueFieldError(expectedMessage?: string): PassportInformationPage {
    cy.get(this.selectors.countryOfIssue.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.countryOfIssue.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.countryOfIssue.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate country of issue field has no errors
   * @returns {PassportInformationPage}
   */
  validateCountryOfIssueNoError(): PassportInformationPage {
    cy.get(this.selectors.countryOfIssue.container).should(
      "not.have.class",
      "govuk-form-group--error",
    );
    cy.get(this.selectors.countryOfIssue.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate issue date field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {PassportInformationPage}
   */
  validateIssueDateFieldError(expectedMessage?: string): PassportInformationPage {
    cy.get(this.selectors.issueDate.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.issueDate.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.issueDate.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate issue date field has no errors
   * @returns {PassportInformationPage}
   */
  validateIssueDateNoError(): PassportInformationPage {
    cy.get(this.selectors.issueDate.container).should("not.have.class", "govuk-form-group--error");
    cy.get(this.selectors.issueDate.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate expiry date field has error styling and message
   * @param {string} [expectedMessage] - Optional expected error message
   * @returns {PassportInformationPage}
   */
  validateExpiryDateFieldError(expectedMessage?: string): PassportInformationPage {
    cy.get(this.selectors.expiryDate.container).should("have.class", "govuk-form-group--error");
    cy.get(this.selectors.expiryDate.errorMessage).should("be.visible");
    if (expectedMessage) {
      cy.get(this.selectors.expiryDate.errorMessage).should("contain.text", expectedMessage);
    }
    return this;
  }

  /**
   * Validate expiry date field has no errors
   * @returns {PassportInformationPage}
   */
  validateExpiryDateNoError(): PassportInformationPage {
    cy.get(this.selectors.expiryDate.container).should("not.have.class", "govuk-form-group--error");
    cy.get(this.selectors.expiryDate.errorMessage).should("not.exist");
    return this;
  }

  /**
   * Validate multiple form field errors at once
   * @param {object} expectedErrorMessages - Object with field error messages
   * @returns {PassportInformationPage}
   */
  validateFormErrors(expectedErrorMessages: {
    passportNumber?: string;
    countryOfIssue?: string;
    issueDate?: string;
    expiryDate?: string;
  }): PassportInformationPage {
    if (expectedErrorMessages.passportNumber) {
      this.validatePassportNumberFieldError(expectedErrorMessages.passportNumber);
    }
    if (expectedErrorMessages.countryOfIssue) {
      this.validateCountryOfIssueFieldError(expectedErrorMessages.countryOfIssue);
    }
    if (expectedErrorMessages.issueDate) {
      this.validateIssueDateFieldError(expectedErrorMessages.issueDate);
    }
    if (expectedErrorMessages.expiryDate) {
      this.validateExpiryDateFieldError(expectedErrorMessages.expiryDate);
    }
    return this;
  }

  /**
   * Validate that no field errors are present
   * @returns {PassportInformationPage}
   */
  validateNoFieldErrors(): PassportInformationPage {
    this.validatePassportNumberNoError()
      .validateCountryOfIssueNoError()
      .validateIssueDateNoError()
      .validateExpiryDateNoError();
    return this;
  }

  // ============================================================================
  // NAVIGATION METHODS
  // ============================================================================

  /**
   * Click the Back link
   * @returns {PassportInformationPage}
   */
  clickBackLink(): PassportInformationPage {
    cy.get(this.selectors.backLink).click();
    return this;
  }

  /**
   * Verify Back link is visible and has correct text
   * @returns {PassportInformationPage}
   */
  verifyBackLinkVisible(): PassportInformationPage {
    cy.get(this.selectors.backLink).should("be.visible").and("contain.text", "Back");
    return this;
  }

  /**
   * Click Sign out link in header
   * @returns {PassportInformationPage}
   */
  clickSignOut(): PassportInformationPage {
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
   * @returns {PassportInformationPage}
   */
  verifyPhaseBannerVisible(): PassportInformationPage {
    cy.get(this.selectors.phaseBanner.container).should("be.visible");
    cy.get(this.selectors.phaseBanner.tag).should("contain.text", "BETA");
    return this;
  }

  /**
   * Verify skip link is present for accessibility
   * @returns {PassportInformationPage}
   */
  verifySkipLinkPresent(): PassportInformationPage {
    cy.get(this.selectors.header.skipLink)
      .should("exist")
      .and("have.attr", "href", "#main-content");
    return this;
  }

  /**
   * Verify all form labels are associated with inputs
   * @returns {PassportInformationPage}
   */
  verifyFormLabelsAssociated(): PassportInformationPage {
    // Passport number field
    cy.get(this.selectors.passportNumber.input).should(
      "have.attr",
      "aria-labelledby",
      "passport-number-field",
    );

    // Country of issue field
    cy.get(this.selectors.countryOfIssue.select).should(
      "have.attr",
      "aria-labelledby",
      "country-of-issue-field",
    );

    // Issue date fields
    cy.get(this.selectors.issueDate.dayInput)
      .parent()
      .find("label")
      .should("have.attr", "for", "passport-issue-date-day");

    cy.get(this.selectors.issueDate.monthInput)
      .parent()
      .find("label")
      .should("have.attr", "for", "passport-issue-date-month");

    cy.get(this.selectors.issueDate.yearInput)
      .parent()
      .find("label")
      .should("have.attr", "for", "passport-issue-date-year");

    // Expiry date fields
    cy.get(this.selectors.expiryDate.dayInput)
      .parent()
      .find("label")
      .should("have.attr", "for", "passport-expiry-date-day");

    cy.get(this.selectors.expiryDate.monthInput)
      .parent()
      .find("label")
      .should("have.attr", "for", "passport-expiry-date-month");

    cy.get(this.selectors.expiryDate.yearInput)
      .parent()
      .find("label")
      .should("have.attr", "for", "passport-expiry-date-year");

    return this;
  }

  /**
   * Verify hint text is properly associated with form fields
   * @returns {PassportInformationPage}
   */
  verifyHintTextAssociated(): PassportInformationPage {
    // Passport number hint
    cy.get(this.selectors.passportNumber.input).should(
      "have.attr",
      "aria-describedby",
      "passport-number-hint",
    );
    cy.get(this.selectors.passportNumber.hint).should("have.id", "passport-number-hint");

    // Country of issue hint
    cy.get(this.selectors.countryOfIssue.select).should(
      "have.attr",
      "aria-describedby",
      "country-of-issue-hint",
    );
    cy.get(this.selectors.countryOfIssue.hint).should("have.id", "country-of-issue-hint");

    // Issue date hint
    cy.get(this.selectors.issueDate.fieldset).should(
      "have.attr",
      "aria-describedby",
      "passport-issue-date-hint",
    );
    cy.get(this.selectors.issueDate.hint).should("have.id", "passport-issue-date-hint");

    // Expiry date hint
    cy.get(this.selectors.expiryDate.fieldset).should(
      "have.attr",
      "aria-describedby",
      "passport-expiry-date-hint",
    );
    cy.get(this.selectors.expiryDate.hint).should("have.id", "passport-expiry-date-hint");

    return this;
  }
}
