//This holds all fields on the Applicant Details Page with Dynamic Date Support
import { DateUtils } from "../../support/DateUtils";
import { BasePage } from "../BasePage";

export class ApplicantDetailsPage extends BasePage {
  constructor() {
    super("/contact");
  }

  // Page verification
  verifyPageLoaded(): ApplicantDetailsPage {
    this.verifyPageHeading("Visa applicant passport information");
    return this;
  }

  // Filling helper methods
  fillInputById(id: string, value: string): ApplicantDetailsPage {
    cy.get(`#${id}`, { timeout: 10000 }).should("be.visible").clear().type(value);
    return this;
  }

  fillInputByName(name: string, value: string): ApplicantDetailsPage {
    cy.get(`[name="${name}"]`, { timeout: 10000 }).should("be.visible").clear().type(value);
    return this;
  }

  // Personal Details Methods
  fillFullName(name: string): ApplicantDetailsPage {
    // Use data-testid which is more reliable
    cy.get('[data-testid="name"]', { timeout: 10000 }).should("be.visible").clear().type(name);
    return this;
  }

  selectSex(sex: string): ApplicantDetailsPage {
    this.checkRadio("sex", sex);
    return this;
  }

  selectNationality(country: string): ApplicantDetailsPage {
    cy.get('select[name="countryOfNationality"]', { timeout: 10000 })
      .should("be.visible")
      .select(country);
    return this;
  }

  selectCountryOfIssue(country: string): ApplicantDetailsPage {
    cy.get('select[name="countryOfIssue"]', { timeout: 10000 })
      .should("be.visible")
      .select(country);
    return this;
  }

  // Date of Birth Methods
  fillBirthDate(day: string, month: string, year: string): ApplicantDetailsPage {
    this.fillDateFields("Date of birth", day, month, year);
    return this;
  }

  /**
   * Fill birth date for a specific age
   * @param age - Age in years
   */
  fillBirthDateForAge(age: number): ApplicantDetailsPage {
    const dob = DateUtils.getDOBComponentsForAge(age);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  /**
   * Fill birth date for a child (under 11 years)
   * @param age - Optional specific age, or random between 2-10
   */
  fillChildBirthDate(age?: number): ApplicantDetailsPage {
    const dob = DateUtils.getChildDOBComponents(age);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  /**
   * Fill birth date for an adult (11+ years)
   * @param age - Age in years, defaults to 30
   */
  fillAdultBirthDate(age: number = 30): ApplicantDetailsPage {
    const dob = DateUtils.getAdultDOBComponents(age);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  // Passport Details Methods
  fillPassportNumber(number: string): ApplicantDetailsPage {
    cy.get('[data-testid="passport-number"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(number);
    return this;
  }

  fillPassportIssueDate(day: string, month: string, year: string): ApplicantDetailsPage {
    this.fillDateFields("Issue date", day, month, year);
    return this;
  }

  fillPassportExpiryDate(day: string, month: string, year: string): ApplicantDetailsPage {
    this.fillDateFields("Expiry date", day, month, year);
    return this;
  }

  /**
   * Fill passport issue date as a date in the past
   * @param yearsAgo - How many years ago the passport was issued (default: 2)
   */
  fillPassportIssueDateInPast(yearsAgo: number = 2): ApplicantDetailsPage {
    const issueDate = DateUtils.getDateInPast(yearsAgo);
    const components = DateUtils.getDateComponents(issueDate);
    this.fillPassportIssueDate(components.day, components.month, components.year);
    return this;
  }

  /**
   * Fill passport expiry date as a date in the future
   * @param yearsForward - How many years in the future (default: 8 for adults, accounts for 2-year-old passport)
   */
  fillPassportExpiryDateInFuture(yearsForward: number = 8): ApplicantDetailsPage {
    const expiryDate = DateUtils.getDateInFuture(yearsForward);
    const components = DateUtils.getDateComponents(expiryDate);
    this.fillPassportExpiryDate(components.day, components.month, components.year);
    return this;
  }

  /**
   * Fill passport dates automatically based on issue date
   * @param yearsAgoIssued - Years ago passport was issued (default: 2)
   * @param isChild - Whether this is a child's passport (affects expiry calculation)
   */
  fillPassportDatesAuto(
    yearsAgoIssued: number = 2,
    isChild: boolean = false,
  ): ApplicantDetailsPage {
    const issueDate = DateUtils.getDateInPast(yearsAgoIssued);
    const expiryDate = DateUtils.getPassportExpiryDate(issueDate, isChild);

    const issueComponents = DateUtils.getDateComponents(issueDate);
    const expiryComponents = DateUtils.getDateComponents(expiryDate);

    this.fillPassportIssueDate(issueComponents.day, issueComponents.month, issueComponents.year);
    this.fillPassportExpiryDate(
      expiryComponents.day,
      expiryComponents.month,
      expiryComponents.year,
    );

    return this;
  }

  /**
   * Fill birth date for an infant (under 12 months)
   * @param ageInMonths - Age in months (0-11)
   */
  fillInfantBirthDate(ageInMonths: number): ApplicantDetailsPage {
    if (ageInMonths >= 12) {
      throw new Error("Use fillChildBirthDate for children 12 months or older");
    }
    const dob = DateUtils.getInfantDOBComponents(ageInMonths);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  /**
   * Fill passport dates for an infant (under 12 months)
   * Ensures passport issue date is AFTER the infant's date of birth
   * @param infantAgeInMonths - Age of infant in months (0-11)
   * @param daysAfterBirth - Days after birth when passport was issued (default: 7 days)
   */
  fillInfantPassportDates(
    infantAgeInMonths: number,
    daysAfterBirth: number = 7,
  ): ApplicantDetailsPage {
    if (infantAgeInMonths >= 12) {
      throw new Error(
        "Use fillChildPassportDates() for children 12 months or older. This method is for infants under 12 months.",
      );
    }

    // Get the infant's DOB
    const infantDOB = DateUtils.getInfantDateOfBirth(infantAgeInMonths);

    // Issue passport X days after birth
    const issueDate = new Date(infantDOB);
    issueDate.setDate(issueDate.getDate() + daysAfterBirth);

    // Child passports expire after 5 years
    const expiryDate = DateUtils.getPassportExpiryDate(issueDate, true);

    const issueComponents = DateUtils.getDateComponents(issueDate);
    const expiryComponents = DateUtils.getDateComponents(expiryDate);

    cy.log(
      `Infant Passport: Issue=${issueComponents.day}/${issueComponents.month}/${issueComponents.year}, Expiry=${expiryComponents.day}/${expiryComponents.month}/${expiryComponents.year}`,
    );

    this.fillPassportIssueDate(issueComponents.day, issueComponents.month, issueComponents.year);
    this.fillPassportExpiryDate(
      expiryComponents.day,
      expiryComponents.month,
      expiryComponents.year,
    );

    return this;
  }

  /**
   * Fill passport dates for a child (1-10 years old)
   * Ensures passport is issued after birth
   * @param childAge - Age of child in years (1-10)
   * @param monthsAfterBirth - Months after birth when passport was issued (default: 1 month)
   */
  fillChildPassportDates(childAge: number, monthsAfterBirth: number = 1): ApplicantDetailsPage {
    if (childAge < 1 || childAge >= 11) {
      throw new Error("Child age must be between 1-10 years");
    }

    const childDOB = DateUtils.getChildDateOfBirth(childAge);

    // Issue passport X months after birth
    const issueDate = new Date(childDOB);
    issueDate.setMonth(issueDate.getMonth() + monthsAfterBirth);

    // Child passports expire after 5 years
    const expiryDate = DateUtils.getPassportExpiryDate(issueDate, true);

    const issueComponents = DateUtils.getDateComponents(issueDate);
    const expiryComponents = DateUtils.getDateComponents(expiryDate);

    this.fillPassportIssueDate(issueComponents.day, issueComponents.month, issueComponents.year);
    this.fillPassportExpiryDate(
      expiryComponents.day,
      expiryComponents.month,
      expiryComponents.year,
    );

    return this;
  }

  // Address Methods
  fillAddressLine1(text: string): ApplicantDetailsPage {
    cy.get('[data-testid="address-1"]', { timeout: 10000 }).should("be.visible").clear().type(text);
    return this;
  }

  fillAddressLine2(text: string): ApplicantDetailsPage {
    cy.get('[data-testid="address-2"]', { timeout: 10000 }).should("be.visible").clear().type(text);
    return this;
  }

  fillAddressLine3(text: string): ApplicantDetailsPage {
    cy.get('[data-testid="address-3"]', { timeout: 10000 }).should("be.visible").clear().type(text);
    return this;
  }

  fillTownOrCity(text: string): ApplicantDetailsPage {
    cy.get('[data-testid="town-or-city"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(text);
    return this;
  }

  fillProvinceOrState(text: string): ApplicantDetailsPage {
    cy.get('[data-testid="province-or-state"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(text);
    return this;
  }

  selectAddressCountry(country: string): ApplicantDetailsPage {
    cy.get('#address-country-field, select[name="country"]', { timeout: 10000 })
      .should("be.visible")
      .select(country);
    return this;
  }

  fillPostcode(text: string): ApplicantDetailsPage {
    cy.get('[data-testid="postcode"]', { timeout: 10000 }).should("be.visible").clear().type(text);
    return this;
  }

  // Form Submission
  submitForm(buttonText: string = "Save and continue"): ApplicantDetailsPage {
    // Target the form submit button, excluding cookie banner
    cy.get('main button[type="submit"], form button[type="submit"]')
      .contains(buttonText)
      .should("be.visible")
      .click();
    return this;
  }

  /**
   * Fill the entire form with valid data for an INFANT (under 12 months)
   * Automatically calculates dates ensuring passport is issued AFTER birth
   */
  fillCompleteInfantForm(data: {
    fullName: string;
    sex: string;
    nationality: string;
    ageInMonths: number; // Infant's age in months (0-11)
    daysAfterBirthForPassport?: number; // Days after birth passport was issued (default: 7)
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    townOrCity: string;
    provinceOrState?: string;
    addressCountry: string;
    postcode: string;
  }): ApplicantDetailsPage {
    if (data.ageInMonths >= 12) {
      throw new Error(
        "Infant age must be under 12 months. Use fillCompleteChildForm for older children.",
      );
    }

    const daysAfterBirth = data.daysAfterBirthForPassport || 7;

    this.fillFullName(data.fullName)
      .selectSex(data.sex)
      .selectNationality(data.nationality)
      .fillInfantBirthDate(data.ageInMonths) // Dynamic infant birth date
      .fillInfantPassportDates(data.ageInMonths, daysAfterBirth) // Passport issued AFTER birth
      .fillAddressLine1(data.addressLine1);

    if (data.addressLine2) {
      this.fillAddressLine2(data.addressLine2);
    }

    if (data.addressLine3) {
      this.fillAddressLine3(data.addressLine3);
    }

    this.fillTownOrCity(data.townOrCity);

    if (data.provinceOrState) {
      this.fillProvinceOrState(data.provinceOrState);
    }

    this.selectAddressCountry(data.addressCountry).fillPostcode(data.postcode);

    cy.log(
      `✓ Infant form completed: ${data.ageInMonths} months old, passport issued ${daysAfterBirth} days after birth`,
    );

    return this;
  }

  /**
   * Fill the entire form with valid data for a CHILD (1-10 years)
   * Automatically calculates dates based on age
   */
  fillCompleteChildForm(data: {
    fullName: string;
    sex: string;
    nationality: string;
    age: number; // Child's age (1-10 years)
    monthsAfterBirthForPassport?: number; // Months after birth passport was issued (default: 1)
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    townOrCity: string;
    provinceOrState?: string;
    addressCountry: string;
    postcode: string;
  }): ApplicantDetailsPage {
    if (data.age < 1 || data.age >= 11) {
      throw new Error("Child age must be between 1-10 years");
    }

    const monthsAfterBirth = data.monthsAfterBirthForPassport || 1;

    this.fillFullName(data.fullName)
      .selectSex(data.sex)
      .selectNationality(data.nationality)
      .fillChildBirthDate(data.age) // Dynamic child birth date
      .fillChildPassportDates(data.age, monthsAfterBirth) // Passport issued AFTER birth
      .fillAddressLine1(data.addressLine1);

    if (data.addressLine2) {
      this.fillAddressLine2(data.addressLine2);
    }

    if (data.addressLine3) {
      this.fillAddressLine3(data.addressLine3);
    }

    this.fillTownOrCity(data.townOrCity);

    if (data.provinceOrState) {
      this.fillProvinceOrState(data.provinceOrState);
    }

    this.selectAddressCountry(data.addressCountry).fillPostcode(data.postcode);

    cy.log(
      `✓ Child form completed: ${data.age} years old, passport issued ${monthsAfterBirth} months after birth`,
    );

    return this;
  }

  /**
   * Fill the entire form with valid data for an ADULT
   * Automatically calculates dates based on age
   */
  fillCompleteAdultForm(data: {
    fullName: string;
    sex: string;
    nationality: string;
    age?: number; // Adult's age (defaults to 30)
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    townOrCity: string;
    provinceOrState?: string;
    addressCountry: string;
    postcode: string;
  }): ApplicantDetailsPage {
    const age = data.age || 30;

    if (age < 11) {
      throw new Error("Adult age must be 11 years or older");
    }

    this.fillFullName(data.fullName)
      .selectSex(data.sex)
      .selectNationality(data.nationality)
      .fillAdultBirthDate(age) // Dynamic birth date
      .fillPassportDatesAuto(2, false) // Automatic passport dates for adult
      .fillAddressLine1(data.addressLine1);

    if (data.addressLine2) {
      this.fillAddressLine2(data.addressLine2);
    }

    if (data.addressLine3) {
      this.fillAddressLine3(data.addressLine3);
    }

    this.fillTownOrCity(data.townOrCity);

    if (data.provinceOrState) {
      this.fillProvinceOrState(data.provinceOrState);
    }

    this.selectAddressCountry(data.addressCountry).fillPostcode(data.postcode);

    return this;
  }

  /**
   * Original method - kept for backward compatibility
   * Fill the entire form with valid data
   */
  fillCompleteForm(data: {
    fullName: string;
    sex: string;
    nationality: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    passportIssueDay: string;
    passportIssueMonth: string;
    passportIssueYear: string;
    passportExpiryDay: string;
    passportExpiryMonth: string;
    passportExpiryYear: string;
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    townOrCity: string;
    provinceOrState?: string;
    addressCountry: string;
    postcode: string;
  }): ApplicantDetailsPage {
    this.fillFullName(data.fullName)
      .selectSex(data.sex)
      .selectNationality(data.nationality)
      .fillBirthDate(data.birthDay, data.birthMonth, data.birthYear)
      .fillPassportIssueDate(data.passportIssueDay, data.passportIssueMonth, data.passportIssueYear)
      .fillPassportExpiryDate(
        data.passportExpiryDay,
        data.passportExpiryMonth,
        data.passportExpiryYear,
      )
      .fillAddressLine1(data.addressLine1);

    if (data.addressLine2) {
      this.fillAddressLine2(data.addressLine2);
    }

    if (data.addressLine3) {
      this.fillAddressLine3(data.addressLine3);
    }

    this.fillTownOrCity(data.townOrCity);

    if (data.provinceOrState) {
      this.fillProvinceOrState(data.provinceOrState);
    }

    this.selectAddressCountry(data.addressCountry).fillPostcode(data.postcode);

    return this;
  }

  // Error validation methods (unchanged)
  validateErrorSummaryVisible(): ApplicantDetailsPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  validateErrorContainsText(text: string): ApplicantDetailsPage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  validateErrorSummary(expectedErrors: string[]): ApplicantDetailsPage {
    this.validateErrorSummaryVisible();
    expectedErrors.forEach((errorText) => {
      this.validateErrorContainsText(errorText);
    });
    return this;
  }

  validateFullNameFieldError(): ApplicantDetailsPage {
    this.validateFieldError("name");
    return this;
  }

  validateSexFieldError(): ApplicantDetailsPage {
    this.validateFieldError("sex");
    return this;
  }

  validateNationalityFieldError(): ApplicantDetailsPage {
    this.validateFieldError("country-of-nationality");
    return this;
  }

  validateBirthDateFieldError(): ApplicantDetailsPage {
    this.validateFieldError("birth-date");
    return this;
  }

  validatePassportNumberFieldError(): ApplicantDetailsPage {
    this.validateFieldError("passport-number");
    return this;
  }

  validateAddressFieldError(): ApplicantDetailsPage {
    this.validateFieldError("address-1");
    return this;
  }

  validateFormErrors(expectedErrorMessages: {
    fullName?: string;
    sex?: string;
    nationality?: string;
    birthDate?: string;
    passportNumber?: string;
    passportIssueDate?: string;
    passportExpiryDate?: string;
    address?: string;
    townOrCity?: string;
    addressCountry?: string;
  }): ApplicantDetailsPage {
    if (expectedErrorMessages.fullName) {
      this.validateFieldError("name", expectedErrorMessages.fullName);
    }
    if (expectedErrorMessages.sex) {
      this.validateFieldError("sex", expectedErrorMessages.sex);
    }
    if (expectedErrorMessages.nationality) {
      this.validateFieldError("country-of-nationality", expectedErrorMessages.nationality);
    }
    if (expectedErrorMessages.birthDate) {
      this.validateFieldError("birth-date", expectedErrorMessages.birthDate);
    }
    if (expectedErrorMessages.passportNumber) {
      this.validateFieldError("passport-number", expectedErrorMessages.passportNumber);
    }
    if (expectedErrorMessages.passportIssueDate) {
      this.validateFieldError("passport-issue-date", expectedErrorMessages.passportIssueDate);
    }
    if (expectedErrorMessages.passportExpiryDate) {
      this.validateFieldError("passport-expiry-date", expectedErrorMessages.passportExpiryDate);
    }
    return this;
  }

  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
}
