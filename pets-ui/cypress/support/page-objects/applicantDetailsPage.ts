//This holds all fields on Applicant Details Page
export class ApplicantDetailsPage {
  // Navigation
  visit(): void {
    cy.visit("/contact");
  }

  // Personal Details Actions
  fillFullName(name: string): void {
    cy.get('input[name="fullName"]').should("be.visible").clear().type(name);
  }

  selectSex(sex: string): void {
    // Match the exact value case (Female, Male, or Other)
    cy.get(`input[name="sex"][value="${sex}"]`).should("exist").check().should("be.checked");
  }

  selectNationality(country: string): void {
    cy.get("#country-of-nationality.govuk-select").should("be.visible").select(country);
  }

  selectCountryOfIssue(country: string): void {
    cy.get("#country-of-issue.govuk-select").should("be.visible").select(country);
  }

  // Date of Birth Actions
  fillBirthDate(day: string, month: string, year: string): void {
    cy.get("input#birth-date-day").should("be.visible").clear().type(day);

    cy.get("input#birth-date-month").should("be.visible").clear().type(month);

    cy.get("input#birth-date-year").should("be.visible").clear().type(year);
  }

  // Passport Details Actions
  fillPassportNumber(number: string): void {
    cy.get('input[name="passportNumber"]').should("be.visible").clear().type(number);
  }

  fillPassportIssueDate(day: string, month: string, year: string): void {
    cy.get("input#passport-issue-date-day").should("be.visible").clear().type(day);

    cy.get("input#passport-issue-date-month").should("be.visible").clear().type(month);

    cy.get("input#passport-issue-date-year").should("be.visible").clear().type(year);
  }

  fillPassportExpiryDate(day: string, month: string, year: string): void {
    cy.get("input#passport-expiry-date-day").should("be.visible").clear().type(day);

    cy.get("input#passport-expiry-date-month").should("be.visible").clear().type(month);

    cy.get("input#passport-expiry-date-year").should("be.visible").clear().type(year);
  }

  // Address Actions
  fillAddressLine1(text: string): void {
    cy.get("#address-1").should("be.visible").clear().type(text);
  }

  fillAddressLine2(text: string): void {
    cy.get("#address-2").should("be.visible").clear().type(text);
  }

  fillAddressLine3(text: string): void {
    cy.get("#address-3").should("be.visible").clear().type(text);
  }

  fillTownOrCity(text: string): void {
    cy.get("#town-or-city").should("be.visible").clear().type(text);
  }

  fillProvinceOrState(text: string): void {
    cy.get("#province-or-state").should("be.visible").clear().type(text);
  }

  selectAddressCountry(country: string): void {
    cy.get("#address-country.govuk-select").should("be.visible").select(country);
  }

  fillPostcode(text: string): void {
    cy.get("#postcode").should("be.visible").clear().type(text);
  }

  // Form Submission
  submitForm(): void {
    cy.get('button[type="submit"]').should("be.visible").click();
  }

  fillFormWithValidData(countryName: string): void {
    cy.get('input[name="fullName"]').should("be.visible").clear().type("John Doe");
    cy.get(`input[name="sex"][value="Male"]`).should("exist").check().should("be.checked");
    cy.get("#country-of-nationality.govuk-select").should("be.visible").select(countryName);
    cy.get("#country-of-issue.govuk-select").should("be.visible").select(countryName);

    cy.get("input#birth-date-day").should("be.visible").clear().type("4");
    cy.get("input#birth-date-month").should("be.visible").clear().type("JAN");
    cy.get("input#birth-date-year").should("be.visible").clear().type("1998");

    cy.get('input[name="passportNumber"]').should("be.visible").clear().type("AA1235467");

    cy.get("input#passport-issue-date-day").should("be.visible").clear().type("20");
    cy.get("input#passport-issue-date-month").should("be.visible").clear().type("11");
    cy.get("input#passport-issue-date-year").should("be.visible").clear().type("2011");

    cy.get("input#passport-expiry-date-day").should("be.visible").clear().type("19");
    cy.get("input#passport-expiry-date-month").should("be.visible").clear().type("11");
    cy.get("input#passport-expiry-date-year").should("be.visible").clear().type("2031");

    cy.get("#address-1").should("be.visible").clear().type("1322");
    cy.get("#address-2").should("be.visible").clear().type("100th St");
    cy.get("#address-3").should("be.visible").clear().type("Apt 16");
    cy.get("#town-or-city").should("be.visible").clear().type("North Battleford");
    cy.get("#province-or-state").should("be.visible").clear().type("Saskatchewan");
    cy.get("#address-country.govuk-select").should("be.visible").select("CAN");
    cy.get("#postcode").should("be.visible").clear().type("S4R 0M6");
  }

  // Error validation methods
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
  }

  validateErrorContainsText(text: string): void {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
  }

  validateErrorSummary(expectedErrors: string[]): void {
    cy.get(".govuk-error-summary").should("be.visible");

    // Check each expected error is present in the error summary
    expectedErrors.forEach((errorText) => {
      cy.get(".govuk-error-summary__list").should("contain.text", errorText);
    });
  }

  // Form field error validations
  validateFullNameFieldError(): void {
    cy.get("#name").should("have.class", "govuk-form-group--error");
    cy.get("#name").find(".govuk-error-message").should("be.visible");
  }

  validateSexFieldError(): void {
    cy.get("#sex").should("have.class", "govuk-form-group--error");
    cy.get("#sex").find(".govuk-error-message").should("be.visible");
  }

  validateNationalityFieldError(): void {
    cy.get("#country-of-nationality").should("have.class", "govuk-form-group--error");
    cy.get("#country-of-nationality").find(".govuk-error-message").should("be.visible");
  }

  validateBirthDateFieldError(): void {
    cy.get("#birth-date").should("have.class", "govuk-form-group--error");
    cy.get("#birth-date").find(".govuk-error-message").should("be.visible");
  }

  validatePassportNumberFieldError(): void {
    cy.get("#passport-number").should("have.class", "govuk-form-group--error");
    cy.get("#passport-number").find(".govuk-error-message").should("be.visible");
  }

  validateAddressFieldError(): void {
    cy.get("#address-1").should("have.class", "govuk-form-group--error");
    cy.get("#address-1").find(".govuk-error-message").should("be.visible");
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
  }): void {
    // Validate Full Name field error
    if (expectedErrorMessages.fullName) {
      cy.get("#name").should("have.class", "govuk-form-group--error");
      cy.get("#name")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.fullName);
    }

    // Validate Sex field error
    if (expectedErrorMessages.sex) {
      cy.get("#sex").should("have.class", "govuk-form-group--error");
      cy.get("#sex")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.sex);
    }

    // Other field validations
    if (expectedErrorMessages.nationality) {
      cy.get("#country-of-nationality").should("have.class", "govuk-form-group--error");
      cy.get("#country-of-nationality")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.nationality);
    }

    if (expectedErrorMessages.birthDate) {
      cy.get("#birth-date").should("have.class", "govuk-form-group--error");
      cy.get("#birth-date")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.birthDate);
    }

    if (expectedErrorMessages.passportNumber) {
      cy.get("#passport-number").should("have.class", "govuk-form-group--error");
      cy.get("#passport-number")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.passportNumber);
    }

    if (expectedErrorMessages.passportIssueDate) {
      cy.get("#passport-issue-date").should("have.class", "govuk-form-group--error");
      cy.get("#passport-issue-date")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.passportIssueDate);
    }

    if (expectedErrorMessages.passportExpiryDate) {
      cy.get("#passport-expiry-date").should("have.class", "govuk-form-group--error");
      cy.get("#passport-expiry-date")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.passportExpiryDate);
    }
  }
  verifyPageLoaded(): void {
    cy.contains("h1", "Enter applicant information").should("be.visible");
  }

  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
}
