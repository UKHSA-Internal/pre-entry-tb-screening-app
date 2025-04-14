import { BasePage } from "../BasePage";

export class ChestXrayPage extends BasePage {
  constructor() {
    super("/chest-xray");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayPage {
    this.verifyPageHeading("Select X-ray status");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): ChestXrayPage {
    this.verifySummaryValues(expectedValues);
    return this;
  }

  // Verify X-ray question is displayed
  verifyXrayQuestionDisplayed(): ChestXrayPage {
    cy.contains("h2", "Has the visa applicant had a chest X-ray?").should("be.visible");
    cy.get(".govuk-fieldset__legend")
      .contains("This would typically be the postero-anterior chest X-ray")
      .should("be.visible");
    return this;
  }

  // Select "Yes" for X-ray taken
  selectXrayTakenYes(): ChestXrayPage {
    this.checkRadio("chestXrayTaken", "Yes");
    return this;
  }

  // Select "No" for X-ray taken
  selectXrayTakenNo(): ChestXrayPage {
    this.checkRadio("chestXrayTaken", "No");
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
    super.submitForm("Continue");
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

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): ChestXrayPage {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyXrayQuestionDisplayed();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }
}
