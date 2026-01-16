// This holds all fields on the Applicant Search Page
import { countryList } from "../../../src/utils/countryList";
import { BasePage } from "../BasePageNew";
import { ButtonHelper, ErrorHelper, FormHelper, GdsComponentHelper } from "../helpers";

export class ApplicantSearchPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private error = new ErrorHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/");
  }

  // Verify Search page loaded
  verifyPageLoaded(): this {
    this.gds.verifyPageHeading("Search for a visa applicant");
    cy.get('input[name="passportNumber"]').should("be.visible");
    cy.get('select[name="countryOfIssue"]').should("be.visible");
    return this;
  }

  fillPassportNumber(passportNumber: string): this {
    cy.get('input[name="passportNumber"]').clear().type(passportNumber);
    return this;
  }

  selectCountryOfIssue(countryCode: string): this {
    cy.get('select[name="countryOfIssue"]').select(countryCode);
    return this;
  }

  submitSearch(): this {
    cy.get('button[type="submit"]').contains("Search").click();
    return this;
  }

  // --- STATE-DEPENDENT METHODS (appear on No Matching Record page) ---
  clickCreateNewApplicant(): this {
    cy.contains("button, .govuk-button", "Continue").click();
    return this;
  }

  verifyCreateNewApplicantExists(): this {
    cy.contains("button, .govuk-button", "Continue").should("be.visible");
    return this;
  }
  // -------------------------------------------------------------------

  verifyNoMatchingRecordMessage(timeout = 20000): this {
    cy.contains("h1", "No visa applicant found", { timeout }).should("be.visible");
    return this;
  }

  validatePassportNumberFieldError(errorMessage?: string): this {
    this.error.validateFieldError("passport-number", errorMessage);
    return this;
  }

  validateCountryOfIssueFieldError(errorMessage?: string): this {
    this.error.validateFieldError("country-of-issue", errorMessage);
    return this;
  }

  validateFormErrors(expectedErrorMessages: {
    passportNumber?: string;
    countryOfIssue?: string;
  }): this {
    if (expectedErrorMessages.passportNumber) {
      this.validatePassportNumberFieldError(expectedErrorMessages.passportNumber);
    }
    if (expectedErrorMessages.countryOfIssue) {
      this.validateCountryOfIssueFieldError(expectedErrorMessages.countryOfIssue);
    }
    return this;
  }

  verifyCountryOfIssueHintText(): this {
    cy.get("#country-of-issue-hint")
      .should("be.visible")
      .and("contain.text", "As shown on passport, at the top of the first page");
    return this;
  }

  verifyBetaBanner(): this {
    cy.get(".govuk-phase-banner").within(() => {
      cy.contains(".govuk-tag", "BETA").should("be.visible");
      cy.contains("This is a new service. Help us improve it and").should("be.visible");
      cy.contains("a", "give your feedback (opens in new tab)")
        .should("have.attr", "href")
        .and("include", "forms.office.com");
    });
    return this;
  }

  clickFeedbackLink(): this {
    cy.contains("a", "give your feedback (opens in new tab)").click();
    return this;
  }

  verifySignOutLinkExists(): this {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain.text", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  clickSignOut(): this {
    cy.get("#sign-out").click();
    return this;
  }

  verifyFooterLinks(): this {
    cy.get(".govuk-footer").within(() => {
      cy.contains("a", "Privacy").should("be.visible").and("have.attr", "href", "/privacy-notice");

      cy.contains("a", "Accessibility statement")
        .should("be.visible")
        .and("have.attr", "href", "/accessibility-statement");
    });
    return this;
  }

  clickPrivacyLink(): this {
    cy.contains(".govuk-footer a", "Privacy").click();
    return this;
  }

  clickAccessibilityStatementLink(): this {
    cy.contains(".govuk-footer a", "Accessibility statement").click();
    return this;
  }

  verifyGovUKLogo(): this {
    cy.get(".govuk-header__logo").find("svg").should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  verifyServiceNameInHeader(): this {
    cy.get(".govuk-service-navigation__service-name").should(
      "contain.text",
      "Complete UK pre-entry health screening",
    );
    return this;
  }

  verifySkipLink(): this {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain.text", "Skip to main content");
    return this;
  }

  verifyPassportNumberFieldAttributes(): this {
    cy.get('input[name="passportNumber"]')
      .should("have.attr", "type", "text")
      .and("have.attr", "data-testid", "passport-number");
    return this;
  }

  verifyCountryDropdownAccessibility(): this {
    cy.get('select[name="countryOfIssue"]')
      .should("have.attr", "aria-labelledby", "country-of-issue-field")
      .and("have.attr", "aria-describedby", "country-of-issue-hint");
    return this;
  }

  searchAndCreateNewIfNotFound(passportNumber: string, countryCode: string): this {
    this.fillPassportNumber(passportNumber);
    this.selectCountryOfIssue(countryCode);
    this.submitSearch();

    cy.get("body").then(($body) => {
      if ($body.find("h1:contains('No matching record found')").length > 0) {
        this.clickCreateNewApplicant();
      }
    });

    return this;
  }

  verifyPassportDetailsCarriedOver(passportNumber: string, countryCode: string): this {
    cy.get('input[name="passportNumber"]').should("have.value", passportNumber);
    cy.get('select[name="countryOfIssue"]').should("have.value", countryCode);
    return this;
  }

  getCountryLabelByCode(countryCode: string): string {
    const country = countryList.find((country) => country.value === countryCode);
    return country ? country.label : countryCode;
  }

  verifyCountryDropdownOptions(): this {
    cy.get('select[name="countryOfIssue"] option').should("have.length.greaterThan", 200);
    return this;
  }

  verifyRedirectionToDetailsPage(): this {
    this.verifyUrlContains("/visa-applicant-personal-information");
    return this;
  }

  verifyRedirectionToCreateApplicantPage(): this {
    this.verifyUrlContains("/visa-applicant-personal-information");
    return this;
  }

  verifyPageHeader(): this {
    this.gds.verifyServiceName();
    return this;
  }
}
