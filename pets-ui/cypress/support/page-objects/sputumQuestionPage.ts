import { BasePage } from "../BasePage";

export class SputumQuestionPage extends BasePage {
  constructor() {
    super("/sputum-question");
  }

  // Verify page loaded
  verifyPageLoaded(): SputumQuestionPage {
    this.verifyPageHeading("Is a sputum collection required?");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify sputum question is displayed
  verifySputumQuestionDisplayed(): SputumQuestionPage {
    cy.contains("h1", "Is a sputum collection required?").should("be.visible");
    cy.get("#sputum-required .govuk-fieldset").should("be.visible");
    cy.get(".govuk-radios--inline").should("be.visible");
    return this;
  }

  // Select "Yes" for sputum collection required
  selectSputumRequiredYes(): SputumQuestionPage {
    cy.get("#sputum-required-0").check();
    return this;
  }

  // Select "No" for sputum collection required
  selectSputumRequiredNo(): SputumQuestionPage {
    cy.get("#sputum-required-1").check();
    return this;
  }

  // Method using radio button checking with name and value
  selectSputumRequired(option: "Yes" | "No"): SputumQuestionPage {
    cy.get(`input[name="isSputumRequired"][value="${option}"]`).check();
    return this;
  }

  // Get current sputum selection
  getCurrentSputumSelection(): Cypress.Chainable<string> {
    return cy.get('input[name="isSputumRequired"]:checked').invoke("val");
  }

  // Check if sputum option is selected
  isSputumOptionSelected(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="isSputumRequired"]:checked').should("exist");
  }

  // Verify specific option is selected
  verifySputumOptionSelected(option: "Yes" | "No"): SputumQuestionPage {
    cy.get(`input[name="isSputumRequired"][value="${option}"]`).should("be.checked");
    return this;
  }

  // Click continue button
  clickContinue(): SputumQuestionPage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Verify form submission with selected option
  submitFormWithOption(option: "Yes" | "No"): SputumQuestionPage {
    this.selectSputumRequired(option);
    this.clickContinue();
    return this;
  }

  // Form validation methods
  validateSputumRequiredFieldError(): SputumQuestionPage {
    this.validateFieldError("sputum-required");
    return this;
  }

  // Verify error summary is displayed
  verifyErrorSummaryDisplayed(): SputumQuestionPage {
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary").should("have.attr", "data-module", "govuk-error-summary");
    return this;
  }

  // Verify specific error message in summary
  verifyErrorSummaryMessage(
    expectedText: string = "Select yes if sputum collection is required",
  ): SputumQuestionPage {
    this.verifyErrorSummaryDisplayed();
    cy.get(".govuk-error-summary").should("contain.text", expectedText);
    return this;
  }

  // Verify form group has error state
  verifyFormGroupErrorState(): SputumQuestionPage {
    cy.get("#sputum-required").should("have.class", "govuk-form-group--error");
    return this;
  }

  // Verify field-level error message
  verifyFieldErrorMessage(): SputumQuestionPage {
    cy.get("#sputum-required .govuk-error-message").should("be.visible");
    cy.get("#sputum-required .govuk-error-message").should(
      "contain.text",
      "Select yes if sputum collection is required",
    );
    return this;
  }

  // Verify "There is a problem" heading
  verifyProblemHeading(): SputumQuestionPage {
    cy.contains("There is a problem").should("be.visible");
    return this;
  }

  // Comprehensive error validation
  verifyAllErrorElements(): SputumQuestionPage {
    this.verifyProblemHeading();
    this.verifyErrorSummaryDisplayed();
    this.verifyErrorSummaryMessage();
    this.verifyFormGroupErrorState();
    this.verifyFieldErrorMessage();
    return this;
  }

  // Verify form validation - ensure an option is selected
  verifyFormValidation(): SputumQuestionPage {
    // Submit form without selecting an option
    this.clickContinue();

    // Verify all error validation elements are displayed
    this.verifyAllErrorElements();
    return this;
  }

  // Verify error summary link functionality
  verifyErrorSummaryLinkFunctionality(): SputumQuestionPage {
    // Click on error summary link and verify it focuses the form group
    cy.get(".govuk-error-summary a").click();
    cy.get("#sputum-required").should("be.focused");
    return this;
  }

  // Verify radio buttons are displayed correctly
  verifyRadioButtonsDisplayed(): SputumQuestionPage {
    cy.get("#sputum-required-0").should("be.visible");
    cy.get("#sputum-required-1").should("be.visible");
    cy.get('label[for="sputum-required-0"]').should("contain.text", "Yes");
    cy.get('label[for="sputum-required-1"]').should("contain.text", "No");
    return this;
  }

  // Verify continue button is present and enabled
  verifyContinueButtonDisplayed(): SputumQuestionPage {
    cy.get('button[type="submit"]').should("be.visible").and("be.enabled");
    cy.get('button[type="submit"]').should("contain.text", "Continue");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): SputumQuestionPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/chest-xray-findings");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): SputumQuestionPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): SputumQuestionPage {
    this.verifyPageLoaded();
    this.verifySputumQuestionDisplayed();
    this.verifyRadioButtonsDisplayed();
    this.verifyContinueButtonDisplayed();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }
}
