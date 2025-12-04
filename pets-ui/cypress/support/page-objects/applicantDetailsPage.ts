// This holds all fields on the Applicant Details Page
import { BasePage } from "../BasePage";

// Interface for applicant details form data
interface ApplicantDetailsFormData {
  fullName: string;
  sex: string;
  nationality: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  passportNumber: string;
  countryOfIssue: string;
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
  postcode?: string;
}

export class ApplicantDetailsPage extends BasePage {
  constructor() {
    super("/visa-applicant-passport-information");
  }

  // PAGE VERIFICATION

  verifyPageLoaded(): ApplicantDetailsPage {
    cy.url().should("include", "/visa-applicant-passport-information");
    cy.get("h1.govuk-heading-l").should("contain", "Visa applicant passport information");
    cy.contains("h2", "Full name").should("be.visible");
    return this;
  }

  verifyAllFieldsPresent(): ApplicantDetailsPage {
    cy.get('input[name="fullName"]').should("exist");
    cy.get('input[name="sex"]').should("exist");
    cy.get('select[name="countryOfNationality"]').should("exist");
    cy.get("#birth-date-day").should("exist");
    cy.get('input[name="passportNumber"]').should("exist");
    cy.get('select[name="countryOfIssue"]').should("exist");
    cy.get("#passport-issue-date-day").should("exist");
    cy.get("#passport-expiry-date-day").should("exist");
    cy.get('input[name="applicantHomeAddress1"]').should("exist");
    cy.get('input[name="townOrCity"]').should("exist");
    cy.get('select[name="country"]').should("exist");
    return this;
  }

  verifyBackLink(): ApplicantDetailsPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/do-you-have-visa-applicant-written-consent-for-tb-screening");
    return this;
  }

  verifyServiceName(): ApplicantDetailsPage {
    cy.get("body").then(($body) => {
      if ($body.find(".govuk-service-navigation__service-name").length > 0) {
        cy.get(".govuk-service-navigation__link")
          .should("be.visible")
          .and("contain", "Complete UK pre-entry health screening");
      }
    });
    return this;
  }

  // PERSONAL DETAILS METHODS

  fillFullName(name: string): ApplicantDetailsPage {
    cy.get('input[name="fullName"]').should("be.visible").clear().type(name);
    return this;
  }

  selectSex(sex: string): ApplicantDetailsPage {
    cy.get(`input[name="sex"][value="${sex}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    return this;
  }

  selectNationality(country: string): ApplicantDetailsPage {
    cy.get('select[name="countryOfNationality"]').should("be.visible").select(country);
    return this;
  }

  // DATE OF BIRTH METHODS

  fillBirthDate(day: string, month: string, year: string): ApplicantDetailsPage {
    cy.get("#birth-date-day").should("be.visible").clear().type(day);
    cy.get("#birth-date-month").should("be.visible").clear().type(month);
    cy.get("#birth-date-year").should("be.visible").clear().type(year);
    return this;
  }

  verifyBirthDateFieldsVisible(): ApplicantDetailsPage {
    cy.get("#birth-date-day").should("be.visible");
    cy.get("#birth-date-month").should("be.visible");
    cy.get("#birth-date-year").should("be.visible");
    return this;
  }

  // PASSPORT DETAILS METHODS

  fillPassportNumber(number: string): ApplicantDetailsPage {
    cy.get('input[name="passportNumber"]').should("be.visible").clear().type(number);
    return this;
  }

  selectCountryOfIssue(country: string): ApplicantDetailsPage {
    cy.get('select[name="countryOfIssue"]').should("be.visible").select(country);
    return this;
  }

  fillPassportIssueDate(day: string, month: string, year: string): ApplicantDetailsPage {
    cy.get("#passport-issue-date-day").should("be.visible").clear().type(day);
    cy.get("#passport-issue-date-month").should("be.visible").clear().type(month);
    cy.get("#passport-issue-date-year").should("be.visible").clear().type(year);
    return this;
  }

  fillPassportExpiryDate(day: string, month: string, year: string): ApplicantDetailsPage {
    cy.get("#passport-expiry-date-day").should("be.visible").clear().type(day);
    cy.get("#passport-expiry-date-month").should("be.visible").clear().type(month);
    cy.get("#passport-expiry-date-year").should("be.visible").clear().type(year);
    return this;
  }

  verifyPassportFieldsVisible(): ApplicantDetailsPage {
    cy.get('input[name="passportNumber"]').should("be.visible");
    cy.get('select[name="countryOfIssue"]').should("be.visible");
    cy.get("#passport-issue-date-day").should("be.visible");
    cy.get("#passport-expiry-date-day").should("be.visible");
    return this;
  }

  // ADDRESS METHODS

  fillAddressLine1(text: string): ApplicantDetailsPage {
    cy.get('input[name="applicantHomeAddress1"]').should("be.visible").clear().type(text);
    return this;
  }

  fillAddressLine2(text: string): ApplicantDetailsPage {
    cy.get('input[name="applicantHomeAddress2"]').should("be.visible").clear().type(text);
    return this;
  }

  fillAddressLine3(text: string): ApplicantDetailsPage {
    cy.get('input[name="applicantHomeAddress3"]').should("be.visible").clear().type(text);
    return this;
  }

  fillTownOrCity(text: string): ApplicantDetailsPage {
    cy.get('input[name="townOrCity"]').should("be.visible").clear().type(text);
    return this;
  }

  fillProvinceOrState(text: string): ApplicantDetailsPage {
    cy.get('input[name="provinceOrState"]').should("be.visible").clear().type(text);
    return this;
  }

  selectAddressCountry(country: string): ApplicantDetailsPage {
    cy.get('select[name="country"]').should("be.visible").select(country);
    return this;
  }

  fillPostcode(text: string): ApplicantDetailsPage {
    cy.get('input[name="postcode"]').should("be.visible").clear().type(text);
    return this;
  }

  verifyAddressFieldsVisible(): ApplicantDetailsPage {
    cy.get('input[name="applicantHomeAddress1"]').should("be.visible");
    cy.get('input[name="townOrCity"]').should("be.visible");
    cy.get('select[name="country"]').should("be.visible");
    return this;
  }

  // FORM SUBMISSION METHOD

  submitForm(buttonText: string = "Save and continue"): ApplicantDetailsPage {
    cy.get('main button[type="submit"], form button[type="submit"]')
      .contains(buttonText)
      .should("be.visible")
      .click();
    return this;
  }

  // Complete form filling methods
  /**
   * Fill the entire form with valid data
   * @param data Complete applicant details
   */
  fillCompleteForm(data: ApplicantDetailsFormData): ApplicantDetailsPage {
    this.fillFullName(data.fullName);
    this.selectSex(data.sex);
    this.selectNationality(data.nationality);
    this.fillBirthDate(data.birthDay, data.birthMonth, data.birthYear);
    this.fillPassportNumber(data.passportNumber);
    this.selectCountryOfIssue(data.countryOfIssue);
    this.fillPassportIssueDate(
      data.passportIssueDay,
      data.passportIssueMonth,
      data.passportIssueYear,
    );
    this.fillPassportExpiryDate(
      data.passportExpiryDay,
      data.passportExpiryMonth,
      data.passportExpiryYear,
    );
    this.fillAddressLine1(data.addressLine1);

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

    this.selectAddressCountry(data.addressCountry);

    if (data.postcode) {
      this.fillPostcode(data.postcode);
    }

    return this;
  }

  // ERROR VALIDATION METHODS
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
  // INDIVIDUAL FIELD ERROR VALIDATION METHOD

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

  validateCountryOfIssueFieldError(): ApplicantDetailsPage {
    this.validateFieldError("country-of-issue");
    return this;
  }

  validatePassportIssueDateFieldError(): ApplicantDetailsPage {
    this.validateFieldError("passport-issue-date");
    return this;
  }

  validatePassportExpiryDateFieldError(): ApplicantDetailsPage {
    this.validateFieldError("passport-expiry-date");
    return this;
  }

  validateAddressFieldError(): ApplicantDetailsPage {
    this.validateFieldError("address-1");
    return this;
  }

  validateTownOrCityFieldError(): ApplicantDetailsPage {
    this.validateFieldError("town-or-city");
    return this;
  }

  validateAddressCountryFieldError(): ApplicantDetailsPage {
    this.validateFieldError("address-country");
    return this;
  }

  // FORM ERROR VALIDATION METHODS

  validateFormErrors(expectedErrorMessages: {
    fullName?: string;
    sex?: string;
    nationality?: string;
    birthDate?: string;
    passportNumber?: string;
    countryOfIssue?: string;
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

    if (expectedErrorMessages.countryOfIssue) {
      this.validateFieldError("country-of-issue", expectedErrorMessages.countryOfIssue);
    }

    if (expectedErrorMessages.passportIssueDate) {
      this.validateFieldError("passport-issue-date", expectedErrorMessages.passportIssueDate);
    }

    if (expectedErrorMessages.passportExpiryDate) {
      this.validateFieldError("passport-expiry-date", expectedErrorMessages.passportExpiryDate);
    }

    if (expectedErrorMessages.address) {
      this.validateFieldError("address-1", expectedErrorMessages.address);
    }

    if (expectedErrorMessages.townOrCity) {
      this.validateFieldError("town-or-city", expectedErrorMessages.townOrCity);
    }

    if (expectedErrorMessages.addressCountry) {
      this.validateFieldError("address-country", expectedErrorMessages.addressCountry);
    }

    return this;
  }
  // FORM VALIDATION METHODS

  verifyFormFieldValue(fieldName: string, expectedValue: string): ApplicantDetailsPage {
    cy.get(`[name="${fieldName}"]`).should("have.value", expectedValue);
    return this;
  }

  verifyFullNameValue(expectedValue: string): ApplicantDetailsPage {
    cy.get('input[name="fullName"]').should("have.value", expectedValue);
    return this;
  }

  verifyPassportNumberValue(expectedValue: string): ApplicantDetailsPage {
    cy.get('input[name="passportNumber"]').should("have.value", expectedValue);
    return this;
  }

  verifySexSelected(expectedValue: string): ApplicantDetailsPage {
    cy.get(`input[name="sex"][value="${expectedValue}"]`).should("be.checked");
    return this;
  }

  verifyNationalitySelected(expectedValue: string): ApplicantDetailsPage {
    cy.get('select[name="countryOfNationality"]').should("have.value", expectedValue);
    return this;
  }

  verifyCountryOfIssueSelected(expectedValue: string): ApplicantDetailsPage {
    cy.get('select[name="countryOfIssue"]').should("have.value", expectedValue);
    return this;
  }

  verifyAddressCountrySelected(expectedValue: string): ApplicantDetailsPage {
    cy.get('select[name="country"]').should("have.value", expectedValue);
    return this;
  }

  verifyBirthDateValues(day: string, month: string, year: string): ApplicantDetailsPage {
    cy.get("#birth-date-day").should("have.value", day);
    cy.get("#birth-date-month").should("have.value", month);
    cy.get("#birth-date-year").should("have.value", year);
    return this;
  }

  verifyPassportIssueDateValues(day: string, month: string, year: string): ApplicantDetailsPage {
    cy.get("#passport-issue-date-day").should("have.value", day);
    cy.get("#passport-issue-date-month").should("have.value", month);
    cy.get("#passport-issue-date-year").should("have.value", year);
    return this;
  }

  verifyPassportExpiryDateValues(day: string, month: string, year: string): ApplicantDetailsPage {
    cy.get("#passport-expiry-date-day").should("have.value", day);
    cy.get("#passport-expiry-date-month").should("have.value", month);
    cy.get("#passport-expiry-date-year").should("have.value", year);
    return this;
  }
  // COMPREHENSIVE FORM VALIDATION METHOD

  validateCompleteFormData(data: ApplicantDetailsFormData): ApplicantDetailsPage {
    this.verifyFullNameValue(data.fullName);
    this.verifySexSelected(data.sex);
    this.verifyNationalitySelected(data.nationality);
    this.verifyBirthDateValues(data.birthDay, data.birthMonth, data.birthYear);
    this.verifyPassportNumberValue(data.passportNumber);
    this.verifyCountryOfIssueSelected(data.countryOfIssue);
    this.verifyPassportIssueDateValues(
      data.passportIssueDay,
      data.passportIssueMonth,
      data.passportIssueYear,
    );
    this.verifyPassportExpiryDateValues(
      data.passportExpiryDay,
      data.passportExpiryMonth,
      data.passportExpiryYear,
    );

    cy.get('input[name="applicantHomeAddress1"]').should("have.value", data.addressLine1);
    cy.get('input[name="townOrCity"]').should("have.value", data.townOrCity);
    this.verifyAddressCountrySelected(data.addressCountry);

    if (data.addressLine2) {
      cy.get('input[name="applicantHomeAddress2"]').should("have.value", data.addressLine2);
    }

    if (data.addressLine3) {
      cy.get('input[name="applicantHomeAddress3"]').should("have.value", data.addressLine3);
    }

    if (data.provinceOrState) {
      cy.get('input[name="provinceOrState"]').should("have.value", data.provinceOrState);
    }

    if (data.postcode) {
      cy.get('input[name="postcode"]').should("have.value", data.postcode);
    }

    return this;
  }
  // UTILITY
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  verifyRedirectedToNextPage(): ApplicantDetailsPage {
    cy.url().should("not.include", "/visa-applicant-passport-information");
    return this;
  }

  clearForm(): ApplicantDetailsPage {
    cy.get('input[name="fullName"]').clear();
    cy.get('input[name="passportNumber"]').clear();
    cy.get("#birth-date-day").clear();
    cy.get("#birth-date-month").clear();
    cy.get("#birth-date-year").clear();
    cy.get("#passport-issue-date-day").clear();
    cy.get("#passport-issue-date-month").clear();
    cy.get("#passport-issue-date-year").clear();
    cy.get("#passport-expiry-date-day").clear();
    cy.get("#passport-expiry-date-month").clear();
    cy.get("#passport-expiry-date-year").clear();
    cy.get('input[name="applicantHomeAddress1"]').clear();
    cy.get('input[name="townOrCity"]').clear();
    return this;
  }

  // COMPREHENSIVE PAGE VALIDATION METHOD

  verifyAllPageElements(): ApplicantDetailsPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }
}
