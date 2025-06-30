// This holds all the fields on the Sputum Collection Page
import { BasePage } from "../BasePage";

// Interface for date data
interface DateData {
  day: string;
  month: string;
  year: string;
}

// Interface for sample data
interface SampleData {
  date: DateData;
  collectionMethod: string;
}

// Interface for all samples data
interface AllSamplesData {
  sample1: SampleData;
  sample2: SampleData;
  sample3: SampleData;
}

export class SputumCollectionPage extends BasePage {
  constructor() {
    super("/sputum-collection");
  }

  // Static test data for dates
  static getTestDateData(): { [key: string]: DateData } {
    return {
      validDate1: { day: "15", month: "06", year: "2024" },
      validDate2: { day: "20", month: "07", year: "2024" },
      validDate3: { day: "25", month: "08", year: "2024" },
      todayDate: {
        day: new Date().getDate().toString().padStart(2, "0"),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        year: new Date().getFullYear().toString(),
      },
      pastDate: { day: "01", month: "01", year: "2023" },
      futureDate: { day: "31", month: "12", year: "2025" },
      invalidDate: { day: "32", month: "13", year: "2030" },
      partialDate: { day: "15", month: "", year: "2024" },
      emptyDate: { day: "", month: "", year: "" },
    };
  }

  // Static test data for collection methods
  static getTestCollectionMethods(): string[] {
    return ["Coughed up", "Induced", "Gastric lavage", "Not known"];
  }

  // Static complete sample data for testing
  static getTestSampleData(): { [key: string]: AllSamplesData } {
    const dateData = this.getTestDateData();
    const methods = this.getTestCollectionMethods();

    return {
      validAllSamples: {
        sample1: { date: dateData.validDate1, collectionMethod: methods[0] },
        sample2: { date: dateData.validDate2, collectionMethod: methods[1] },
        sample3: { date: dateData.validDate3, collectionMethod: methods[2] },
      },
      sameMethodAllSamples: {
        sample1: { date: dateData.validDate1, collectionMethod: methods[0] },
        sample2: { date: dateData.validDate2, collectionMethod: methods[0] },
        sample3: { date: dateData.validDate3, collectionMethod: methods[0] },
      },
      mixedValidityAllSamples: {
        sample1: { date: dateData.validDate1, collectionMethod: methods[0] },
        sample2: { date: dateData.invalidDate, collectionMethod: methods[1] },
        sample3: { date: dateData.partialDate, collectionMethod: methods[2] },
      },
      emptyAllSamples: {
        sample1: { date: dateData.emptyDate, collectionMethod: "" },
        sample2: { date: dateData.emptyDate, collectionMethod: "" },
        sample3: { date: dateData.emptyDate, collectionMethod: "" },
      },
    };
  }

  // Page verification
  verifyPageLoaded(): SputumCollectionPage {
    super.verifyPageHeading("Enter sputum sample collection information");
    return this;
  }

  // Date filling methods with data-testid as selectors
  fillSample1Date(
    date: DateData | { day: string; month: string; year: string },
  ): SputumCollectionPage {
    cy.get('[data-testid="date-sample-1-taken-day"]').clear().type(date.day);
    cy.get('[data-testid="date-sample-1-taken-month"]').clear().type(date.month);
    cy.get('[data-testid="date-sample-1-taken-year"]').clear().type(date.year);
    return this;
  }

  fillSample2Date(
    date: DateData | { day: string; month: string; year: string },
  ): SputumCollectionPage {
    cy.get('[data-testid="date-sample-2-taken-day"]').clear().type(date.day);
    cy.get('[data-testid="date-sample-2-taken-month"]').clear().type(date.month);
    cy.get('[data-testid="date-sample-2-taken-year"]').clear().type(date.year);
    return this;
  }

  fillSample3Date(
    date: DateData | { day: string; month: string; year: string },
  ): SputumCollectionPage {
    cy.get('[data-testid="date-sample-3-taken-day"]').clear().type(date.day);
    cy.get('[data-testid="date-sample-3-taken-month"]').clear().type(date.month);
    cy.get('[data-testid="date-sample-3-taken-year"]').clear().type(date.year);
    return this;
  }

  //Date filling methods for backward compatibility
  fillSample1DateLegacy(day: string, month: string, year: string): SputumCollectionPage {
    return this.fillSample1Date({ day, month, year });
  }

  fillSample2DateLegacy(day: string, month: string, year: string): SputumCollectionPage {
    return this.fillSample2Date({ day, month, year });
  }

  fillSample3DateLegacy(day: string, month: string, year: string): SputumCollectionPage {
    return this.fillSample3Date({ day, month, year });
  }

  // Collection method selection
  selectSample1CollectionMethod(method: string): SputumCollectionPage {
    cy.get('[name="collectionMethodSample1"]').select(method);
    return this;
  }

  selectSample2CollectionMethod(method: string): SputumCollectionPage {
    cy.get('[name="collectionMethodSample2"]').select(method);
    return this;
  }

  selectSample3CollectionMethod(method: string): SputumCollectionPage {
    cy.get('[name="collectionMethodSample3"]').select(method);
    return this;
  }

  // Enhanced sample filling methods
  fillSample1(sampleData: SampleData): SputumCollectionPage {
    this.fillSample1Date(sampleData.date);
    this.selectSample1CollectionMethod(sampleData.collectionMethod);
    return this;
  }

  fillSample2(sampleData: SampleData): SputumCollectionPage {
    this.fillSample2Date(sampleData.date);
    this.selectSample2CollectionMethod(sampleData.collectionMethod);
    return this;
  }

  fillSample3(sampleData: SampleData): SputumCollectionPage {
    this.fillSample3Date(sampleData.date);
    this.selectSample3CollectionMethod(sampleData.collectionMethod);
    return this;
  }

  // Enhanced fill all samples method
  fillAllSamples(samples: AllSamplesData): SputumCollectionPage {
    this.fillSample1(samples.sample1);
    this.fillSample2(samples.sample2);
    this.fillSample3(samples.sample3);
    return this;
  }

  // Fill all samples method for backward compatibility
  fillAllSamplesLegacy(samples: {
    sample1: {
      day: string;
      month: string;
      year: string;
      collectionMethod: string;
    };
    sample2: {
      day: string;
      month: string;
      year: string;
      collectionMethod: string;
    };
    sample3: {
      day: string;
      month: string;
      year: string;
      collectionMethod: string;
    };
  }): SputumCollectionPage {
    // Convert legacy format to new format
    const newFormat: AllSamplesData = {
      sample1: {
        date: {
          day: samples.sample1.day,
          month: samples.sample1.month,
          year: samples.sample1.year,
        },
        collectionMethod: samples.sample1.collectionMethod,
      },
      sample2: {
        date: {
          day: samples.sample2.day,
          month: samples.sample2.month,
          year: samples.sample2.year,
        },
        collectionMethod: samples.sample2.collectionMethod,
      },
      sample3: {
        date: {
          day: samples.sample3.day,
          month: samples.sample3.month,
          year: samples.sample3.year,
        },
        collectionMethod: samples.sample3.collectionMethod,
      },
    };

    return this.fillAllSamples(newFormat);
  }

  // Quick fill methods using predefined test data
  fillWithValidTestData(): SputumCollectionPage {
    const testData = SputumCollectionPage.getTestSampleData().validAllSamples;
    return this.fillAllSamples(testData);
  }

  fillWithInvalidTestData(): SputumCollectionPage {
    const testData = SputumCollectionPage.getTestSampleData().mixedValidityAllSamples;
    return this.fillAllSamples(testData);
  }

  fillWithEmptyTestData(): SputumCollectionPage {
    const testData = SputumCollectionPage.getTestSampleData().emptyAllSamples;
    return this.fillAllSamples(testData);
  }

  // Submit methods
  clickSaveAndContinueToResults(): SputumCollectionPage {
    cy.get('button[aria-label="Save and continue to results"]').click();
    return this;
  }

  clickSaveProgress(): SputumCollectionPage {
    cy.get('button[aria-label="Save progress"]').click();
    return this;
  }

  // Error validation methods
  validateSample1DateError(expectedMessage?: string): SputumCollectionPage {
    this.validateFieldError(
      "date-sample-1-taken",
      expectedMessage || "Enter the date sample 1 was taken on",
    );
    return this;
  }

  validateSample1CollectionMethodError(expectedMessage?: string): SputumCollectionPage {
    this.validateFieldError(
      "collection-method-sample-1",
      expectedMessage || "Enter Sputum sample 1 collection method",
    );
    return this;
  }

  validateSample2DateError(expectedMessage?: string): SputumCollectionPage {
    this.validateFieldError(
      "date-sample-2-taken",
      expectedMessage || "Enter the date sample 2 was taken on",
    );
    return this;
  }

  validateSample2CollectionMethodError(expectedMessage?: string): SputumCollectionPage {
    this.validateFieldError(
      "collection-method-sample-2",
      expectedMessage || "Enter Sputum sample 2 collection method",
    );
    return this;
  }

  validateSample3DateError(expectedMessage?: string): SputumCollectionPage {
    this.validateFieldError(
      "date-sample-3-taken",
      expectedMessage || "Enter the date sample 3 was taken on",
    );
    return this;
  }

  validateSample3CollectionMethodError(expectedMessage?: string): SputumCollectionPage {
    this.validateFieldError(
      "collection-method-sample-3",
      expectedMessage || "Enter Sputum sample 3 collection method",
    );
    return this;
  }

  // Comprehensive validation method
  validateFormErrors(errors: {
    sample1Date?: string;
    sample1CollectionMethod?: string;
    sample2Date?: string;
    sample2CollectionMethod?: string;
    sample3Date?: string;
    sample3CollectionMethod?: string;
  }): SputumCollectionPage {
    if (errors.sample1Date) {
      this.validateFieldError("date-sample-1-taken", errors.sample1Date);
    }

    if (errors.sample1CollectionMethod) {
      this.validateFieldError("collection-method-sample-1", errors.sample1CollectionMethod);
    }

    if (errors.sample2Date) {
      this.validateFieldError("date-sample-2-taken", errors.sample2Date);
    }

    if (errors.sample2CollectionMethod) {
      this.validateFieldError("collection-method-sample-2", errors.sample2CollectionMethod);
    }

    if (errors.sample3Date) {
      this.validateFieldError("date-sample-3-taken", errors.sample3Date);
    }

    if (errors.sample3CollectionMethod) {
      this.validateFieldError("collection-method-sample-3", errors.sample3CollectionMethod);
    }

    return this;
  }

  // Validate specific error messages from error summary
  validateErrorSummaryContains(expectedErrors: string[]): SputumCollectionPage {
    this.validateErrorSummaryVisible();
    expectedErrors.forEach((error) => {
      cy.get(".govuk-error-summary__list").should("contain.text", error);
    });
    return this;
  }

  // Validate error summary shows all expected errors
  validateAllRequiredFieldErrors(): SputumCollectionPage {
    const expectedErrors = [
      "Enter the date sample 1 was taken on",
      "Enter Sputum sample 1 collection method",
      "Enter the date sample 2 was taken on",
      "Enter Sputum sample 2 collection method",
      "Enter the date sample 3 was taken on",
      "Enter Sputum sample 3 collection method",
    ];
    return this.validateErrorSummaryContains(expectedErrors);
  }

  // Validate error summary is visible with correct structure
  validateErrorSummaryVisible(): SputumCollectionPage {
    cy.get('[data-testid="error-summary"]').should("be.visible");
    cy.get(".govuk-error-summary__title").should("contain.text", "There is a problem");
    return this;
  }

  // Verify all fields are empty (for initial state)
  verifyAllFieldsEmpty(): SputumCollectionPage {
    // Verify date fields are empty using data-testid attributes
    cy.get('[data-testid="date-sample-1-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-1-taken-month"]').should("have.value", "");
    cy.get('[data-testid="date-sample-1-taken-year"]').should("have.value", "");

    cy.get('[data-testid="date-sample-2-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-2-taken-month"]').should("have.value", "");
    cy.get('[data-testid="date-sample-2-taken-year"]').should("have.value", "");

    cy.get('[data-testid="date-sample-3-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-3-taken-month"]').should("have.value", "");
    cy.get('[data-testid="date-sample-3-taken-year"]').should("have.value", "");

    // Verify dropdowns show "Select" option
    //cy.get('[name="collectionMethodSample1"]').should("have.value", "");
    //cy.get('[name="collectionMethodSample2"]').should("have.value", "");
    //cy.get('[name="collectionMethodSample3"]').should("have.value", "");

    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(expectedData: AllSamplesData): SputumCollectionPage {
    // Verify sample 1 data using data-testid attributes
    cy.get('[data-testid="date-sample-1-taken-day"]').should(
      "have.value",
      expectedData.sample1.date.day,
    );
    cy.get('[data-testid="date-sample-1-taken-month"]').should(
      "have.value",
      expectedData.sample1.date.month,
    );
    cy.get('[data-testid="date-sample-1-taken-year"]').should(
      "have.value",
      expectedData.sample1.date.year,
    );
    cy.get('[name="collectionMethodSample1"]').should(
      "have.value",
      expectedData.sample1.collectionMethod,
    );

    // Verify sample 2 data
    cy.get('[data-testid="date-sample-2-taken-day"]').should(
      "have.value",
      expectedData.sample2.date.day,
    );
    cy.get('[data-testid="date-sample-2-taken-month"]').should(
      "have.value",
      expectedData.sample2.date.month,
    );
    cy.get('[data-testid="date-sample-2-taken-year"]').should(
      "have.value",
      expectedData.sample2.date.year,
    );
    cy.get('[name="collectionMethodSample2"]').should(
      "have.value",
      expectedData.sample2.collectionMethod,
    );

    // Verify sample 3 data
    cy.get('[data-testid="date-sample-3-taken-day"]').should(
      "have.value",
      expectedData.sample3.date.day,
    );
    cy.get('[data-testid="date-sample-3-taken-month"]').should(
      "have.value",
      expectedData.sample3.date.month,
    );
    cy.get('[data-testid="date-sample-3-taken-year"]').should(
      "have.value",
      expectedData.sample3.date.year,
    );
    cy.get('[name="collectionMethodSample3"]').should(
      "have.value",
      expectedData.sample3.collectionMethod,
    );

    return this;
  }

  // Verify section headers are visible
  verifySectionHeaders(): SputumCollectionPage {
    cy.contains("h2", "Sputum sample 1").should("be.visible");
    cy.contains("h2", "Sputum sample 2").should("be.visible");
    cy.contains("h2", "Sputum sample 3").should("be.visible");

    // Verify column headers for each sample
    cy.contains("h3", "Date sample 1 was taken on").should("be.visible");
    cy.contains("h3", "Date sample 2 was taken on").should("be.visible");
    cy.contains("h3", "Date sample 3 was taken on").should("be.visible");
    cy.contains("h3", "Collection method").should("be.visible");

    return this;
  }

  // Verify page structure and GOV.UK components
  verifyPageStructure(): SputumCollectionPage {
    // Verify breadcrumbs
    cy.get(".govuk-breadcrumbs").should("be.visible");
    cy.get(".govuk-breadcrumbs__link").should("contain.text", "Application progress tracker");

    // Verify form structure
    cy.get("form").should("be.visible");

    // Verify all date input hints
    cy.get("#date-sample-1-taken-hint").should("contain.text", "For example, 31 3 2024");
    cy.get("#date-sample-2-taken-hint").should("contain.text", "For example, 31 3 2024");
    cy.get("#date-sample-3-taken-hint").should("contain.text", "For example, 31 3 2024");

    return this;
  }

  // Verify field error states
  verifyFieldErrorStates(): SputumCollectionPage {
    // Check that all date fields have error styling
    cy.get("#date-sample-1-taken").should("have.class", "govuk-form-group--error");
    cy.get("#date-sample-2-taken").should("have.class", "govuk-form-group--error");
    cy.get("#date-sample-3-taken").should("have.class", "govuk-form-group--error");

    // Check that all collection method fields have error styling
    cy.get("#collection-method-sample-1").should("have.class", "govuk-form-group--error");
    cy.get("#collection-method-sample-2").should("have.class", "govuk-form-group--error");
    cy.get("#collection-method-sample-3").should("have.class", "govuk-form-group--error");

    return this;
  }

  // Helper method to get collection method options
  getCollectionMethodOptions(): string[] {
    return SputumCollectionPage.getTestCollectionMethods();
  }

  // Verify redirection after form submission
  verifyRedirectionToResultsPage(): SputumCollectionPage {
    this.verifyUrlContains("/sputum-results");
    return this;
  }

  // Verify redirection to progress tracker
  verifyRedirectionToProgressTracker(): SputumCollectionPage {
    this.verifyUrlContains("/tracker");
    return this;
  }
}
