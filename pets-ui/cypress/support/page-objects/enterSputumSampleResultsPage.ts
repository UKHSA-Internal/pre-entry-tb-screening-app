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
  sample1?: SampleResultData;
  sample2?: SampleResultData;
  sample3?: SampleResultData;
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
      onlyFirstSampleResults: {
        sample1: { smearResult: options[0], cultureResult: options[1] },
      },
      firstAndSecondSampleResults: {
        sample1: { smearResult: options[0], cultureResult: options[0] },
        sample2: { smearResult: options[1], cultureResult: options[2] },
      },
      onlySecondSampleResults: {
        sample2: { smearResult: options[1], cultureResult: options[0] },
      },
      onlyThirdSampleResults: {
        sample3: { smearResult: options[2], cultureResult: options[1] },
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
    if (results.sample1) {
      this.fillSample1Results(results.sample1);
    }

    if (results.sample2) {
      this.fillSample2Results(results.sample2);
    }

    if (results.sample3) {
      this.fillSample3Results(results.sample3);
    }

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

  //Methods for partial data scenarios
  fillWithOnlyFirstSampleResults(): EnterSputumSampleResultsPage {
    const testData = EnterSputumSampleResultsPage.getTestSampleResultsData().onlyFirstSampleResults;
    return this.fillAllSampleResults(testData);
  }

  fillWithFirstAndSecondSampleResults(): EnterSputumSampleResultsPage {
    const testData =
      EnterSputumSampleResultsPage.getTestSampleResultsData().firstAndSecondSampleResults;
    return this.fillAllSampleResults(testData);
  }

  fillWithOnlySecondSampleResults(): EnterSputumSampleResultsPage {
    const testData =
      EnterSputumSampleResultsPage.getTestSampleResultsData().onlySecondSampleResults;
    return this.fillAllSampleResults(testData);
  }

  fillWithOnlyThirdSampleResults(): EnterSputumSampleResultsPage {
    const testData = EnterSputumSampleResultsPage.getTestSampleResultsData().onlyThirdSampleResults;
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

  // Verify sample fields are empty (default state)
  verifySample1FieldsEmpty(): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1SmearResult"]').should("have.value", "");
    cy.get('select[name="sample1CultureResult"]').should("have.value", "");
    return this;
  }

  verifySample2FieldsEmpty(): EnterSputumSampleResultsPage {
    cy.get('select[name="sample2SmearResult"]').should("have.value", "");
    cy.get('select[name="sample2CultureResult"]').should("have.value", "");
    return this;
  }

  verifySample3FieldsEmpty(): EnterSputumSampleResultsPage {
    cy.get('select[name="sample3SmearResult"]').should("have.value", "");
    cy.get('select[name="sample3CultureResult"]').should("have.value", "");
    return this;
  }

  // Verify all form selections match expected data
  verifyFormFilledWith(expectedData: AllSampleResultsData): EnterSputumSampleResultsPage {
    // Verify sample 1 results if provided
    if (expectedData.sample1) {
      this.verifySample1SmearResult(expectedData.sample1.smearResult);
      this.verifySample1CultureResult(expectedData.sample1.cultureResult);
    } else {
      this.verifySample1FieldsEmpty();
    }

    // Verify sample 2 results if provided
    if (expectedData.sample2) {
      this.verifySample2SmearResult(expectedData.sample2.smearResult);
      this.verifySample2CultureResult(expectedData.sample2.cultureResult);
    } else {
      this.verifySample2FieldsEmpty();
    }

    // Verify sample 3 results if provided
    if (expectedData.sample3) {
      this.verifySample3SmearResult(expectedData.sample3.smearResult);
      this.verifySample3CultureResult(expectedData.sample3.cultureResult);
    } else {
      this.verifySample3FieldsEmpty();
    }

    return this;
  }

  // Verify all dropdowns show default "Select" option
  verifyAllFieldsEmpty(): EnterSputumSampleResultsPage {
    cy.get('select[name="sample1SmearResult"]').should("be.visible");
    cy.get('select[name="sample1CultureResult"]').should("be.visible");
    cy.get('select[name="sample2SmearResult"]').should("be.visible");
    cy.get('select[name="sample2CultureResult"]').should("be.visible");
    cy.get('select[name="sample3SmearResult"]').should("be.visible");
    cy.get('select[name="sample3CultureResult"]').should("be.visible");
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
      expectedMessage || "Select result of smear test",
    );
    return this;
  }

  validateSample1CultureResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample1-culture-result",
      expectedMessage || "Select result of culture test",
    );
    return this;
  }

  validateSample2SmearResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample2-smear-result",
      expectedMessage || "Select result of smear test",
    );
    return this;
  }

  validateSample2CultureResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample2-culture-result",
      expectedMessage || "Select result of culture test",
    );
    return this;
  }

  validateSample3SmearResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample3-smear-result",
      expectedMessage || "Select result of smear test",
    );
    return this;
  }

  validateSample3CultureResultError(expectedMessage?: string): EnterSputumSampleResultsPage {
    this.validateFieldError(
      "sample3-culture-result",
      expectedMessage || "Select result of culture test",
    );
    return this;
  }

  // Validation for partial sample completion
  validatePartialSampleError(
    sampleNumber: number,
    fieldType: "smear" | "culture",
  ): EnterSputumSampleResultsPage {
    const fieldId = `sample${sampleNumber}-${fieldType}-result`;
    const expectedMessage = `Select a ${fieldType} result for sample ${sampleNumber}`;
    this.validateFieldError(fieldId, expectedMessage);
    return this;
  }
  // Validate error for no samples entered at all
  validateNoSamplesEnteredError(): EnterSputumSampleResultsPage {
    this.validateErrorSummaryVisible();

    // Check for each expected error message individually
    cy.get(".govuk-error-summary__list").should("contain.text", "Select result of smear test");
    cy.get(".govuk-error-summary__list").should("contain.text", "Select result of culture test");

    return this;
  }
  // Validate error for no samples entered at all
  validateNoSamplesEnteredErrorDetailed(): EnterSputumSampleResultsPage {
    this.validateErrorSummaryVisible();

    // Array of expected error messages
    const expectedErrors = ["Select result of smear test", "Select result of culture test"];

    // Check each error message exists
    expectedErrors.forEach((errorText) => {
      cy.get(".govuk-error-summary__list").should("contain.text", errorText);
    });

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

  //Validate errors in line with Business Rules - at least 1 sputum sample must be entered
  validateMinimumRequiredFieldErrors(): EnterSputumSampleResultsPage {
    const expectedErrors = ["Select result of smear test", "Select result of culture test"];
    return this.validateErrorSummaryContains(expectedErrors);
  }

  // Validate errors when sample is partially completed
  validatePartialSampleErrors(sampleNumber: number): EnterSputumSampleResultsPage {
    const expectedErrors = [
      `Select result of smear test ${sampleNumber}`,
      `Select result of culture test ${sampleNumber}`,
    ];
    return this.validateErrorSummaryContains(expectedErrors);
  }

  // Verify form validation when submitting empty form
  verifyFormValidationForEmptyForm(): EnterSputumSampleResultsPage {
    // Submit form without selecting any options
    this.clickSaveAndContinue();

    // Verify error summary is displayed
    this.validateErrorSummaryVisible();

    // Verify minimum required field error is shown
    this.validateMinimumRequiredFieldErrors();

    return this;
  }

  // Verify form validation when one sample is partially completed
  verifyFormValidationForPartialSample(sampleNumber: number): EnterSputumSampleResultsPage {
    // Submit form with partial data
    this.clickSaveAndContinue();

    // Verify error summary is displayed
    this.validateErrorSummaryVisible();

    // Verify partial sample errors are shown
    this.validatePartialSampleErrors(sampleNumber);

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

  // Check if at least one sample has both results filled
  hasAtLeastOneSampleCompleted(): Cypress.Chainable<boolean> {
    return cy
      .get('select[name="sample1SmearResult"]')
      .invoke("val")
      .then((sample1Smear) => {
        return cy
          .get('select[name="sample1CultureResult"]')
          .invoke("val")
          .then((sample1Culture) => {
            return cy
              .get('select[name="sample2SmearResult"]')
              .invoke("val")
              .then((sample2Smear) => {
                return cy
                  .get('select[name="sample2CultureResult"]')
                  .invoke("val")
                  .then((sample2Culture) => {
                    return cy
                      .get('select[name="sample3SmearResult"]')
                      .invoke("val")
                      .then((sample3Smear) => {
                        return cy
                          .get('select[name="sample3CultureResult"]')
                          .invoke("val")
                          .then((sample3Culture) => {
                            const sample1Complete = sample1Smear !== "" && sample1Culture !== "";
                            const sample2Complete = sample2Smear !== "" && sample2Culture !== "";
                            const sample3Complete = sample3Smear !== "" && sample3Culture !== "";

                            return sample1Complete || sample2Complete || sample3Complete;
                          });
                      });
                  });
              });
          });
      });
  }

  // Get current selections
  getCurrentSelections(): Cypress.Chainable<AllSampleResultsData> {
    return cy
      .get('select[name="sample1SmearResult"]')
      .invoke("val")
      .then((sample1Smear) => {
        return cy
          .get('select[name="sample1CultureResult"]')
          .invoke("val")
          .then((sample1Culture) => {
            return cy
              .get('select[name="sample2SmearResult"]')
              .invoke("val")
              .then((sample2Smear) => {
                return cy
                  .get('select[name="sample2CultureResult"]')
                  .invoke("val")
                  .then((sample2Culture) => {
                    return cy
                      .get('select[name="sample3SmearResult"]')
                      .invoke("val")
                      .then((sample3Smear) => {
                        return cy
                          .get('select[name="sample3CultureResult"]')
                          .invoke("val")
                          .then((sample3Culture) => {
                            const selections: AllSampleResultsData = {};

                            // Add sample1 if both fields are filled
                            if (sample1Smear !== "" && sample1Culture !== "") {
                              selections.sample1 = {
                                smearResult: sample1Smear as SputumResult,
                                cultureResult: sample1Culture as SputumResult,
                              };
                            }

                            // Add sample2 if both fields are filled
                            if (sample2Smear !== "" && sample2Culture !== "") {
                              selections.sample2 = {
                                smearResult: sample2Smear as SputumResult,
                                cultureResult: sample2Culture as SputumResult,
                              };
                            }

                            // Add sample3 if both fields are filled
                            if (sample3Smear !== "" && sample3Culture !== "") {
                              selections.sample3 = {
                                smearResult: sample3Smear as SputumResult,
                                cultureResult: sample3Culture as SputumResult,
                              };
                            }

                            return selections;
                          });
                      });
                  });
              });
          });
      });
  }

  // Helper method to get result options
  getResultOptions(): SputumResult[] {
    return EnterSputumSampleResultsPage.getTestResultOptions();
  }

  // Verify redirection after successful form submission
  verifyRedirectionAfterSubmission(): EnterSputumSampleResultsPage {
    this.verifyUrlContains("/check-sputum-sample-information");
    return this;
  }

  // Check if sample has partial data (one field filled, other empty)
  checkSampleHasPartialData(sampleNumber: number): Cypress.Chainable<boolean> {
    return cy
      .get(`select[name="sample${sampleNumber}SmearResult"]`)
      .invoke("val")
      .then((smear) => {
        return cy
          .get(`select[name="sample${sampleNumber}CultureResult"]`)
          .invoke("val")
          .then((culture) => {
            // Partial data means one field is filled and the other is empty
            return (smear !== "" && culture === "") || (smear === "" && culture !== "");
          });
      });
  }

  // Verify validation behaviour for specific scenarios
  verifyMinimumSampleValidation(): EnterSputumSampleResultsPage {
    // Fill only one sample partially (just smear result)
    this.selectSample1SmearResult("Negative");

    // Submit and expect partial completion error
    this.clickSaveAndContinue();
    this.validatePartialSampleErrors(1);

    return this;
  }

  // Test successful submission with minimum data
  testSuccessfulSubmissionWithMinimumData(): EnterSputumSampleResultsPage {
    // Fill only first sample completely
    this.fillWithOnlyFirstSampleResults();

    // Submit form
    this.clickSaveAndContinue();

    // Should redirect to check page
    this.verifyRedirectionAfterSubmission();

    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): EnterSputumSampleResultsPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/sputum-collection");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): EnterSputumSampleResultsPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  //Page verification
  verifyAllPageElements(): EnterSputumSampleResultsPage {
    this.verifyPageLoaded();
    this.verifyPageStructure();
    this.verifyDropdownOptions();
    this.verifySaveAndContinueButton();
    this.verifyGridLayout();
    this.verifySectionBreaks();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }
}
