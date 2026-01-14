// This holds all the fields on the Travel Summary Page
import { BasePage } from "../BasePageNew";
import { randomElement, visaType } from "../test-utils";
import { GdsComponentHelper, ButtonHelper, SummaryHelper } from "../helpers";

export class TravelSummaryPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private summary = new SummaryHelper();

  constructor() {
    super("/check-travel-information");
  }

  // Verify page loaded
  verifyPageLoaded(): TravelSummaryPage {
    this.verifyUrlContains("/check-travel-information");
    cy.get("h1.govuk-heading-l").should("contain", "Check UK travel information");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Submit Form
  submitForm(): TravelSummaryPage {
    cy.get("button[type='submit']")
      .contains("Submit and continue")
      .filter(":visible")
      .first()
      .click();
    return this;
  }

  // Verify redirection to confirmation page
  verifyRedirectionToConfirmationPage(): TravelSummaryPage {
    this.verifyUrlContains("/travel-confirmation");
    return this;
  }

  // Click the change link for a specific summary entry
  clickChangeLink(summaryItemKey: string): TravelSummaryPage {
    cy.contains("dt.govuk-summary-list__key", summaryItemKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Verify field value after clicking change link
  verifyFieldValueOnChangePage(fieldName: string, expectedValue: string): TravelSummaryPage {
    const fieldSelectors: Record<string, string> = {
      "Visa category": '[name="visaCategory"]',
      "Address line 1 (optional)": '[name="applicantUkAddress1"]',
      "Address line 2 (optional)": '[name="applicantUkAddress2"]',
      "Address line 3 (optional)": '[name="applicantUkAddress3"]',
      "Town or city (optional)": '[name="townOrCity"]',
      "Postcode (optional)": '[name="postcode"]',
      "UK phone number (optional)": '[name="ukMobileNumber"]',
      "UK email address (optional)": '[name="ukEmail"]',
    };

    const selector = fieldSelectors[fieldName];
    if (selector) {
      cy.get(selector).should("exist").should("have.value", expectedValue);
    }

    // Go back to summary page
    cy.go("back");
    return this;
  }

  // Verify URL after clicking change link
  verifyUrlOnChangePage(expectedUrl: string): TravelSummaryPage {
    cy.url().should("include", expectedUrl);
    return this;
  }

  // Verify summary value
  verifySummaryValue(summaryItemKey: string, expectedValue: string): TravelSummaryPage {
    cy.contains("dt.govuk-summary-list__key", summaryItemKey)
      .siblings(".govuk-summary-list__value")
      .should("contain", expectedValue);
    return this;
  }

  // Verify random visa type is displayed
  verifyRandomVisaTypeDisplayed(expectedVisaType: string): TravelSummaryPage {
    this.verifySummaryValue("Visa category", expectedVisaType);
    cy.log(`Verified random visa type on summary page: ${expectedVisaType}`);
    return this;
  }

  // Method to get the displayed visa type
  getDisplayedVisaType(): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", "Visa category")
      .siblings(".govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify visa type is one of the valid options
  verifyVisaTypeIsValid(): TravelSummaryPage {
    this.getDisplayedVisaType().then((displayedVisa) => {
      expect(visaType).to.include(displayedVisa);
      cy.log(`Verified visa type "${displayedVisa}" is valid`);
    });
    return this;
  }

  // Verify all required summary values are present
  verifyRequiredSummaryValues(
    visaTypeValue: string,
    address1: string,
    townOrCity: string,
    postcode: string,
    mobileNumber: string,
    email: string,
  ): TravelSummaryPage {
    const expectedValues = {
      "Visa category": visaTypeValue,
      "Address line 1 (optional)": address1,
      "Town or city (optional)": townOrCity,
      "Postcode (optional)": postcode,
      "UK phone number (optional)": mobileNumber,
      "UK email address (optional)": email,
    };

    Object.entries(expectedValues).forEach(([key, value]) => {
      this.verifySummaryValue(key, value);
    });
    return this;
  }

  // Verify summary values with random visa type
  verifyRequiredSummaryValuesWithRandomVisa(
    expectedVisaType: string,
    address1: string,
    townOrCity: string,
    postcode: string,
    mobileNumber: string,
    email: string,
  ): TravelSummaryPage {
    cy.log(`Verifying summary with random visa type: ${expectedVisaType}`);
    return this.verifyRequiredSummaryValues(
      expectedVisaType,
      address1,
      townOrCity,
      postcode,
      mobileNumber,
      email,
    );
  }

  // Verify back link points to visa applicant proposed uk address page
  verifyBackLink(): TravelSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/visa-applicant-proposed-uk-address")
      .and("contain", "Back");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TravelSummaryPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify all change links have correct href values
  verifyChangeLinksTargets(): TravelSummaryPage {
    const expectedFragments = {
      "Visa category": "/proposed-visa-category#visa-category",
      "Address line 1 (optional)": "/visa-applicant-proposed-uk-address#address-1",
      "Address line 2 (optional)": "/visa-applicant-proposed-uk-address#address-2",
      "Address line 3 (optional)": "/visa-applicant-proposed-uk-address#address-3",
      "Town or city (optional)": "/visa-applicant-proposed-uk-address#town-or-city",
      "Postcode (optional)": "/visa-applicant-proposed-uk-address#postcode",
      "UK phone number (optional)": "/visa-applicant-proposed-uk-address#mobile-number",
      "UK email address (optional)": "/visa-applicant-proposed-uk-address#email",
    };

    Object.entries(expectedFragments).forEach(([key, href]) => {
      cy.contains("dt.govuk-summary-list__key", key)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("have.attr", "href", href);
    });
    return this;
  }

  // Verify optional address field shows "Not provided" when empty
  verifyOptionalAddressFieldNotProvided(
    fieldKey: string = "Address line 2 (optional)",
  ): TravelSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .should("contain", "Not provided");
    return this;
  }

  // Verify all fields are present on the page
  verifyAllFieldsPresent(): TravelSummaryPage {
    const requiredFields = [
      "Visa category",
      "Address line 1 (optional)",
      "Address line 2 (optional)",
      "Address line 3 (optional)",
      "Town or city (optional)",
      "Postcode (optional)",
      "UK phone number (optional)",
      "UK email address (optional)",
    ];

    requiredFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
    return this;
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): TravelSummaryPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Complete form submission flow
  completeFormSubmission(): TravelSummaryPage {
    this.verifyPageLoaded();
    this.submitForm();
    this.verifyRedirectionToConfirmationPage();
    return this;
  }

  // Complete form submission flow with random visa verification
  completeFormSubmissionWithRandomVisa(expectedVisaType: string): TravelSummaryPage {
    this.verifyPageLoaded();
    this.verifyRandomVisaTypeDisplayed(expectedVisaType);
    this.verifyVisaTypeIsValid();
    this.submitForm();
    this.verifyRedirectionToConfirmationPage();
    return this;
  }

  // Verify current page structure
  verifyCurrentPageStructure(): TravelSummaryPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyChangeLinksTargets();
    this.verifyOptionalAddressFieldNotProvided("Address line 2 (optional)");
    this.verifyOptionalAddressFieldNotProvided("Address line 3 (optional)");
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify current page structure with random visa
  verifyCurrentPageStructureWithRandomVisa(expectedVisaType: string): TravelSummaryPage {
    this.verifyPageLoaded();
    this.verifyRandomVisaTypeDisplayed(expectedVisaType);
    this.verifyVisaTypeIsValid();
    this.verifyAllFieldsPresent();
    this.verifyChangeLinksTargets();
    this.verifyOptionalAddressFieldNotProvided("Address line 2 (optional)");
    this.verifyOptionalAddressFieldNotProvided("Address line 3 (optional)");
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify page elements
  verifyAllPageElements(): TravelSummaryPage {
    this.verifyCurrentPageStructure();
    this.verifyBreadcrumbNavigation();
    return this;
  }

  // Verify page elements with random visa
  verifyAllPageElementsWithRandomVisa(expectedVisaType: string): TravelSummaryPage {
    this.verifyCurrentPageStructureWithRandomVisa(expectedVisaType);
    this.verifyBreadcrumbNavigation();
    return this;
  }

  // Method to verify if a field has a value or shows "Not provided"
  verifyFieldHasValueOrNotProvided(fieldKey: string, expectedValue?: string): TravelSummaryPage {
    if (expectedValue) {
      this.verifySummaryValue(fieldKey, expectedValue);
    } else {
      // Check if it shows "Not provided" for optional fields
      cy.contains("dt.govuk-summary-list__key", fieldKey)
        .siblings(".govuk-summary-list__value")
        .should("contain", "Not provided");
    }
    return this;
  }

  // Verification to handle optional fields
  verifySummaryValues(expectedValues: Record<string, string>): TravelSummaryPage {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Method to change visa type from summary page and verify random selection
  changeVisaTypeToRandom(): Cypress.Chainable<string> {
    const newRandomVisa = randomElement(visaType);
    cy.log(`Changing to new random visa type: ${newRandomVisa}`);

    this.clickChangeLink("Visa category");
    cy.get('[name="visaCategory"]').select(newRandomVisa);
    cy.get('button[type="submit"]').click();

    return cy.wrap(newRandomVisa);
  }

  // Method to verify the change flow works with random visa types
  verifyChangeFlowWithRandomVisa(originalVisa: string): Cypress.Chainable<string> {
    // Verify original visa is displayed
    this.verifyRandomVisaTypeDisplayed(originalVisa);

    // Change to a different random visa
    return this.changeVisaTypeToRandom().then((newVisa) => {
      // Verify the new visa is displayed
      this.verifyRandomVisaTypeDisplayed(newVisa);
      this.verifyVisaTypeIsValid();
      return cy.wrap(newVisa);
    });
  }

  // Verify submit button text
  verifySubmitButton(): TravelSummaryPage {
    cy.get("button[type='submit']").should("be.visible").and("contain.text", "Submit and continue");
    return this;
  }

  // Verify visa category section
  verifyVisaCategorySection(): TravelSummaryPage {
    cy.contains("dt.govuk-summary-list__key", "Visa category").should("be.visible");
    return this;
  }

  // Verify address line 3 is present
  verifyAddressLine3Present(): TravelSummaryPage {
    cy.contains("dt.govuk-summary-list__key", "Address line 3 (optional)").should("exist");
    return this;
  }

  // Verify all optional fields have "(optional)" label
  verifyOptionalFieldLabels(): TravelSummaryPage {
    const optionalFields = [
      "Address line 1 (optional)",
      "Address line 2 (optional)",
      "Address line 3 (optional)",
      "Town or city (optional)",
      "Postcode (optional)",
      "UK phone number (optional)",
      "UK email address (optional)",
    ];

    optionalFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("contain", "(optional)");
    });
    return this;
  }
}
