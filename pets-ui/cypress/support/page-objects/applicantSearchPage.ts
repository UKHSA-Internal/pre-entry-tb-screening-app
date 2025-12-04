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

  // Verify full country of issue hint text including "Use the English spelling or the country code"
  verifyFullCountryOfIssueHintText(): this {
    cy.get("#country-of-issue-hint")
      .should("be.visible")
      .and(
        "contain.text",
        "If you have more than one, use the nationality in the primary passport submitted by the applicant. Use the English spelling or the country code.",
      );
    return this;
  }

  // Verify beta banner exists
  verifyBetaBanner(): this {
    cy.get(".govuk-phase-banner")
      .should("be.visible")
      .within(() => {
        cy.contains(".govuk-tag", "BETA").should("be.visible");
        cy.contains("This is a new service. Help us improve it and").should("be.visible");
        cy.contains("a", "give your feedback (opens in new tab)")
          .should("be.visible")
          .should("have.attr", "href")
          .and("include", "forms.office.com");
      });
    return this;
  }

  // Click feedback link
  clickFeedbackLink(): this {
    cy.contains("a", "give your feedback (opens in new tab)").click();
    return this;
  }

  // Verify Sign Out link exists
  verifySignOutLinkExists(): this {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain.text", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Click Sign Out link
  clickSignOut(): this {
    cy.get("#sign-out").click();
    return this;
  }

  // Verify footer links exist
  verifyFooterLinks(): this {
    cy.get(".govuk-footer").within(() => {
      cy.contains("a", "Privacy").should("be.visible").and("have.attr", "href", "/privacy-notice");
      cy.contains("a", "Accessibility statement")
        .should("be.visible")
        .and("have.attr", "href", "/accessibility-statement");
    });
    return this;
  }

  // Click Privacy link
  clickPrivacyLink(): this {
    cy.contains(".govuk-footer a", "Privacy").click();
    return this;
  }

  // Click Accessibility Statement link
  clickAccessibilityStatementLink(): this {
    cy.contains(".govuk-footer a", "Accessibility statement").click();
    return this;
  }

  // Verify GOV.UK logo exists
  verifyGovUKLogo(): this {
    cy.get(".govuk-header__logo")
      .should("be.visible")
      .find("svg")
      .should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  // Verify service name in header
  verifyServiceNameInHeader(): this {
    cy.get(".govuk-service-navigation__service-name")
      .first()
      .should("be.visible")
      .and("contain.text", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify skip to main content link
  verifySkipLink(): this {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain.text", "Skip to main content");
    return this;
  }

  // Verify passport number field has correct attributes
  verifyPassportNumberFieldAttributes(): this {
    cy.get("#passport-number-field")
      .should("have.attr", "type", "text")
      .and("have.attr", "name", "passportNumber")
      .and("have.attr", "data-testid", "passport-number");
    return this;
  }

  // Verify country dropdown has aria-describedby for hint
  verifyCountryDropdownAccessibility(): this {
    cy.get("#country-of-issue-field")
      .should("have.attr", "aria-describedby", "country-of-issue-hint")
      .and("have.attr", "name", "countryOfIssue");
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
    this.verifyUrlContains("/enter-visa-applicant-personal-information");
    return this;
  }

  // Verify redirection after clicking Create New Applicant
  verifyRedirectionToCreateApplicantPage(): this {
    this.verifyUrlContains("/enter-visa-applicant-personal-information");
    return this;
  }

  // Verify page header
  verifyPageHeader(): this {
    this.verifyServiceName();
    return this;
  }
}
