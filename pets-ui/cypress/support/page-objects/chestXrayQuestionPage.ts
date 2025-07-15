import { BasePage } from "../BasePage";

export class ChestXrayPage extends BasePage {
  constructor() {
    super("/chest-xray");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayPage {
    this.verifyPageHeading("Select X-ray status");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify X-ray question is displayed
  verifyXrayQuestionDisplayed(): ChestXrayPage {
    cy.contains("h2", "Has the visa applicant had a chest X-ray?").should("be.visible");
    cy.get(".govuk-label")
      .contains("This would typically be the postero-anterior chest X-ray")
      .should("be.visible");
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

  // Get current X-ray selection
  getCurrentXraySelection(): Cypress.Chainable<string> {
    return cy.get('input[name="chestXrayTaken"]:checked').invoke("val");
  }

  // Check if X-ray option is selected
  isXrayOptionSelected(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="chestXrayTaken"]:checked').should("exist");
  }

  // Click continue button
  clickContinue(): ChestXrayPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Verify form submission with selected option
  submitFormWithOption(option: "Yes" | "No"): ChestXrayPage {
    if (option === "Yes") {
      this.selectXrayTakenYes();
    } else {
      this.selectXrayTakenNo();
    }
    this.clickContinue();
    return this;
  }

  // Form validation
  validateXrayTakenFieldError(): ChestXrayPage {
    this.validateFieldError("chest-xray-taken");
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
      .and("have.attr", "href", "/tracker");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ChestXrayPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayPage {
    this.verifyPageLoaded();
    this.verifyXrayQuestionDisplayed();
    this.verifyRadioButtonsDisplayed();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }
}
