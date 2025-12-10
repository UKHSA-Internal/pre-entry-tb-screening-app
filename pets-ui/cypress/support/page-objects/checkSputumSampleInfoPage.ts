//This holds all fields of the Check Sputum Collection Details and Results Page
import { BasePage } from "../BasePage";

export class CheckSputumSampleInfoPage extends BasePage {
  constructor() {
    super("/check-sputum-collection-details-results");
  }

  // Verify page loaded
  verifyPageLoaded(): CheckSputumSampleInfoPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Check sputum collection details and results");

    // Check summary lists are present for all samples
    cy.get(".govuk-summary-list").should("have.length.at.least", 3);
    return this;
  }

  // Verify sample headings are present
  verifySampleHeadings(): CheckSputumSampleInfoPage {
    cy.get("h2.govuk-heading-m").should("contain", "Sputum sample 1");
    cy.get("h2.govuk-heading-m").should("contain", "Sputum sample 2");
    cy.get("h2.govuk-heading-m").should("contain", "Sputum sample 3");
    return this;
  }

  // Verify submission heading is present
  verifySubmissionHeading(): CheckSputumSampleInfoPage {
    cy.get("h2.govuk-heading-m").should(
      "contain",
      "Now send the sputum collection details and results",
    );
    return this;
  }

  // Verify warning message about submission
  verifySubmissionWarningText(): CheckSputumSampleInfoPage {
    cy.get("p.govuk-body").should(
      "contain",
      "You will not be able to change the collection details and results after you submit this information. However, you will be able to return and complete any information that you have not provided.",
    );
    return this;
  }

  // Get summary value for a specific field within a sample section
  getSampleSummaryValue(sampleNumber: number, fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("h2", `Sputum sample ${sampleNumber}`)
      .next(".govuk-summary-list")
      .find(`dt.govuk-summary-list__key:contains("${fieldKey}")`)
      .siblings(".govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify specific summary value for a sample
  verifySampleSummaryValue(
    sampleNumber: number,
    fieldKey: string,
    expectedValue: string,
  ): CheckSputumSampleInfoPage {
    this.getSampleSummaryValue(sampleNumber, fieldKey).should("eq", expectedValue);
    return this;
  }

  // methid to verify "No data" is displayed for empty results
  verifySampleShowsNoData(sampleNumber: number, fieldKey: string): CheckSputumSampleInfoPage {
    this.verifySampleSummaryValue(sampleNumber, fieldKey, "No data");
    return this;
  }

  // Verify sample shows "No data" for both result fields
  verifySampleResultsShowNoData(sampleNumber: number): CheckSputumSampleInfoPage {
    this.verifySampleShowsNoData(sampleNumber, "Smear result");
    this.verifySampleShowsNoData(sampleNumber, "Culture result");
    return this;
  }

  // Verify sample has actual result data (not "No data")
  verifySampleHasResultData(
    sampleNumber: number,
    smearResult: string,
    cultureResult: string,
  ): CheckSputumSampleInfoPage {
    this.verifySampleSummaryValue(sampleNumber, "Smear result", smearResult);
    this.verifySampleSummaryValue(sampleNumber, "Culture result", cultureResult);
    return this;
  }

  // Verify all sample information at once
  verifyAllSampleInfo(expectedSampleData: {
    sample1: {
      dateCollected: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample2: {
      dateCollected: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample3: {
      dateCollected: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
  }): CheckSputumSampleInfoPage {
    // Verify Sample 1
    this.verifySampleSummaryValue(1, "Date collected", expectedSampleData.sample1.dateCollected);
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
    this.verifySampleSummaryValue(2, "Date collected", expectedSampleData.sample2.dateCollected);
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
    this.verifySampleSummaryValue(3, "Date collected", expectedSampleData.sample3.dateCollected);
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
    return this;
  }

  // Method for mixed scenarios (some samples with data, some without)
  verifyMixedSampleScenario(samplesWithData: {
    sample1?: { smearResult: string; cultureResult: string };
    sample2?: { smearResult: string; cultureResult: string };
    sample3?: { smearResult: string; cultureResult: string };
  }): CheckSputumSampleInfoPage {
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
    return this;
  }

  // Verify only first sample has data
  verifyOnlyFirstSampleHasData(
    smearResult: string,
    cultureResult: string,
  ): CheckSputumSampleInfoPage {
    this.verifySampleHasResultData(1, smearResult, cultureResult);
    this.verifySampleResultsShowNoData(2);
    this.verifySampleResultsShowNoData(3);
    return this;
  }

  // Verify first and second samples have data, third shows "No data"
  verifyFirstTwoSamplesHaveData(
    sample1: { smearResult: string; cultureResult: string },
    sample2: { smearResult: string; cultureResult: string },
  ): CheckSputumSampleInfoPage {
    this.verifySampleHasResultData(1, sample1.smearResult, sample1.cultureResult);
    this.verifySampleHasResultData(2, sample2.smearResult, sample2.cultureResult);
    this.verifySampleResultsShowNoData(3);
    return this;
  }

  // Check if a specific field has a "Change" link for a sample
  clickSampleChangeLink(sampleNumber: number, fieldKey: string): CheckSputumSampleInfoPage {
    cy.contains("h2", `Sputum sample ${sampleNumber}`)
      .next(".govuk-summary-list")
      .find(`dt.govuk-summary-list__key:contains("${fieldKey}")`)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Verify all three samples show "No data" for results
  verifyAllSamplesShowNoData(): CheckSputumSampleInfoPage {
    this.verifySampleResultsShowNoData(1);
    this.verifySampleResultsShowNoData(2);
    this.verifySampleResultsShowNoData(3);
    return this;
  }

  // Verify all three samples have result data
  verifyAllSamplesHaveData(
    sample1: { smearResult: string; cultureResult: string },
    sample2: { smearResult: string; cultureResult: string },
    sample3: { smearResult: string; cultureResult: string },
  ): CheckSputumSampleInfoPage {
    this.verifySampleHasResultData(1, sample1.smearResult, sample1.cultureResult);
    this.verifySampleHasResultData(2, sample2.smearResult, sample2.cultureResult);
    this.verifySampleHasResultData(3, sample3.smearResult, sample3.cultureResult);
    return this;
  }

  // Verify that change links exist for all samples
  verifyChangeLinksExist(): CheckSputumSampleInfoPage {
    // Sample 1 change links
    this.verifySampleChangeLinks(1, {
      "Date collected": "/sputum-collection-details",
      "Collection method": "/sputum-collection-details",
      "Smear result": "/sputum-results",
      "Culture result": "/sputum-results",
    });

    // Sample 2 change links
    this.verifySampleChangeLinks(2, {
      "Date collected": "/sputum-collection-details",
      "Collection method": "/sputum-collection-details",
      "Smear result": "/sputum-results",
      "Culture result": "/sputum-results",
    });

    // Sample 3 change links
    this.verifySampleChangeLinks(3, {
      "Date collected": "/sputum-collection-details",
      "Collection method": "/sputum-collection-details",
      "Smear result": "/sputum-results",
      "Culture result": "/sputum-results",
    });
    return this;
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
  testChangeLinksNavigation(): CheckSputumSampleInfoPage {
    // Test collection change link (sample 1)
    this.clickSampleChangeLink(1, "Date collected");
    cy.url().should("include", "/sputum-collection-details");
    cy.go("back");

    // Test results change link (sample 1) - only if data exists
    this.getSampleSummaryValue(1, "Smear result").then((smearValue) => {
      if (smearValue !== "No data") {
        this.clickSampleChangeLink(1, "Smear result");
        cy.url().should("include", "/sputum-results");
        cy.go("back");
      }
    });
    return this;
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
  verifyRequiredFieldsPresent(): CheckSputumSampleInfoPage {
    const requiredFields = [
      "Date collected",
      "Collection method",
      "Smear result",
      "Culture result",
    ];

    [1, 2, 3].forEach((sampleNum) => {
      requiredFields.forEach((field) => {
        cy.contains("h2", `Sputum sample ${sampleNum}`)
          .next(".govuk-summary-list")
          .find(`dt.govuk-summary-list__key:contains("${field}")`)
          .should("be.visible");
      });
    });
    return this;
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): CheckSputumSampleInfoPage {
    this.clickSaveAndContinue();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(expectedSampleData?: {
    sample1: {
      dateCollected: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample2: {
      dateCollected: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
    sample3: {
      dateCollected: string;
      collectionMethod: string;
      smearResult?: string;
      cultureResult?: string;
    };
  }): CheckSputumSampleInfoPage {
    this.verifyPageLoaded();
    this.verifySampleHeadings();
    this.verifySubmissionHeading();
    this.verifyRequiredFieldsPresent();
    this.verifyChangeLinksExist();
    this.verifyBackLink("/sputum-collection-details");
    this.verifyServiceName();

    if (expectedSampleData) {
      this.verifyAllSampleInfo(expectedSampleData);
    }
    return this;
  }

  // Validate sample data format
  validateSampleDataFormat(): CheckSputumSampleInfoPage {
    // Verify date format (DD Month YYYY)
    [1, 2, 3].forEach((sampleNum) => {
      this.getSampleSummaryValue(sampleNum, "Date collected").should(
        "match",
        /^\d{1,2}\s[A-Za-z]+\s\d{4}$/,
      );
    });

    // Verify collection method values
    const validCollectionMethods = ["Coughed up", "Induced", "Gastric lavage", "Not known"];
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
    return this;
  }

  // Check that Save and Continue button is enabled
  verifySaveAndContinueButton(): CheckSputumSampleInfoPage {
    this.verifySaveAndContinueButtonDisplayed();
    return this;
  }

  // Verify scenario where sample 1 has negative smear and positive culture, other samples show no data
  verifySample1MixedScenario(): CheckSputumSampleInfoPage {
    // Sample 1 should have: Negative smear, Positive culture
    this.verifySampleHasResultData(1, "Negative", "Positive");

    // No Data for the other fields - Samples 2 and 3 should show "No data" for results
    this.verifySampleResultsShowNoData(2);
    this.verifySampleResultsShowNoData(3);
    return this;
  }

  // Verify mixed scenario where different samples have different completion states
  verifyMixedCompletionScenario(completedSamples: number[]): CheckSputumSampleInfoPage {
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
    return this;
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
  verifyAtLeastOneSampleHasResultData(): CheckSputumSampleInfoPage {
    this.countSamplesWithResultData().should("be.at.least", 1);
    return this;
  }

  // Verify submit button is present and enabled
  verifySubmitButton(): CheckSputumSampleInfoPage {
    cy.get("button[type='submit']")
      .should("be.visible")
      .and("contain", "Submit and continue")
      .and("not.be.disabled");
    return this;
  }

  // Click submit button
  clickSubmitButton(): CheckSputumSampleInfoPage {
    cy.get("button[type='submit']")
      .contains("Save and continue")
      .filter(":visible")
      .first()
      .click();
    return this;
  }
}
