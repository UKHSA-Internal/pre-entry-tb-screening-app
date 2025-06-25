//This holds all fields of the Sputum Sample Summary Page
export class CheckSputumSampleInfoPage {
  visit(): void {
    cy.visit("/check-sputum-sample-information");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Check sputum sample information and results");

    // Check summary lists are present for all samples
    cy.get(".govuk-summary-list").should("have.length.at.least", 3);
  }

  // Verify sample headings are present
  verifySampleHeadings(): void {
    cy.get("h2.govuk-heading-m").should("contain", "Sputum sample 1");
    cy.get("h2.govuk-heading-m").should("contain", "Sputum sample 2");
    cy.get("h2.govuk-heading-m").should("contain", "Sputum sample 3");
  }

  // Get summary value for a specific field within a sample section
  getSampleSummaryValue(sampleNumber: number, fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("h2", `Sputum sample ${sampleNumber}`)
      .next(".govuk-summary-list")
      .find(`dt.govuk-summary-list__key:contains("${fieldKey}")`)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value for a sample
  verifySampleSummaryValue(sampleNumber: number, fieldKey: string, expectedValue: string): void {
    this.getSampleSummaryValue(sampleNumber, fieldKey).should("eq", expectedValue);
  }

  // methid to verify "No data" is displayed for empty results
  verifySampleShowsNoData(sampleNumber: number, fieldKey: string): void {
    this.verifySampleSummaryValue(sampleNumber, fieldKey, "No data");
  }

  // Verify sample shows "No data" for both result fields
  verifySampleResultsShowNoData(sampleNumber: number): void {
    this.verifySampleShowsNoData(sampleNumber, "Smear result");
    this.verifySampleShowsNoData(sampleNumber, "Culture result");
  }

  // Verify sample has actual result data (not "No data")
  verifySampleHasResultData(
    sampleNumber: number,
    smearResult: string,
    cultureResult: string,
  ): void {
    this.verifySampleSummaryValue(sampleNumber, "Smear result", smearResult);
    this.verifySampleSummaryValue(sampleNumber, "Culture result", cultureResult);
  }

  // Verify all sample information at once
  verifyAllSampleInfo(expectedSampleData: {
    sample1: {
      dateTaken: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample2: {
      dateTaken: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample3: {
      dateTaken: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
  }): void {
    // Verify Sample 1
    this.verifySampleSummaryValue(1, "Date taken", expectedSampleData.sample1.dateTaken);
    this.verifySampleSummaryValue(
      1,
      "Collection method",
      expectedSampleData.sample1.collectionMethod,
    );

    if (expectedSampleData.sample1.smearResult) {
      this.verifySampleSummaryValue(1, "Smear result", expectedSampleData.sample1.smearResult);
    } else {
      this.verifySampleShowsNoData(1, "Smear result");
    }

    if (expectedSampleData.sample1.cultureResult) {
      this.verifySampleSummaryValue(1, "Culture result", expectedSampleData.sample1.cultureResult);
    } else {
      this.verifySampleShowsNoData(1, "Culture result");
    }

    // Verify Sample 2
    this.verifySampleSummaryValue(2, "Date taken", expectedSampleData.sample2.dateTaken);
    this.verifySampleSummaryValue(
      2,
      "Collection method",
      expectedSampleData.sample2.collectionMethod,
    );

    if (expectedSampleData.sample2.smearResult) {
      this.verifySampleSummaryValue(2, "Smear result", expectedSampleData.sample2.smearResult);
    } else {
      this.verifySampleShowsNoData(2, "Smear result");
    }

    if (expectedSampleData.sample2.cultureResult) {
      this.verifySampleSummaryValue(2, "Culture result", expectedSampleData.sample2.cultureResult);
    } else {
      this.verifySampleShowsNoData(2, "Culture result");
    }

    // Verify Sample 3
    this.verifySampleSummaryValue(3, "Date taken", expectedSampleData.sample3.dateTaken);
    this.verifySampleSummaryValue(
      3,
      "Collection method",
      expectedSampleData.sample3.collectionMethod,
    );

    if (expectedSampleData.sample3.smearResult) {
      this.verifySampleSummaryValue(3, "Smear result", expectedSampleData.sample3.smearResult);
    } else {
      this.verifySampleShowsNoData(3, "Smear result");
    }

    if (expectedSampleData.sample3.cultureResult) {
      this.verifySampleSummaryValue(3, "Culture result", expectedSampleData.sample3.cultureResult);
    } else {
      this.verifySampleShowsNoData(3, "Culture result");
    }
  }

  // Method for mixed scenarios (some samples with data, some without)
  verifyMixedSampleScenario(samplesWithData: {
    sample1?: { smearResult: string; cultureResult: string };
    sample2?: { smearResult: string; cultureResult: string };
    sample3?: { smearResult: string; cultureResult: string };
  }): void {
    // Check sample 1
    if (samplesWithData.sample1) {
      this.verifySampleHasResultData(
        1,
        samplesWithData.sample1.smearResult,
        samplesWithData.sample1.cultureResult,
      );
    } else {
      this.verifySampleResultsShowNoData(1);
    }

    // Check sample 2
    if (samplesWithData.sample2) {
      this.verifySampleHasResultData(
        2,
        samplesWithData.sample2.smearResult,
        samplesWithData.sample2.cultureResult,
      );
    } else {
      this.verifySampleResultsShowNoData(2);
    }

    // Check sample 3
    if (samplesWithData.sample3) {
      this.verifySampleHasResultData(
        3,
        samplesWithData.sample3.smearResult,
        samplesWithData.sample3.cultureResult,
      );
    } else {
      this.verifySampleResultsShowNoData(3);
    }
  }

  // Verify only first sample has data
  verifyOnlyFirstSampleHasData(smearResult: string, cultureResult: string): void {
    this.verifySampleHasResultData(1, smearResult, cultureResult);
    this.verifySampleResultsShowNoData(2);
    this.verifySampleResultsShowNoData(3);
  }

  // Verify first and second samples have data, third shows "No data"
  verifyFirstTwoSamplesHaveData(
    sample1: { smearResult: string; cultureResult: string },
    sample2: { smearResult: string; cultureResult: string },
  ): void {
    this.verifySampleHasResultData(1, sample1.smearResult, sample1.cultureResult);
    this.verifySampleHasResultData(2, sample2.smearResult, sample2.cultureResult);
    this.verifySampleResultsShowNoData(3);
  }

  // Check if a specific field has a "Change" link for a sample
  checkSampleChangeLink(sampleNumber: number, fieldKey: string): Cypress.Chainable {
    return cy
      .contains("h2", `Sputum sample ${sampleNumber}`)
      .next(".govuk-summary-list")
      .find(`dt.govuk-summary-list__key:contains("${fieldKey}")`)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change");
  }

  // Click on change link for a specific field in a sample
  clickSampleChangeLink(sampleNumber: number, fieldKey: string): void {
    this.checkSampleChangeLink(sampleNumber, fieldKey).click();
  }

  // Verify change links exist for results only when data is present
  verifyChangeLinksForResultsWithData(sampleNumber: number): void {
    // Check if smear result has data
    this.getSampleSummaryValue(sampleNumber, "Smear result").then((smearValue) => {
      if (smearValue !== "No data") {
        this.checkSampleChangeLink(sampleNumber, "Smear result");
      }
    });

    // Check if culture result has data
    this.getSampleSummaryValue(sampleNumber, "Culture result").then((cultureValue) => {
      if (cultureValue !== "No data") {
        this.checkSampleChangeLink(sampleNumber, "Culture result");
      }
    });
  }

  // Verify change links exist for collection information
  verifyChangeLinksForCollectionInfo(sampleNumber: number): void {
    this.checkSampleChangeLink(sampleNumber, "Date taken");
    this.checkSampleChangeLink(sampleNumber, "Collection method");
  }

  // Verify all change links exist with correct URLs
  verifyChangeLinksExist(): void {
    // Sample 1 change links
    this.verifySampleChangeLinks(1, {
      "Date taken": "/sputum-collection",
      "Collection method": "/sputum-collection",
      "Smear result": "/enter-sputum-sample-results",
      "Culture result": "/enter-sputum-sample-results",
    });

    // Sample 2 change links
    this.verifySampleChangeLinks(2, {
      "Date taken": "/sputum-collection",
      "Collection method": "/sputum-collection",
      "Smear result": "/enter-sputum-sample-results",
      "Culture result": "/enter-sputum-sample-results",
    });

    // Sample 3 change links
    this.verifySampleChangeLinks(3, {
      "Date taken": "/sputum-collection",
      "Collection method": "/sputum-collection",
      "Smear result": "/enter-sputum-sample-results",
      "Culture result": "/enter-sputum-sample-results",
    });
  }

  // Helper method to verify change links for a specific sample
  private verifySampleChangeLinks(
    sampleNumber: number,
    expectedLinks: Record<string, string>,
  ): void {
    Object.entries(expectedLinks).forEach(([fieldKey, expectedHref]) => {
      cy.contains("h2", `Sputum sample ${sampleNumber}`)
        .next(".govuk-summary-list")
        .find(`dt.govuk-summary-list__key:contains("${fieldKey}")`)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("contain", "Change")
        .and("have.attr", "href", expectedHref);
    });
  }

  // Verify change links work by clicking and checking URL
  testChangeLinksNavigation(): void {
    // Test collection change link (sample 1)
    this.clickSampleChangeLink(1, "Date taken");
    cy.url().should("include", "/sputum-collection");
    cy.go("back");

    // Test results change link (sample 1) - only if data exists
    this.getSampleSummaryValue(1, "Smear result").then((smearValue) => {
      if (smearValue !== "No data") {
        this.clickSampleChangeLink(1, "Smear result");
        cy.url().should("include", "/enter-sputum-sample-results");
        cy.go("back");
      }
    });
  }

  // Get all sample data from the summary
  getAllSampleData(): Cypress.Chainable<{
    sample1: Record<string, string>;
    sample2: Record<string, string>;
    sample3: Record<string, string>;
  }> {
    return cy.then(() => {
      const sampleData = {
        sample1: {} as Record<string, string>,
        sample2: {} as Record<string, string>,
        sample3: {} as Record<string, string>,
      };

      // Extract data for each sample
      [1, 2, 3].forEach((sampleNum) => {
        cy.contains("h2", `Sputum sample ${sampleNum}`)
          .next(".govuk-summary-list")
          .within(() => {
            cy.get(".govuk-summary-list__row").each(($row) => {
              const key = $row.find(".govuk-summary-list__key").text().trim();
              const value = $row.find(".govuk-summary-list__value").text().trim();
              sampleData[`sample${sampleNum}` as keyof typeof sampleData][key] = value;
            });
          });
      });

      return sampleData;
    });
  }

  // Verify all required fields are present for each sample
  verifyRequiredFieldsPresent(): void {
    const requiredFields = ["Date taken", "Collection method", "Smear result", "Culture result"];

    [1, 2, 3].forEach((sampleNum) => {
      requiredFields.forEach((field) => {
        cy.contains("h2", `Sputum sample ${sampleNum}`)
          .next(".govuk-summary-list")
          .find(`dt.govuk-summary-list__key:contains("${field}")`)
          .should("be.visible");
      });
    });
  }

  // Click Save and Continue button
  clickSaveAndContinue(): void {
    cy.contains("button", "Save and continue").should("be.visible").click();
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
  }

  // Get the current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): void {
    this.clickSaveAndContinue();
    cy.url().should("include", expectedUrlPath);
  }

  // Comprehensive page verification
  verifyAllPageElements(expectedSampleData?: {
    sample1: {
      dateTaken: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample2: {
      dateTaken: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample3: {
      dateTaken: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
  }): void {
    this.verifyPageLoaded();
    this.verifySampleHeadings();
    this.verifyRequiredFieldsPresent();
    this.verifyChangeLinksExist();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();

    if (expectedSampleData) {
      this.verifyAllSampleInfo(expectedSampleData);
    }
  }

  // Validate sample data format
  validateSampleDataFormat(): void {
    // Verify date format (DD/MM/YYYY)
    [1, 2, 3].forEach((sampleNum) => {
      this.getSampleSummaryValue(sampleNum, "Date taken").should("match", /^\d{2}\/\d{2}\/\d{4}$/);
    });

    // Verify collection method values
    const validCollectionMethods = ["Coughed up", "Induced"];
    [1, 2, 3].forEach((sampleNum) => {
      this.getSampleSummaryValue(sampleNum, "Collection method").should(
        "be.oneOf",
        validCollectionMethods,
      );
    });

    // Verify result values
    const validResults = ["Negative", "Positive", "Inconclusive", "No data"];
    [1, 2, 3].forEach((sampleNum) => {
      this.getSampleSummaryValue(sampleNum, "Smear result").should("be.oneOf", validResults);
      this.getSampleSummaryValue(sampleNum, "Culture result").should("be.oneOf", validResults);
    });
  }

  // Check that Save and Continue button is enabled
  verifySaveAndContinueButton(): void {
    cy.contains("button", "Save and continue")
      .should("be.visible")
      .and("be.enabled")
      .and("have.attr", "type", "submit");
  }

  // Verify sample from scenario where sample 1 is Negative for smear and is positive for culture
  verifyScenarioFromImages(): void {
    // Sample 1 should have: Negative smear, Positive culture
    this.verifySampleHasResultData(1, "Negative", "Positive");

    // No Data for the other fields - Samples 2 and 3 should show "No data" for results
    this.verifySampleResultsShowNoData(2);
    this.verifySampleResultsShowNoData(3);
  }

  // Verify mixed scenario where different samples have different completion states
  verifyMixedCompletionScenario(completedSamples: number[]): void {
    [1, 2, 3].forEach((sampleNum) => {
      if (completedSamples.includes(sampleNum)) {
        // Sample should have actual result data
        this.getSampleSummaryValue(sampleNum, "Smear result").should("not.eq", "No data");
        this.getSampleSummaryValue(sampleNum, "Culture result").should("not.eq", "No data");
      } else {
        // Sample should show "No data"
        this.verifySampleResultsShowNoData(sampleNum);
      }
    });
  }

  // Helper method to count how many samples have result data
  countSamplesWithResultData(): Cypress.Chainable<number> {
    return cy.then(() => {
      let count = 0;

      [1, 2, 3].forEach((sampleNum) => {
        this.getSampleSummaryValue(sampleNum, "Smear result").then((smearValue) => {
          this.getSampleSummaryValue(sampleNum, "Culture result").then((cultureValue) => {
            if (smearValue !== "No data" && cultureValue !== "No data") {
              count++;
            }
          });
        });
      });

      return cy.wrap(count);
    });
  }

  // Verify at least one sample has result data (in line with the AC)
  verifyAtLeastOneSampleHasResultData(): void {
    this.countSamplesWithResultData().should("be.at.least", 1);
  }
}
