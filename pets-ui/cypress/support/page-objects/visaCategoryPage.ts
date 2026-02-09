// This holds all fields of the Visa Category Page
import { BasePage } from "../BasePageNew";
import { ButtonHelper, ErrorHelper, FormHelper, GdsComponentHelper } from "../helpers";

export class VisaCategoryPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();

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
    cy.get("h1.govuk-heading-l").should("be.visible").and("contain", "Proposed visa category");
    return this;
  }

  // Verify visa category radio buttons exist
  verifyVisaCategoryRadioButtons(): VisaCategoryPage {
    cy.get('input[name="visaCategory"][type="radio"]').should("exist").and("have.length", 5);
    return this;
  }

  // Verify all radio button options
  verifyRadioButtonOptions(): VisaCategoryPage {
    cy.get('.govuk-radios[data-module="govuk-radios"]').within(() => {
      cy.get(".govuk-radios__item").should("have.length", 5);
      cy.get('input[value="Work"]').should("exist");
      cy.get('label[for="visa-category-0"]').should("contain", "Work");
      cy.get('input[value="Study"]').should("exist");
      cy.get('label[for="visa-category-1"]').should("contain", "Study");
      cy.get('input[value="Family reunion"]').should("exist");
      cy.get('label[for="visa-category-2"]').should("contain", "Family reunion");
      cy.get('input[value="Other"]').should("exist");
      cy.get('label[for="visa-category-3"]').should("contain", "Other");
      cy.get('input[value="Do not know"]').should("exist");
      cy.get('label[for="visa-category-4"]').should("contain", "Do not know");
    });
    return this;
  }

  // Verify no radio button is selected by default
  verifyNoRadioButtonSelected(): VisaCategoryPage {
    cy.get('input[name="visaCategory"][type="radio"]:checked').should("not.exist");
    return this;
  }

  // Select visa category
  selectVisaCategory(
    category: "Work" | "Study" | "Family reunion" | "Other" | "Do not know",
  ): VisaCategoryPage {
    cy.get(`input[name="visaCategory"][value="${category}"]`).check();
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
    cy.get(`input[name="visaCategory"][value="${category}"]`).should("be.checked");
    return this;
  }

  // Get selected visa category value
  getSelectedVisaCategory(): Cypress.Chainable<string> {
    return cy.get('input[name="visaCategory"]:checked').invoke("val");
  }

  // Click continue button
  clickContinue(): VisaCategoryPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .filter(":visible")
      .first()
      .should("be.visible")
      .click();
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
    cy.get("h1.govuk-heading-l").should("have.css", "margin-bottom", "30px");
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
    cy.get('.govuk-error-summary[data-testid="error-summary"]')
      .should("be.visible")
      .and("have.attr", "data-module", "govuk-error-summary")
      .and("have.attr", "tabindex", "-1");
    return this;
  }

  // Validate error summary title
  validateErrorSummaryTitle(text: string = "There is a problem"): VisaCategoryPage {
    cy.get(".govuk-error-summary__title").should("be.visible").and("contain.text", text);
    return this;
  }

  // Validate error contains specific text in list
  validateErrorContainsText(text: string): VisaCategoryPage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  // Validate error summary link exists and has correct href
  validateErrorSummaryLink(linkText: string, href: string = "#visa-category"): VisaCategoryPage {
    cy.get(".govuk-error-summary__list")
      .find("a")
      .should("contain.text", linkText)
      .and("have.attr", "href", href);
    return this;
  }

  // Click error summary link
  clickErrorSummaryLink(): VisaCategoryPage {
    cy.get(".govuk-error-summary__list").find("a").first().click();
    return this;
  }

  // Validate field error message
  validateVisaCategoryFieldError(errorMessage?: string): VisaCategoryPage {
    cy.get("#visa-category .govuk-error-message")
      .should("be.visible")
      .and("have.class", "govuk-error-message");

    if (errorMessage) {
      cy.get("#visa-category .govuk-error-message").should("contain.text", errorMessage);
    }

    return this;
  }

  // Verify error message contains visually hidden "Error:" prefix
  verifyErrorMessagePrefix(): VisaCategoryPage {
    cy.get("#visa-category .govuk-error-message .govuk-visually-hidden")
      .should("exist")
      .and("contain.text", "Error:");
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
    this.verifyVisaCategoryRadioButtons();
    this.verifyRadioButtonOptions();
    this.verifyNoRadioButtonSelected();
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
    return cy.get('input[name="visaCategory"][type="radio"]').then(($radios) => {
      return $radios.map((i, el) => Cypress.$(el).val() as string).get();
    });
  }

  // Verify radio buttons are enabled
  verifyRadioButtonsEnabled(): VisaCategoryPage {
    cy.get('input[name="visaCategory"][type="radio"]').each(($radio) => {
      cy.wrap($radio).should("not.be.disabled");
    });
    return this;
  }

  // Verify radio buttons are disabled (if needed for certain scenarios)
  verifyRadioButtonsDisabled(): VisaCategoryPage {
    cy.get('input[name="visaCategory"][type="radio"]').each(($radio) => {
      cy.wrap($radio).should("be.disabled");
    });
    return this;
  }

  // Verify specific radio button by label
  verifyRadioButtonByLabel(label: string): VisaCategoryPage {
    cy.contains("label.govuk-radios__label", label).should("be.visible");
    return this;
  }

  // Select visa category by clicking label
  selectVisaCategoryByLabel(
    category: "Work" | "Study" | "Family reunion" | "Other" | "Do not know",
  ): VisaCategoryPage {
    cy.contains("label.govuk-radios__label", category).click();
    return this;
  }

  // Verify fieldset exists
  verifyFieldset(): VisaCategoryPage {
    cy.get(".govuk-fieldset").should("exist");
    cy.get(".govuk-fieldset__legend").should("exist");
    return this;
  }

  // Verify GOV.UK radios styling
  verifyRadioButtonStyling(): VisaCategoryPage {
    cy.get('.govuk-radios[data-module="govuk-radios"]').should("exist");
    cy.get(".govuk-radios__item").should("have.length.at.least", 1);
    cy.get(".govuk-radios__input").should("exist");
    cy.get(".govuk-radios__label").should("exist");
    return this;
  }
}
