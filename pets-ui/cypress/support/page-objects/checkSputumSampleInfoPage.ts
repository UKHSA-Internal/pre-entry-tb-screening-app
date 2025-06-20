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

  // Verify all sample information at once
  verifyAllSampleInfo(expectedSampleData: {
    sample1: {
      dateTaken: string;
      collectionMethod: string;
      smearResult: string;
      cultureResult: string;
    };
    sample2: {
      dateTaken: string;
      collectionMethod: string;
      smearResult: string;
      cultureResult: string;
    };
    sample3: {
      dateTaken: string;
      collectionMethod: string;
      smearResult: string;
      cultureResult: string;
    };
  }): void {
    // Verify Sample 1
    this.verifySampleSummaryValue(1, "Date taken", expectedSampleData.sample1.dateTaken);
    this.verifySampleSummaryValue(
      1,
      "Collection method",
      expectedSampleData.sample1.collectionMethod,
    );
    this.verifySampleSummaryValue(1, "Smear result", expectedSampleData.sample1.smearResult);
    this.verifySampleSummaryValue(1, "Culture result", expectedSampleData.sample1.cultureResult);

    // Verify Sample 2
    this.verifySampleSummaryValue(2, "Date taken", expectedSampleData.sample2.dateTaken);
    this.verifySampleSummaryValue(
      2,
      "Collection method",
      expectedSampleData.sample2.collectionMethod,
    );
    this.verifySampleSummaryValue(2, "Smear result", expectedSampleData.sample2.smearResult);
    this.verifySampleSummaryValue(2, "Culture result", expectedSampleData.sample2.cultureResult);

    // Verify Sample 3
    this.verifySampleSummaryValue(3, "Date taken", expectedSampleData.sample3.dateTaken);
    this.verifySampleSummaryValue(
      3,
      "Collection method",
      expectedSampleData.sample3.collectionMethod,
    );
    this.verifySampleSummaryValue(3, "Smear result", expectedSampleData.sample3.smearResult);
    this.verifySampleSummaryValue(3, "Culture result", expectedSampleData.sample3.cultureResult);
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

    // Test results change link (sample 1)
    this.clickSampleChangeLink(1, "Smear result");
    cy.url().should("include", "/enter-sputum-sample-results");
    cy.go("back");
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
      smearResult: string;
      cultureResult: string;
    };
    sample2: {
      dateTaken: string;
      collectionMethod: string;
      smearResult: string;
      cultureResult: string;
    };
    sample3: {
      dateTaken: string;
      collectionMethod: string;
      smearResult: string;
      cultureResult: string;
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

  // Validate sample data format (dates, results etc.)
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
    const validResults = ["Negative", "Positive", "Inconclusive"];
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
}
