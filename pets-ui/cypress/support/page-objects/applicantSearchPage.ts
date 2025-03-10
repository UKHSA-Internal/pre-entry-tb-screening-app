//This holds all fields for the Applicant Search Page - this page may become redundant once navigation issue is fixed
import { countryList } from "../../../src/utils/countryList";
export class ApplicantSearchPage {
  // Navigation
  visit(): void {
    cy.visit("http://localhost:3000");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Search for a visa applicant").should("be.visible");
    cy.contains(
      "p",
      "Enter the applicant's passport number and the passport's country of issue.",
    ).should("be.visible");
  }

  // Fill Passport Number
  fillPassportNumber(passportNumber: string): void {
    cy.contains("label", "Applicant's Passport Number")
      .siblings(".govuk-input__wrapper")
      .find("input[name='passportNumber']")
      .should("be.visible")
      .clear()
      .type(passportNumber);
  }

  // Select Country of Issue
  selectCountryOfIssue(countryCode: string): void {
    cy.get("select[name='countryOfIssue']").select(countryCode);
  }

  // Submit search form
  submitSearch(): void {
    cy.contains("button", "Search").should("be.visible").click();
  }

  // Click Create New Applicant button
  clickCreateNewApplicant(): void {
    cy.get("#create-new-applicant").should("be.visible").click();
  }

  // Verify Create New Applicant button exists
  verifyCreateNewApplicantExists(): void {
    cy.get("#create-new-applicant").should("be.visible").and("contain", "Create new applicant");
  }

  // Verify no matching record found message
  verifyNoMatchingRecordMessage(): void {
    cy.contains("h1", "No matching record found").should("be.visible");
  }

  // Verify error summary visible
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
  }

  // Validate specific error message text
  validateErrorMessage(expectedText: string): void {
    this.validateErrorSummaryVisible();
    cy.get(".govuk-error-summary__list").should("contain.text", expectedText);
  }

  // Validate Passport Number field error
  validatePassportNumberFieldError(): void {
    cy.get("#passport-number").should("have.class", "govuk-form-group--error");
  }

  // Validate Country of Issue field error
  validateCountryOfIssueFieldError(): void {
    cy.get("#country-of-issue").should("have.class", "govuk-form-group--error");
  }

  // Detailed validation for checking form errors
  validateFormErrors(expectedErrorMessages: {
    passportNumber?: string;
    countryOfIssue?: string;
  }): void {
    // Validate Passport Number field error
    if (expectedErrorMessages.passportNumber) {
      cy.get("#passport-number").should("have.class", "govuk-form-group--error");
      cy.get("#passport-number")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.passportNumber);
    }

    // Validate Country of Issue field error
    if (expectedErrorMessages.countryOfIssue) {
      cy.get("#country-of-issue").should("have.class", "govuk-form-group--error");
      cy.get("#country-of-issue")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.countryOfIssue);
    }
  }

  // Search and create new if not found - new applicant
  searchAndCreateNewIfNotFound(passportNumber: string, countryCode: string): void {
    this.fillPassportNumber(passportNumber);
    this.selectCountryOfIssue(countryCode);
    this.submitSearch();

    cy.get("body").then(($body) => {
      if ($body.find("h1:contains('No matching record found')").length > 0) {
        // No matching record found, click the Create New Applicant button
        this.clickCreateNewApplicant();
      }
    });
  }

  // Verify passport details were carried over to the applicant details page
  verifyPassportDetailsCarriedOver(passportNumber: string, countryCode: string): void {
    // Verify the passport number was carried over
    cy.get('input[name="passportNumber"]').should("have.value", passportNumber);

    // Verify the country of issue was carried over
    cy.get("#country-of-issue").should("have.value", countryCode);
  }

  // Get country label by country code
  getCountryLabelByCode(countryCode: string): string {
    const country = countryList.find((country) => country.value === countryCode);
    return country ? country.label : countryCode;
  }

  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Verify successful redirection after search
  verifyRedirectionToDetailsPage(): void {
    cy.url().should("include", "/contact");
  }

  // Verify redirection after clicking Create New Applicant
  verifyRedirectionToCreateApplicantPage(): void {
    cy.url().should("include", "/contact");
  }

  // Get page title
  getPageTitle(): Cypress.Chainable<string> {
    return cy.title();
  }
}
