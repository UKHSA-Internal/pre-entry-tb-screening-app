// This holds all fields of the Visa Category Page
import { BasePage } from "../BasePage";

export class VisaCategoryPage extends BasePage {
  constructor() {
    super("/proposed-visa-category");
  }

  // Verify page loaded
  verifyPageLoaded(): VisaCategoryPage {
    cy.url().should("include", "/proposed-visa-category");
    cy.contains("h1", "Proposed visa category").should("be.visible");
    cy.get("#visa-category").should("exist");
    return this;
  }

  // Verify page heading
  verifyPageHeading(): VisaCategoryPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Proposed visa category")
      .and("have.attr", "id", "visa-category-field");
    return this;
  }

  // Verify visa category dropdown exists
  verifyVisaCategoryDropdown(): VisaCategoryPage {
    cy.get('select[name="visaCategory"]')
      .should("exist")
      .and("have.class", "govuk-select")
      .and("have.attr", "aria-labelledby", "visa-category-field");
    return this;
  }

  // Verify all dropdown options
  verifyDropdownOptions(): VisaCategoryPage {
    cy.get('select[name="visaCategory"]').within(() => {
      cy.get("option").should("have.length", 6);
      cy.get('option[value=""]').should("be.disabled").and("contain", "Select visa category");
      cy.get('option[value="Work"]').should("exist").and("contain", "Work");
      cy.get('option[value="Study"]').should("exist").and("contain", "Study");
      cy.get('option[value="Family reunion"]').should("exist").and("contain", "Family reunion");
      cy.get('option[value="Other"]').should("exist").and("contain", "Other");
      cy.get('option[value="Do not know"]').should("exist").and("contain", "Do not know");
    });
    return this;
  }

  // Verify default placeholder is selected
  verifyDefaultPlaceholder(): VisaCategoryPage {
    cy.get('select[name="visaCategory"] option:selected')
      .should("have.value", "")
      .and("contain", "Select visa category");
    return this;
  }

  // Select visa category
  selectVisaCategory(
    category: "Work" | "Study" | "Family reunion" | "Other" | "Do not know",
  ): VisaCategoryPage {
    cy.get('select[name="visaCategory"]').select(category);
    return this;
  }

  // Select a random visa category
  selectRandomVisaCategory(): VisaCategoryPage {
    const visaCategories: Array<"Work" | "Study" | "Family reunion" | "Other" | "Do not know"> = [
      "Work",
      "Study",
      "Family reunion",
      "Other",
      "Do not know",
    ];
    const randomCategory = visaCategories[Math.floor(Math.random() * visaCategories.length)];
    cy.log(`Selecting random visa category: ${randomCategory}`);
    this.selectVisaCategory(randomCategory);
    return this;
  }

  // Verify selected visa category
  verifyVisaCategorySelected(
    category: "Work" | "Study" | "Family reunion" | "Other" | "Do not know",
  ): VisaCategoryPage {
    cy.get('select[name="visaCategory"]').should("have.value", category);
    return this;
  }

  // Get selected visa category value
  getSelectedVisaCategory(): Cypress.Chainable<string> {
    return cy.get('select[name="visaCategory"]').find("option:selected").invoke("val");
  }

  // Click continue button
  clickContinue(): VisaCategoryPage {
    cy.get("button[type='submit']").contains("Continue").should("be.visible").click();
    return this;
  }

  // Complete form with visa category selection
  completeForm(
    category: "Work" | "Study" | "Family reunion" | "Other" | "Do not know",
  ): VisaCategoryPage {
    this.selectVisaCategory(category);
    this.clickContinue();
    return this;
  }

  // Verify continue button
  verifyContinueButton(): VisaCategoryPage {
    cy.get("button[type='submit']")
      .should("contain", "Continue")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify continue button styling
  verifyContinueButtonStyling(): VisaCategoryPage {
    cy.get("button[type='submit']")
      .should("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button")
      .and("have.css", "margin-top", "30px");
    return this;
  }

  // Verify back link
  verifyBackLink(): VisaCategoryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/tracker")
      .and("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): VisaCategoryPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in header
  verifyServiceName(): VisaCategoryPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): VisaCategoryPage {
    cy.get(".govuk-phase-banner").should("exist");
    cy.get(".govuk-tag").should("contain", "BETA");
    cy.get(".govuk-phase-banner__text")
      .should("contain", "This is a new service")
      .and("contain", "give your feedback");
    return this;
  }

  // Verify sign out link
  verifySignOutLink(): VisaCategoryPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out")
      .and("contain", "Sign out");
    return this;
  }

  // Verify form group
  verifyFormGroup(): VisaCategoryPage {
    cy.get("#visa-category.govuk-form-group").should("exist");
    return this;
  }

  // Verify form element
  verifyFormElement(): VisaCategoryPage {
    cy.get("form").should("exist");
    return this;
  }

  // Verify heading styling
  verifyHeadingStyle(): VisaCategoryPage {
    cy.get("h1.govuk-heading-l").should("have.css", "margin-bottom", "10px");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): VisaCategoryPage {
    cy.get(".govuk-footer").should("exist");
    cy.get(".govuk-footer__link")
      .contains("Privacy")
      .should("have.attr", "href", "/privacy-notice");
    cy.get(".govuk-footer__link")
      .contains("Accessibility statement")
      .should("have.attr", "href", "/accessibility-statement");
    return this;
  }

  // Verify crown copyright
  verifyCrownCopyright(): VisaCategoryPage {
    cy.get(".govuk-footer").should("contain", "© Crown copyright");
    return this;
  }

  // Verify Open Government Licence
  verifyOpenGovernmentLicence(): VisaCategoryPage {
    cy.get(".govuk-footer__licence-description")
      .should("contain", "Open Government Licence v3.0")
      .find("a")
      .should(
        "have.attr",
        "href",
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      );
    return this;
  }

  // ==================== ERROR VALIDATION ====================

  // Validate error summary is visible
  validateErrorSummaryVisible(): VisaCategoryPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  // Validate error contains specific text
  validateErrorContainsText(text: string): VisaCategoryPage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  // Validate field error
  validateVisaCategoryFieldError(errorMessage?: string): VisaCategoryPage {
    cy.get("#visa-category-error").should("be.visible").and("have.class", "govuk-error-message");

    if (errorMessage) {
      cy.get("#visa-category-error").should("contain", errorMessage);
    }

    return this;
  }

  // Validate form group has error class
  validateFormGroupError(): VisaCategoryPage {
    cy.get("#visa-category").should("have.class", "govuk-form-group--error");
    return this;
  }

  // Verify page structure comprehensively
  verifyPageStructure(): VisaCategoryPage {
    this.verifyPageLoaded();
    this.verifyPageHeading();
    this.verifyFormGroup();
    this.verifyVisaCategoryDropdown();
    this.verifyDropdownOptions();
    this.verifyDefaultPlaceholder();
    this.verifyContinueButton();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify all page elements comprehensively
  verifyAllPageElements(): VisaCategoryPage {
    this.verifyPageStructure();
    this.verifyBetaBanner();
    this.verifySignOutLink();
    this.verifyFooterLinks();
    this.verifyCrownCopyright();
    this.verifyOpenGovernmentLicence();
    return this;
  }

  // Get current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Verify form is submitted (check redirection or next page)
  verifyFormSubmitted(): VisaCategoryPage {
    cy.url().should("not.include", "/proposed-visa-category");
    return this;
  }

  // Get all available visa categories
  getAllVisaCategories(): Cypress.Chainable<string[]> {
    return cy
      .get('select[name="visaCategory"] option')
      .not("[disabled]")
      .then(($options) => {
        return $options.map((i, el) => Cypress.$(el).val() as string).get();
      });
  }

  // Verify dropdown is enabled
  verifyDropdownEnabled(): VisaCategoryPage {
    cy.get('select[name="visaCategory"]').should("not.be.disabled");
    return this;
  }

  // Verify dropdown is disabled (if needed for certain scenarios)
  verifyDropdownDisabled(): VisaCategoryPage {
    cy.get('select[name="visaCategory"]').should("be.disabled");
    return this;
  }
}
