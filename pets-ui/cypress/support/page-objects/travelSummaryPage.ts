// This holds all the fields on the Travel Summary Page
import { BasePage } from "../BasePage";
import { randomElement, visaType } from "../test-utils";

export class TravelSummaryPage extends BasePage {
  constructor() {
    super("/travel-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): TravelSummaryPage {
    this.verifyUrlContains("/travel-summary");
    cy.get("h1.govuk-heading-l").should("contain", "Check travel information");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Submit Form
  submitForm(): TravelSummaryPage {
    cy.get("button[type='submit']").contains("Save and continue").click();
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
      "UK address line 1": '[name="applicantUkAddress1"]',
      "UK address line 2": '[name="applicantUkAddress2"]',
      "UK town or city": '[name="townOrCity"]',
      "UK postcode": '[name="postcode"]',
      "UK mobile number": '[name="ukMobileNumber"]',
      "UK email address": '[name="ukEmail"]',
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
      "UK address line 1": address1,
      "UK town or city": townOrCity,
      "UK postcode": postcode,
      "UK mobile number": mobileNumber,
      "UK email address": email,
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

  // Verify back link points to travel details
  verifyBackLink(): TravelSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/travel-details")
      .and("contain", "Back");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TravelSummaryPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify all change links have correct href values
  verifyChangeLinksTargets(): TravelSummaryPage {
    const expectedFragments = {
      "Visa category": "#visa-category",
      "UK address line 1": "#address-1",
      "UK address line 2": "#address-2",
      "UK town or city": "#town-or-city",
      "UK postcode": "#postcode",
      "UK mobile number": "#mobile-number",
      "UK email address": "#email",
    };

    Object.entries(expectedFragments).forEach(([key, fragment]) => {
      cy.contains("dt.govuk-summary-list__key", key)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("have.attr", "href")
        .and("include", fragment);
    });
    return this;
  }

  // Verify optional address field shows "Enter" link when empty
  verifyOptionalAddressField(): TravelSummaryPage {
    cy.contains("dt.govuk-summary-list__key", "UK address line 2")
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", "Enter UK address line 2 (optional)")
      .and("have.attr", "href", "/travel-details#address-2");
    return this;
  }

  // Verify all fields are present on the page
  verifyAllFieldsPresent(): TravelSummaryPage {
    const requiredFields = [
      "Visa category",
      "UK address line 1",
      "UK address line 2",
      "UK town or city",
      "UK postcode",
      "UK mobile number",
      "UK email address",
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
    this.verifyOptionalAddressField();
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
    this.verifyOptionalAddressField();
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

  // Method to verify if a field has a value or shows "Enter" link
  verifyFieldHasValueOrEnterLink(fieldKey: string, expectedValue?: string): TravelSummaryPage {
    if (expectedValue) {
      this.verifySummaryValue(fieldKey, expectedValue);
    } else {
      // Check if it shows an "Enter" link for optional fields
      cy.contains("dt.govuk-summary-list__key", fieldKey)
        .siblings(".govuk-summary-list__value")
        .should("exist");
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
}
