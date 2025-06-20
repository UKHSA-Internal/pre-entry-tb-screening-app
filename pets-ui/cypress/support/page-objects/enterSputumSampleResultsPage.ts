// This holds all fields for the Enter Sputum Sample Results Page
import { BasePage } from "../BasePage";

// Type safety for sputum result values
export type SputumResult = "Negative" | "Positive" | "Inconclusive";

// Interface for sample result data
export interface SampleResultData {
  smearResult: SputumResult;
  cultureResult: SputumResult;
}

// Interface for all sample results
export interface AllSampleResultsData {
  sample1: SampleResultData;
  sample2: SampleResultData;
  sample3: SampleResultData;
}

export class EnterSputumSampleResultsPage extends BasePage {
  constructor() {
    super("/enter-sputum-sample-results");
  }

  // Static test data for results
  static getTestResultOptions(): SputumResult[] {
    return ["Negative", "Positive", "Inconclusive"];
  }

  // Static complete sample results data for testing
  static getTestSampleResultsData(): { [key: string]: AllSampleResultsData } {
    const options = this.getTestResultOptions();

    return {
      allNegativeResults: {
        sample1: { smearResult: options[0], cultureResult: options[0] },
        sample2: { smearResult: options[0], cultureResult: options[0] },
        sample3: { smearResult: options[0], cultureResult: options[0] },
      },
      mixedResults: {
        sample1: { smearResult: options[0], cultureResult: options[1] },
        sample2: { smearResult: options[1], cultureResult: options[0] },
        sample3: { smearResult: options[2], cultureResult: options[2] },
      },
      allPositiveResults: {
        sample1: { smearResult: options[1], cultureResult: options[1] },
        sample2: { smearResult: options[1], cultureResult: options[1] },
        sample3: { smearResult: options[1], cultureResult: options[1] },
      },
      allInconclusiveResults: {
        sample1: { smearResult: options[2], cultureResult: options[2] },
        sample2: { smearResult: options[2], cultureResult: options[2] },
        sample3: { smearResult: options[2], cultureResult: options[2] },
      },
    };
  }

  // Page verification
  verifyPageLoaded(): EnterSputumSampleResultsPage {
    super.verifyPageHeading("Enter sputum sample results");
    this.verifyFormVisible();
    return this;
  }

  // Verify form is visible and properly structured
  verifyFormVisible(): EnterSputumSampleResultsPage {
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify page structure and headers
  verifyPageStructure(): EnterSputumSampleResultsPage {
    // Verify main heading
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain.text", "Enter sputum sample results");

    // Verify table headers
    cy.contains("strong", "Sample").should("be.visible");
    cy.contains("strong", "Smear result").should("be.visible");
    cy.contains("strong", "Culture result").should("be.visible");

    // Verify sample dates are displayed
    cy.contains("span", "10 March 2025").should("be.visible");
    cy.contains("span", "11 March 2025").should("be.visible");
    cy.contains("span", "12 March 2025").should("be.visible");

    return this;
  }

  // Sample 1 result selection methods
  selectSample1SmearResult(result: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1SmearResult"]').select(result);
    return this;
  }

  selectSample1CultureResult(result: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1CultureResult"]').select(result);
    return this;
  }

  // Sample 2 result selection methods
  selectSample2SmearResult(result: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample2SmearResult"]').select(result);
    return this;
  }

  selectSample2CultureResult(result: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample2CultureResult"]').select(result);
    return this;
  }

  // Sample 3 result selection methods
  selectSample3SmearResult(result: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample3SmearResult"]').select(result);
    return this;
  }

  selectSample3CultureResult(result: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample3CultureResult"]').select(result);
    return this;
  }

  // Sample result filling methods
  fillSample1Results(sampleData: SampleResultData): EnterSputumSampleResultsPage {
    this.selectSample1SmearResult(sampleData.smearResult);
    this.selectSample1CultureResult(sampleData.cultureResult);
    return this;
  }

  fillSample2Results(sampleData: SampleResultData): EnterSputumSampleResultsPage {
    this.selectSample2SmearResult(sampleData.smearResult);
    this.selectSample2CultureResult(sampleData.cultureResult);
    return this;
  }

  fillSample3Results(sampleData: SampleResultData): EnterSputumSampleResultsPage {
    this.selectSample3SmearResult(sampleData.smearResult);
    this.selectSample3CultureResult(sampleData.cultureResult);
    return this;
  }

  // Fill all sample results
  fillAllSampleResults(results: AllSampleResultsData): EnterSputumSampleResultsPage {
    this.fillSample1Results(results.sample1);
    this.fillSample2Results(results.sample2);
    this.fillSample3Results(results.sample3);
    return this;
  }

  // Form fill methods using predefined test data
  fillWithAllNegativeResults(): EnterSputumSampleResultsPage {
    const testData = EnterSputumSampleResultsPage.getTestSampleResultsData().allNegativeResults;
    return this.fillAllSampleResults(testData);
  }

  fillWithMixedResults(): EnterSputumSampleResultsPage {
    const testData = EnterSputumSampleResultsPage.getTestSampleResultsData().mixedResults;
    return this.fillAllSampleResults(testData);
  }

  fillWithAllPositiveResults(): EnterSputumSampleResultsPage {
    const testData = EnterSputumSampleResultsPage.getTestSampleResultsData().allPositiveResults;
    return this.fillAllSampleResults(testData);
  }

  fillWithAllInconclusiveResults(): EnterSputumSampleResultsPage {
    const testData = EnterSputumSampleResultsPage.getTestSampleResultsData().allInconclusiveResults;
    return this.fillAllSampleResults(testData);
  }

  // Verify current selections
  verifySample1SmearResult(expectedResult: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1SmearResult"]').should("have.value", expectedResult);
    return this;
  }

  verifySample1CultureResult(expectedResult: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1CultureResult"]').should("have.value", expectedResult);
    return this;
  }

  verifySample2SmearResult(expectedResult: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample2SmearResult"]').should("have.value", expectedResult);
    return this;
  }

  verifySample2CultureResult(expectedResult: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample2CultureResult"]').should("have.value", expectedResult);
    return this;
  }

  verifySample3SmearResult(expectedResult: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample3SmearResult"]').should("have.value", expectedResult);
    return this;
  }

  verifySample3CultureResult(expectedResult: SputumResult): EnterSputumSampleResultsPage {
    cy.get('select[name="sample3CultureResult"]').should("have.value", expectedResult);
    return this;
  }

  // Verify all form selections match expected data
  verifyFormFilledWith(expectedData: AllSampleResultsData): EnterSputumSampleResultsPage {
    // Verify sample 1 results
    this.verifySample1SmearResult(expectedData.sample1.smearResult);
    this.verifySample1CultureResult(expectedData.sample1.cultureResult);

    // Verify sample 2 results
    this.verifySample2SmearResult(expectedData.sample2.smearResult);
    this.verifySample2CultureResult(expectedData.sample2.cultureResult);

    // Verify sample 3 results
    this.verifySample3SmearResult(expectedData.sample3.smearResult);
    this.verifySample3CultureResult(expectedData.sample3.cultureResult);

    return this;
  }

  // Verify all dropdowns show default "Select" option
  verifyAllFieldsEmpty(): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1SmearResult"]').should("have.value", "");
    cy.get('select[name="sample1CultureResult"]').should("have.value", "");
    cy.get('select[name="sample2SmearResult"]').should("have.value", "");
    cy.get('select[name="sample2CultureResult"]').should("have.value", "");
    cy.get('select[name="sample3SmearResult"]').should("have.value", "");
    cy.get('select[name="sample3CultureResult"]').should("have.value", "");
    return this;
  }

  // Verify dropdown options are available
  verifyDropdownOptions(): EnterSputumSampleResultsPage {
    const expectedOptions = ["Select", "Negative", "Positive", "Inconclusive"];

    // Check sample 1 dropdowns
    cy.get('select[name="sample1SmearResult"] option').should("have.length", 4);
    cy.get('select[name="sample1CultureResult"] option').should("have.length", 4);

    // Check sample 2 dropdowns
    cy.get('select[name="sample2SmearResult"] option').should("have.length", 4);
    cy.get('select[name="sample2CultureResult"] option').should("have.length", 4);

    // Check sample 3 dropdowns
    cy.get('select[name="sample3SmearResult"] option').should("have.length", 4);
    cy.get('select[name="sample3CultureResult"] option').should("have.length", 4);

    // Verify specific options exist in first dropdown
    expectedOptions.forEach((option) => {
      if (option === "Select") {
        cy.get('select[name="sample1SmearResult"] option[value=""]').should("contain.text", option);
      } else {
        cy.get(`select[name="sample1SmearResult"] option[value="${option}"]`).should(
          "contain.text",
          option,
        );
      }
    });

    return this;
  }

  // Submit methods
  clickSaveAndContinue(): EnterSputumSampleResultsPage {
    cy.get('button[type="submit"]').contains("Save and continue").click();
    return this;
  }

  // Alternative method name for consistency
  submitForm(): EnterSputumSampleResultsPage {
    return this.clickSaveAndContinue();
  }

  // Verify save and continue button
  verifySaveAndContinueButton(): EnterSputumSampleResultsPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Save and continue");
    return this;
  }

  // Error validation methods
  validateSample1SmearResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample1-smear-result",
      expectedMessage || "Select a smear result for sample 1",
    );
    return this;
  }

  validateSample1CultureResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample1-culture-result",
      expectedMessage || "Select a culture result for sample 1",
    );
    return this;
  }

  validateSample2SmearResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample2-smear-result",
      expectedMessage || "Select a smear result for sample 2",
    );
    return this;
  }

  validateSample2CultureResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample2-culture-result",
      expectedMessage || "Select a culture result for sample 2",
    );
    return this;
  }

  validateSample3SmearResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample3-smear-result",
      expectedMessage || "Select a smear result for sample 3",
    );
    return this;
  }

  validateSample3CultureResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample3-culture-result",
      expectedMessage || "Select a culture result for sample 3",
    );
    return this;
  }

  // Comprehensive validation method
  validateFormErrors(errors: {
    sample1SmearResult?: string;
    sample1CultureResult?: string;
    sample2SmearResult?: string;
    sample2CultureResult?: string;
    sample3SmearResult?: string;
    sample3CultureResult?: string;
  }): EnterSputumSampleResultsPage {
    if (errors.sample1SmearResult) {
      this.validateSample1SmearResultError(errors.sample1SmearResult);
    }

    if (errors.sample1CultureResult) {
      this.validateSample1CultureResultError(errors.sample1CultureResult);
    }

    if (errors.sample2SmearResult) {
      this.validateSample2SmearResultError(errors.sample2SmearResult);
    }

    if (errors.sample2CultureResult) {
      this.validateSample2CultureResultError(errors.sample2CultureResult);
    }

    if (errors.sample3SmearResult) {
      this.validateSample3SmearResultError(errors.sample3SmearResult);
    }

    if (errors.sample3CultureResult) {
      this.validateSample3CultureResultError(errors.sample3CultureResult);
    }

    return this;
  }

  // Validate error summary contains expected errors
  validateErrorSummaryContains(expectedErrors: string[]): EnterSputumSampleResultsPage {
    this.validateErrorSummaryVisible();
    expectedErrors.forEach((error) => {
      cy.get(".govuk-error-summary__list").should("contain.text", error);
    });
    return this;
  }

  // Validate all required field errors
  validateAllRequiredFieldErrors(): EnterSputumSampleResultsPage {
    const expectedErrors = [
      "Select a smear result for sample 1",
      "Select a culture result for sample 1",
      "Select a smear result for sample 2",
      "Select a culture result for sample 2",
      "Select a smear result for sample 3",
      "Select a culture result for sample 3",
    ];
    return this.validateErrorSummaryContains(expectedErrors);
  }

  // Verify form validation when submitting empty form
  verifyFormValidation(): EnterSputumSampleResultsPage {
    // Submit form without selecting any options
    this.clickSaveAndContinue();

    // Verify error summary is displayed
    this.validateErrorSummaryVisible();

    // Verify all required field errors are shown
    this.validateAllRequiredFieldErrors();

    return this;
  }

  // Verify sample dates are correctly displayed
  verifySampleDates(): EnterSputumSampleResultsPage {
    cy.contains(".govuk-grid-column-one-third span", "10 March 2025").should("be.visible");
    cy.contains(".govuk-grid-column-one-third span", "11 March 2025").should("be.visible");
    cy.contains(".govuk-grid-column-one-third span", "12 March 2025").should("be.visible");
    return this;
  }

  // Verify grid layout structure
  verifyGridLayout(): EnterSputumSampleResultsPage {
    // Verify header row
    cy.get(".govuk-grid-row")
      .first()
      .within(() => {
        cy.get(".govuk-grid-column-one-third").should("have.length", 3);
      });

    // Verify data rows for each sample
    cy.get(".govuk-grid-row").should("have.length.at.least", 4);

    return this;
  }

  // Verify section breaks between samples
  verifySectionBreaks(): EnterSputumSampleResultsPage {
    cy.get("hr.govuk-section-break").should("have.length.at.least", 3);
    return this;
  }

  // Get current selections (will be using this for my negative scenarios and error validation)
  getCurrentSelections(): Cypress.Chainable<AllSampleResultsData> {
    return cy.then(() => {
      const selections: AllSampleResultsData = {
        sample1: { smearResult: "Negative", cultureResult: "Negative" },
        sample2: { smearResult: "Negative", cultureResult: "Negative" },
        sample3: { smearResult: "Negative", cultureResult: "Negative" },
      };

      // This would need to be implemented properly with cy.get().invoke('val')
      // For now, returning a placeholder
      return selections;
    });
  }

  // Helper method to get result options
  getResultOptions(): SputumResult[] {
    return EnterSputumSampleResultsPage.getTestResultOptions();
  }

  // Verify redirection after successful form submission
  verifyRedirectionAfterSubmission(): EnterSputumSampleResultsPage {
    this.verifyUrlContains("/tracker");
    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): EnterSputumSampleResultsPage {
    this.verifyPageLoaded();
    this.verifyPageStructure();
    this.verifySampleDates();
    this.verifyDropdownOptions();
    this.verifySaveAndContinueButton();
    this.verifyGridLayout();
    this.verifySectionBreaks();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }
}
