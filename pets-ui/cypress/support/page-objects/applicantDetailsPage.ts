//This holds all fields on the Applicant Details Page
import { BasePage } from "../BasePage";

export class ApplicantDetailsPage extends BasePage {
  constructor() {
    super("/contact");
  }

  // Page verification
  verifyPageLoaded(): ApplicantDetailsPage {
    this.verifyPageHeading("Enter applicant information");
    return this;
  }

  // Personal Details Methods
  fillFullName(name: string): ApplicantDetailsPage {
    this.fillTextInput("Full name", name);
    return this;
  }

  selectSex(sex: string): ApplicantDetailsPage {
    this.checkRadio("sex", sex);
    return this;
  }

  selectNationality(country: string): ApplicantDetailsPage {
    this.selectDropdown("Country of nationality", country);
    return this;
  }

  selectCountryOfIssue(country: string): ApplicantDetailsPage {
    this.selectDropdown("Country of issue", country);
    return this;
  }

  // Date of Birth Methods
  fillBirthDate(day: string, month: string, year: string): ApplicantDetailsPage {
    this.fillDateFields("Date of birth", day, month, year);
    return this;
  }

  // Passport Details Methods
  fillPassportNumber(number: string): ApplicantDetailsPage {
    this.fillTextInput("Passport number", number);
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

  // Address Methods
  fillAddressLine1(text: string): ApplicantDetailsPage {
    this.fillTextInput("Address line 1", text);
    return this;
  }

  fillAddressLine2(text: string): ApplicantDetailsPage {
    this.fillTextInput("Address line 2", text);
    return this;
  }

  fillAddressLine3(text: string): ApplicantDetailsPage {
    this.fillTextInput("Address line 3", text);
    return this;
  }

  fillTownOrCity(text: string): ApplicantDetailsPage {
    this.fillTextInput("Town/city", text);
    return this;
  }

  fillProvinceOrState(text: string): ApplicantDetailsPage {
    this.fillTextInput("Province/state", text);
    return this;
  }

  selectAddressCountry(country: string): ApplicantDetailsPage {
    cy.get('[name="country"]').select(country);
    return this;
  }

  fillPostcode(text: string): ApplicantDetailsPage {
    this.fillTextInput("Postcode", text);
    return this;
  }

  // Form Submission
  submitForm(): ApplicantDetailsPage {
    cy.get('button[type="submit"]').should("be.visible").click();
    return this;
  }

  /**
   * Fill the entire form with valid data
   * @param data Complete applicant details
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

  // Error validation methods
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

    // Check each expected error is present in the error summary
    expectedErrors.forEach((errorText) => {
      this.validateErrorContainsText(errorText);
    });

    return this;
  }

  // Form field error validations
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

  // Enhanced validation method
  validateFormErrors(expectedErrorMessages: {
    fullName?: string;
    sex?: string;
    nationality?: string;
    birthDate?: string;
    passportNumber?: string;
    passportIssueDate?: string;
    passportExpiryDate?: string;
    address?: string;
  }): ApplicantDetailsPage {
    // Validate Full Name field error
    if (expectedErrorMessages.fullName) {
      this.validateFieldError("name", expectedErrorMessages.fullName);
    }

    // Validate Sex field error
    if (expectedErrorMessages.sex) {
      this.validateFieldError("sex", expectedErrorMessages.sex);
    }

    // Other field validations
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

  // Get current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
}
