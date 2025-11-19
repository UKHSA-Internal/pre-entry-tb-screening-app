import { BasePage } from "../BasePage";

export class ChestXrayPage extends BasePage {
  constructor() {
    super("/is-an-x-ray-required");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayPage {
    cy.url().should("include", "/is-an-x-ray-required");
    this.verifyPageHeading("Is an X-ray required?");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify radio buttons are displayed
  verifyRadioButtonsDisplayed(): ChestXrayPage {
    cy.get(".govuk-radios__item").should("have.length", 2);
    cy.get('input[name="chestXrayTaken"][value="Yes"]').should("be.visible");
    cy.get('input[name="chestXrayTaken"][value="No"]').should("be.visible");
    cy.contains("label", "Yes").should("be.visible");
    cy.contains("label", "No").should("be.visible");
    return this;
  }

  // Select "Yes" for X-ray taken
  selectXrayTakenYes(): ChestXrayPage {
    cy.get('input[name="chestXrayTaken"][value="Yes"]').check();
    return this;
  }

  // Select "No" for X-ray taken
  selectXrayTakenNo(): ChestXrayPage {
    cy.get('input[name="chestXrayTaken"][value="No"]').check();
    return this;
  }

  // Select X-ray option by value
  selectXrayOption(option: "Yes" | "No"): ChestXrayPage {
    cy.get(`input[name="chestXrayTaken"][value="${option}"]`).check();
    return this;
  }

  // Get current X-ray selection
  getCurrentXraySelection(): Cypress.Chainable<string> {
    return cy.get('input[name="chestXrayTaken"]:checked').invoke("val");
  }

  // Check if X-ray option is selected
  isXrayOptionSelected(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="chestXrayTaken"]:checked').should("exist");
  }

  // Verify specific option is checked
  verifyXrayOptionChecked(option: "Yes" | "No"): ChestXrayPage {
    cy.get(`input[name="chestXrayTaken"][value="${option}"]`).should("be.checked");
    return this;
  }

  // Click continue button
  clickContinue(): ChestXrayPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Submit form
  submitForm(): ChestXrayPage {
    this.clickContinue();
    return this;
  }

  // Verify form submission with selected option
  submitFormWithOption(option: "Yes" | "No"): ChestXrayPage {
    this.selectXrayOption(option);
    this.clickContinue();
    return this;
  }

  // Form validation
  validateXrayTakenFieldError(): ChestXrayPage {
    this.validateFieldError("chest-xray-taken");
    return this;
  }

  // Verify error summary is visible
  validateErrorSummaryVisible(): ChestXrayPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  // Verify specific error message
  validateErrorMessage(expectedText: string): ChestXrayPage {
    this.validateErrorSummaryVisible();
    cy.get(".govuk-error-summary__list").should("contain.text", expectedText);
    return this;
  }

  // Verify form validation - ensure an option is selected
  verifyFormValidation(): ChestXrayPage {
    // Submit form without selecting an option
    this.clickContinue();

    // Verify validation error is displayed
    cy.get(".govuk-error-message").should("be.visible");
    cy.get("#chest-xray-taken-error").should("be.visible");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): ChestXrayPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/record-medical-history-tb-symptoms");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ChestXrayPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify continue button is visible and enabled
  verifyContinueButton(): ChestXrayPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Continue");
    return this;
  }

  // Verify redirection after selecting "Yes"
  verifyRedirectionAfterYes(): ChestXrayPage {
    cy.url().should("include", "/check-medical-screening");
    return this;
  }

  // Verify redirection after selecting "No"
  verifyRedirectionAfterNo(): ChestXrayPage {
    cy.url().should("include", "/reason-x-ray-not-required");
    return this;
  }

  // Complete flow for selecting Yes and verifying redirection
  completeFlowWithYes(): ChestXrayPage {
    this.verifyPageLoaded();
    this.selectXrayTakenYes();
    this.clickContinue();
    this.verifyRedirectionAfterYes();
    return this;
  }

  // Complete flow for selecting No and verifying redirection
  completeFlowWithNo(): ChestXrayPage {
    this.verifyPageLoaded();
    this.selectXrayTakenNo();
    this.clickContinue();
    this.verifyRedirectionAfterNo();
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayPage {
    this.verifyPageLoaded();
    this.verifyRadioButtonsDisplayed();
    this.verifyContinueButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Verify inline radio layout
  verifyInlineRadioLayout(): ChestXrayPage {
    cy.get(".govuk-radios--inline").should("exist");
    return this;
  }

  // Verify form structure
  verifyFormStructure(): ChestXrayPage {
    cy.get("#chest-xray-taken").should("exist");
    cy.get("fieldset.govuk-fieldset").should("exist");
    cy.get(".govuk-radios").should("exist");
    return this;
  }
}
