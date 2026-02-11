// This holds all fields of the Medical History: Under 11 Years Old Page

import { BasePage } from "../BasePageNew";
import { ButtonHelper, ErrorHelper, FormHelper, GdsComponentHelper } from "../helpers";

// Interface for under-11 medical history form data
interface UnderElevenMedicalHistoryFormData {
  conditions?: string[];
  conditionsDetail?: string;
}

export class MedicalHistoryUnderElevenPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();

  constructor() {
    super("/medical-history-under-11-years-old");
  }

  // Verify Medical History Under 11 Page
  verifyPageLoaded(): MedicalHistoryUnderElevenPage {
    cy.url().should("include", "/medical-history-under-11-years-old");
    cy.get("h1.govuk-heading-l").should("contain", "Medical history: under 11 years old");
    cy.contains("h2", "Has the visa applicant ever had:").should("be.visible");
    return this;
  }

  // Verify page heading
  verifyPageHeading(): MedicalHistoryUnderElevenPage {
    cy.get("h1.govuk-heading-l").should("contain", "Medical history: under 11 years old");
    return this;
  }

  // Select conditions checkboxes
  selectCondition(condition: string): MedicalHistoryUnderElevenPage {
    cy.get(`input[name="underElevenConditions"][value="${condition}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    cy.log(`Selected condition: ${condition}`);
    return this;
  }

  // Select multiple conditions
  selectConditions(conditions: string[]): MedicalHistoryUnderElevenPage {
    conditions.forEach((condition) => {
      this.selectCondition(condition);
    });
    return this;
  }

  // Select "None of these" option
  selectNoneOfThese(): MedicalHistoryUnderElevenPage {
    cy.get('input[name="underElevenConditions"][data-behaviour="exclusive"]')
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    cy.log("Selected: None of these");
    return this;
  }

  // Verify specific condition checkbox is present
  verifyConditionPresent(condition: string): MedicalHistoryUnderElevenPage {
    cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("exist");
    return this;
  }

  // Verify all condition options are present
  verifyAllConditionsPresent(): MedicalHistoryUnderElevenPage {
    const expectedConditions = [
      "Thoracic surgery",
      "Cyanosis",
      "Chronic respiratory disease",
      "Respiratory insufficiency that limits activity",
      "None of these",
    ];

    expectedConditions.forEach((condition) => {
      if (condition === "None of these") {
        cy.get('input[name="underElevenConditions"][data-behaviour="exclusive"]').should("exist");
      } else {
        cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("exist");
      }
    });
    return this;
  }

  // Fill conditions detail textarea
  fillConditionsDetail(text: string): MedicalHistoryUnderElevenPage {
    cy.get('[data-testid="under-eleven-conditions-detail"]').clear().type(text);
    return this;
  }

  // Verify conditions detail field is visible
  verifyConditionsDetailVisible(): MedicalHistoryUnderElevenPage {
    cy.get('[data-testid="under-eleven-conditions-detail"]').should("be.visible");
    return this;
  }

  // Fill the entire form at once
  fillCompleteForm(data: UnderElevenMedicalHistoryFormData): MedicalHistoryUnderElevenPage {
    if (data.conditions && data.conditions.length > 0) {
      // Check if "None of these" is in the list
      if (data.conditions.includes("None of these")) {
        this.selectNoneOfThese();
      } else {
        this.selectConditions(data.conditions);
      }
    }

    if (data.conditionsDetail) {
      this.fillConditionsDetail(data.conditionsDetail);
    }

    return this;
  }

  // Form submission methods
  submitForm(): MedicalHistoryUnderElevenPage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Alias for submitForm
  clickContinue(): MedicalHistoryUnderElevenPage {
    return this.submitForm();
  }

  // Click continue button
  clickContinueButton(): void {
    cy.get('button[type="submit"]').contains("Continue").click();
  }

  // Click the back link
  clickBack(): void {
    cy.get(".govuk-back-link").click();
  }

  // Verify Back link
  verifyBackLink(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/record-medical-history-tb-symptoms")
      .and("contain", "Back");
    return this;
  }

  // Error validation methods
  validateErrorSummaryVisible(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary__title").should("contain", "There is a problem");
    return this;
  }

  validateErrorSummaryNotVisible(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-error-summary").should("not.exist");
    return this;
  }

  // Verify field-level error
  verifyFieldError(fieldId: string): MedicalHistoryUnderElevenPage {
    cy.get(`#${fieldId}`).should("have.class", "govuk-form-group--error");
    return this;
  }

  // Validate specific error message
  validateErrorMessage(...expectedTexts: string[]): MedicalHistoryUnderElevenPage {
    this.validateErrorSummaryVisible();

    cy.get(".govuk-error-summary__list").then(($list) => {
      const listText = $list.text();

      expectedTexts.forEach((expectedText) => {
        cy.wrap(listText).should(
          "include",
          expectedText,
          `Expected error message "${expectedText}" not found in error summary`,
        );
      });
    });

    return this;
  }

  // Verify error message for a specific field
  verifyErrorMessage(fieldId: string, expectedMessage: string): MedicalHistoryUnderElevenPage {
    cy.get(`#${fieldId}-error`).should("contain.text", expectedMessage);
    return this;
  }

  // Verify Service Name
  verifyServiceName(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify footer
  verifyFooter(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-footer").should("be.visible");
    return this;
  }

  // Click the sign out link
  clickSignOut(): void {
    cy.get("#sign-out").click();
  }

  // Verify hint text
  verifyHintText(): MedicalHistoryUnderElevenPage {
    cy.contains("Select all that apply").should("be.visible");
    return this;
  }

  // Verify fieldset legend
  verifyFieldsetLegend(): MedicalHistoryUnderElevenPage {
    cy.contains("h2", "Has the visa applicant ever had:").should("be.visible");
    return this;
  }

  // Verify optional label on details field
  verifyOptionalLabel(): MedicalHistoryUnderElevenPage {
    cy.contains("Give further details (optional)").should("be.visible");
    return this;
  }

  // Verify all main form elements are present
  verifyAllFieldsPresent(): MedicalHistoryUnderElevenPage {
    cy.get("#under-eleven-conditions").should("be.visible");
    cy.get("#under-eleven-conditions-detail").should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    return this;
  }

  // Clear all form fields
  clearAllFields(): MedicalHistoryUnderElevenPage {
    // Uncheck all checkboxes
    cy.get('input[name="underElevenConditions"]:checked').uncheck({ force: true });

    // Clear textarea
    cy.get('[data-testid="under-eleven-conditions-detail"]').clear();

    return this;
  }

  // Verify a condition is checked
  verifyConditionChecked(condition: string): MedicalHistoryUnderElevenPage {
    cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("be.checked");
    return this;
  }

  // Verify a condition is not checked
  verifyConditionNotChecked(condition: string): MedicalHistoryUnderElevenPage {
    cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("not.be.checked");
    return this;
  }

  // Verify "None of these" exclusive behavior
  verifyNoneOfTheseExclusiveBehavior(): MedicalHistoryUnderElevenPage {
    // Select a regular condition first
    this.selectCondition("Cyanosis");
    this.verifyConditionChecked("Cyanosis");

    // Then select "None of these"
    this.selectNoneOfThese();

    // Verify the previous selection is unchecked
    this.verifyConditionNotChecked("Cyanosis");

    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): MedicalHistoryUnderElevenPage {
    this.verifyPageLoaded();
    this.verifyPageHeading();
    this.verifyFieldsetLegend();
    this.verifyHintText();
    this.verifyAllConditionsPresent();
    this.verifyOptionalLabel();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify phase banner
  verifyPhaseBanner(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag").should("contain", "BETA");
    return this;
  }

  // Verify feedback link
  verifyFeedbackLink(): MedicalHistoryUnderElevenPage {
    cy.get(".govuk-phase-banner")
      .find("a")
      .should("contain", "give your feedback")
      .and("have.attr", "target", "_blank");
    return this;
  }
}
