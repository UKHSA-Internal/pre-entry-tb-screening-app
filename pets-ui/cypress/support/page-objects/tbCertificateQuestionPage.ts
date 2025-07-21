// This Page holds all fields of the TB Certificate Question Page
import { BasePage } from "../BasePage";

// Types for TB certificate question form
interface TbCertificateQuestionDetails {
  clearanceIssued: "Yes" | "No";
}

// Types for error validation
interface TbCertificateQuestionErrors {
  isIssued?: string;
}

export class TbCertificateQuestionPage extends BasePage {
  constructor() {
    super("/tb-certificate-question");
  }

  verifyPageLoaded(): TbCertificateQuestionPage {
    super.verifyPageHeading("Will you issue a TB clearance certificate?");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify radio buttons are displayed
  verifyRadioButtonsDisplayed(): TbCertificateQuestionPage {
    cy.get('input[name="isIssued"][value="Yes"]').should("be.visible");
    cy.get('input[name="isIssued"][value="No"]').should("be.visible");
    cy.contains("label", "Yes").should("be.visible");
    cy.contains("label", "No").should("be.visible");
    return this;
  }

  // Select TB clearance certificate option
  selectTbClearanceOption(option: "Yes" | "No"): TbCertificateQuestionPage {
    cy.get(`input[name="isIssued"][value="${option}"]`).check();
    return this;
  }

  // Verify current radio selection
  verifyRadioSelection(expectedOption: "Yes" | "No"): TbCertificateQuestionPage {
    cy.get(`input[name="isIssued"][value="${expectedOption}"]`).should("be.checked");
    return this;
  }

  // Verify no radio button is selected (initial state)
  verifyNoSelectionMade(): TbCertificateQuestionPage {
    cy.get('input[name="isIssued"]:checked').should("not.exist");
    return this;
  }

  // Get current form values
  getCurrentFormValues(): Cypress.Chainable<TbCertificateQuestionDetails> {
    return cy.get("body").then(() => {
      // Check if any radio button is selected
      return cy.get('input[name="isIssued"]:checked').then(($checkedRadio) => {
        const isIssued = $checkedRadio.length > 0 ? ($checkedRadio.val() as string) : "";

        const result: TbCertificateQuestionDetails = {
          clearanceIssued: isIssued as "Yes" | "No",
        };
        return result;
      });
    });
  }

  // Complete form with valid data
  fillFormWithValidData(options: TbCertificateQuestionDetails): TbCertificateQuestionPage {
    this.selectTbClearanceOption(options.clearanceIssued);
    return this;
  }

  // Submit form
  clickContinue(): TbCertificateQuestionPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Enhanced error validation
  validateFormErrors(
    expectedErrorMessages: TbCertificateQuestionErrors,
  ): TbCertificateQuestionPage {
    if (expectedErrorMessages.isIssued) {
      this.validateFieldError("tb-clearance-issued", expectedErrorMessages.isIssued);
    }
    return this;
  }

  // Verify form validation when submitting empty form
  verifyFormValidationForEmptyForm(): TbCertificateQuestionPage {
    this.clickContinue();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Submit form and verify redirection based on selection
  submitAndVerifyRedirection(selectedOption: "Yes" | "No"): TbCertificateQuestionPage {
    this.clickContinue();

    // Verify redirection based on the selected option
    if (selectedOption === "Yes") {
      // If "Yes" is selected, should go to TB Certificate Declaration page
      this.verifyUrlContains("/tb-certificate-declaration");
    } else {
      // If "No" is selected
      this.verifyUrlContains("/tb-certificate-summary");
    }
    return this;
  }

  // Submit form with data and continue
  submitFormWithData(options: TbCertificateQuestionDetails): TbCertificateQuestionPage {
    this.fillFormWithValidData(options);
    this.clickContinue();
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): TbCertificateQuestionPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tracker");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificateQuestionPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Verify continue button is displayed
  verifyContinueButton(): TbCertificateQuestionPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Continue");
    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(expectedData: TbCertificateQuestionDetails): TbCertificateQuestionPage {
    if (expectedData.clearanceIssued) {
      this.verifyRadioSelection(expectedData.clearanceIssued);
    }
    return this;
  }

  // Verify form group styling and structure
  verifyFormGroupStructure(): TbCertificateQuestionPage {
    cy.get("#tb-clearance-issued.govuk-form-group").should("be.visible");
    cy.get(".govuk-radios").should("be.visible");
    cy.get(".govuk-radios--inline").should("be.visible");
    return this;
  }

  // Verify radio button attributes
  verifyRadioButtonAttributes(): TbCertificateQuestionPage {
    // Verify "Yes" radio button
    cy.get('input[name="isIssued"][value="Yes"]')
      .should("have.attr", "type", "radio")
      .and("have.attr", "data-testid", "tb-clearance-issued")
      .and("have.attr", "id", "tb-clearance-issued-0");

    // Verify "No" radio button
    cy.get('input[name="isIssued"][value="No"]')
      .should("have.attr", "type", "radio")
      .and("have.attr", "data-testid", "tb-clearance-issued")
      .and("have.attr", "id", "tb-clearance-issued-1");

    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): TbCertificateQuestionPage {
    this.verifyPageLoaded();
    this.verifyRadioButtonsDisplayed();
    this.verifyFormGroupStructure();
    this.verifyRadioButtonAttributes();
    this.verifyContinueButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Method for quick form completion with "Yes"
  selectYesAndContinue(): TbCertificateQuestionPage {
    this.selectTbClearanceOption("Yes");
    this.clickContinue();
    return this;
  }

  // Method for quick form completion with "No"
  selectNoAndContinue(): TbCertificateQuestionPage {
    this.selectTbClearanceOption("No");
    this.clickContinue();
    return this;
  }

  // Complete form validation test
  performCompleteValidationTest(): TbCertificateQuestionPage {
    // First verify empty form validation
    this.verifyFormValidationForEmptyForm();

    // Then fill form and verify
    this.selectTbClearanceOption("Yes");
    this.verifyRadioSelection("Yes");
    this.clickContinue();

    return this;
  }

  // Test both radio button options
  testBothOptions(): TbCertificateQuestionPage {
    // Test "Yes" option
    this.selectTbClearanceOption("Yes");
    this.verifyRadioSelection("Yes");

    // Test "No" option
    this.selectTbClearanceOption("No");
    this.verifyRadioSelection("No");

    // Verify "Yes" is no longer selected
    cy.get('input[name="isIssued"][value="Yes"]').should("not.be.checked");

    return this;
  }
}
