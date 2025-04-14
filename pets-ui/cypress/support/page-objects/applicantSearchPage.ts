// This holds all fields on the Applicant Search Page
import { countryList } from "../../../src/utils/countryList";
import { BasePage } from "../BasePage";

export class ApplicantSearchPage extends BasePage {
  constructor() {
    super("/");
  }

  // Verify page loaded using the base page method
  verifyPageLoaded(): this {
    this.verifyPageHeading("Search for a visa applicant");
    cy.contains(
      "p",
      "Enter the applicant's passport number and the passport's country of issue.",
    ).should("be.visible");
    return this;
  }

  // Fill Passport Number
  fillPassportNumber(passportNumber: string): this {
    this.fillTextInput("Applicant's passport number", passportNumber);
    return this;
  }

  // Select Country of Issue
  selectCountryOfIssue(countryCode: string): this {
    this.selectDropdown("Country of issue", countryCode);
    return this;
  }

  // Submit search form
  submitSearch(): this {
    this.submitForm("Search");
    return this;
  }

  // Click Create New Applicant button
  clickCreateNewApplicant(): this {
    cy.contains("button, .govuk-button", "Create new applicant").click();
    return this;
  }

  // Verify Create New Applicant button exists
  verifyCreateNewApplicantExists(): this {
    cy.contains("button, .govuk-button", "Create new applicant").should("be.visible");
    return this;
  }

  // Verify no matching record found message - added timeout to handle intermittent step failure
  verifyNoMatchingRecordMessage(timeout = 20000): this {
    cy.contains("h1", "No matching record found", { timeout }).should("be.visible");
    return this;
  }

  // Validate Passport Number field error
  validatePassportNumberFieldError(errorMessage?: string): this {
    this.validateFieldError("passport-number", errorMessage);
    return this;
  }

  // Validate Country of Issue field error
  validateCountryOfIssueFieldError(errorMessage?: string): this {
    this.validateFieldError("country-of-issue", errorMessage);
    return this;
  }

  // Detailed validation for checking form errors
  validateFormErrors(expectedErrorMessages: {
    passportNumber?: string;
    countryOfIssue?: string;
  }): this {
    // Validate Passport Number field error
    if (expectedErrorMessages.passportNumber) {
      this.validatePassportNumberFieldError(expectedErrorMessages.passportNumber);
    }

    // Validate Country of Issue field error
    if (expectedErrorMessages.countryOfIssue) {
      this.validateCountryOfIssueFieldError(expectedErrorMessages.countryOfIssue);
    }

    return this;
  }

  // Verify country of issue hint text
  verifyCountryOfIssueHintText(): this {
    cy.contains("label", "Country of issue")
      .siblings(".govuk-hint")
      .should("be.visible")
      .and(
        "contain.text",
        "If you have more than one, use the nationality in the primary passport submitted by the applicant",
      );
    return this;
  }

  // Search and create new if not found - new applicant
  searchAndCreateNewIfNotFound(passportNumber: string, countryCode: string): this {
    this.fillPassportNumber(passportNumber);
    this.selectCountryOfIssue(countryCode);
    this.submitSearch();

    cy.get("body").then(($body) => {
      if ($body.find("h1:contains('No matching record found')").length > 0) {
        // No matching record found, click the Create New Applicant button
        this.clickCreateNewApplicant();
      }
    });

    return this;
  }

  // Verify passport details were carried over to the applicant details page
  verifyPassportDetailsCarriedOver(passportNumber: string, countryCode: string): this {
    // Verify the passport number was carried over
    cy.contains("label", "Passport number")
      .parents(".govuk-form-group")
      .find("input")
      .should("have.value", passportNumber);

    // Verify the country of issue was carried over
    cy.contains("label", "Country of issue")
      .parents(".govuk-form-group")
      .find("select")
      .should("have.value", countryCode);

    return this;
  }

  // Get country label by country code
  getCountryLabelByCode(countryCode: string): string {
    const country = countryList.find((country) => country.value === countryCode);
    return country ? country.label : countryCode;
  }

  // Verify country dropdown has all expected options
  verifyCountryDropdownOptions(): this {
    cy.contains("label", "Country of issue")
      .parents(".govuk-form-group")
      .find("select option")
      .should("have.length.greaterThan", 200);

    return this;
  }

  // Verify successful redirection after search
  verifyRedirectionToDetailsPage(): this {
    this.verifyUrlContains("/contact");
    return this;
  }

  // Verify redirection after clicking Create New Applicant
  verifyRedirectionToCreateApplicantPage(): this {
    this.verifyUrlContains("/contact");
    return this;
  }

  // Verify page header
  verifyPageHeader(): this {
    this.verifyServiceName();
    return this;
  }
}
