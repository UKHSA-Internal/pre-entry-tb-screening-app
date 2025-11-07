//This holds all fields of the X-ray Results and Findings Check Page
import { BasePage } from "../BasePage";

export class XRayResultsAndFindingsPage extends BasePage {
  constructor() {
    super("/check-chest-x-ray-results-findings");
  }

  // Verify page loaded
  verifyPageLoaded(): XRayResultsAndFindingsPage {
    cy.contains("h1.govuk-heading-l", "Check chest X-ray results and findings").should(
      "be.visible",
    );
    return this;
  }

  // Verify summary list is displayed
  verifySummaryListDisplayed(): XRayResultsAndFindingsPage {
    cy.get("dl.govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify all summary list rows are present
  verifyAllSummaryRows(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row").should("have.length", 3);
    return this;
  }

  // Verify Chest X-ray results row
  verifyXrayResultsRow(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(0)
      .within(() => {
        cy.get(".govuk-summary-list__key").should("contain", "Chest X-ray results");
        cy.get(".govuk-summary-list__value").should("be.visible");
        cy.get(".govuk-summary-list__actions").should("be.visible");
      });
    return this;
  }

  // Verify Chest X-ray results value
  verifyXrayResultsValue(expectedValue: string): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(0)
      .within(() => {
        cy.get(".govuk-summary-list__value").should("contain", expectedValue);
      });
    return this;
  }

  // Verify X-ray findings row
  verifyXrayFindingsRow(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(1)
      .within(() => {
        cy.get(".govuk-summary-list__key").should("contain", "X-ray findings");
        cy.get(".govuk-summary-list__value").should("be.visible");
        cy.get(".govuk-summary-list__actions").should("be.visible");
      });
    return this;
  }

  // Verify X-ray findings value contains specific finding
  verifyXrayFindingsContains(finding: string): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(1)
      .within(() => {
        cy.get(".govuk-summary-list__value").should("contain", finding);
      });
    return this;
  }

  // Verify further details row
  verifyDetailsRow(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(2)
      .within(() => {
        cy.get(".govuk-summary-list__key").should("contain", "Give further details (optional)");
        cy.get(".govuk-summary-list__value").should("be.visible");
        cy.get(".govuk-summary-list__actions").should("be.visible");
      });
    return this;
  }

  // Verify further details value
  verifyDetailsValue(expectedValue: string): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(2)
      .within(() => {
        cy.get(".govuk-summary-list__value").should("contain", expectedValue);
      });
    return this;
  }

  // Verify "Not provided" is shown for further details
  verifyDetailsNotProvided(): XRayResultsAndFindingsPage {
    return this.verifyDetailsValue("Not provided");
  }

  // Verify change link for Chest X-ray results
  verifyXrayResultsChangeLink(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(0)
      .within(() => {
        cy.get("a.govuk-link")
          .should("be.visible")
          .should("have.attr", "href", "/chest-x-ray-results#xray-result")
          .should("contain", "Change");
        cy.get(".govuk-visually-hidden").should("contain", "chest X-ray results");
      });
    return this;
  }

  // Verify change link for X-ray findings
  verifyXrayFindingsChangeLink(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(1)
      .within(() => {
        cy.get("a.govuk-link")
          .should("be.visible")
          .should("have.attr", "href", "/enter-x-ray-findings#xray-minor-findings")
          .should("contain", "Change");
        cy.get(".govuk-visually-hidden").should("contain", "X-ray findings");
      });
    return this;
  }

  // Verify change link for further details
  verifyDetailsChangeLink(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(2)
      .within(() => {
        cy.get("a.govuk-link")
          .should("be.visible")
          .should("have.attr", "href", "/enter-x-ray-findings#xray-result-detail")
          .should("contain", "Change");
        cy.get(".govuk-visually-hidden").should("contain", "further details");
      });
    return this;
  }

  // Verify all change links
  verifyAllChangeLinks(): XRayResultsAndFindingsPage {
    this.verifyXrayResultsChangeLink();
    this.verifyXrayFindingsChangeLink();
    this.verifyDetailsChangeLink();
    return this;
  }

  // Click change link for Chest X-ray results
  clickXrayResultsChange(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(0)
      .within(() => {
        cy.get("a.govuk-link").click();
      });
    return this;
  }

  // Click change link for X-ray findings
  clickXrayFindingsChange(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(1)
      .within(() => {
        cy.get("a.govuk-link").click();
      });
    return this;
  }

  // Click change link for further details
  clickDetailsChange(): XRayResultsAndFindingsPage {
    cy.get(".govuk-summary-list__row")
      .eq(2)
      .within(() => {
        cy.get("a.govuk-link").click();
      });
    return this;
  }

  // Click change link and verify redirection to Chest X-ray results page
  changeXrayResults(): XRayResultsAndFindingsPage {
    this.clickXrayResultsChange();
    cy.url().should("include", "/chest-x-ray-results#xray-result");
    return this;
  }

  // Click change link and verify redirection to X-ray findings page
  changeXrayFindings(): XRayResultsAndFindingsPage {
    this.clickXrayFindingsChange();
    cy.url().should("include", "/enter-x-ray-findings#xray-minor-findings");
    return this;
  }

  // Click change link and verify redirection to further details section
  changeFurtherDetails(): XRayResultsAndFindingsPage {
    this.clickDetailsChange();
    cy.url().should("include", "/enter-x-ray-findings#xray-result-detail");
    return this;
  }

  // Verify Save and continue button
  verifySaveAndContinueButton(): XRayResultsAndFindingsPage {
    cy.get('button[type="submit"]').should("be.visible").should("contain", "Submit and continue");
    return this;
  }

  // Click Save and continue button
  clickSaveAndContinueButton(): XRayResultsAndFindingsPage {
    cy.get('button[type="submit"]').contains("Submit and continue").click();
    return this;
  }

  // Verify back link to enter X-ray findings page
  verifyBackLink(): XRayResultsAndFindingsPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/enter-x-ray-findings")
      .should("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): XRayResultsAndFindingsPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Verify complete summary data
  verifySummaryData(data: {
    xrayResults: string;
    xrayFindings?: string[];
    furtherDetails?: string;
  }): XRayResultsAndFindingsPage {
    // Verify X-ray results
    this.verifyXrayResultsValue(data.xrayResults);

    // Verify X-ray findings if provided
    if (data.xrayFindings && data.xrayFindings.length > 0) {
      data.xrayFindings.forEach((finding) => {
        this.verifyXrayFindingsContains(finding);
      });
    }

    // Verify further details
    if (data.furtherDetails) {
      this.verifyDetailsValue(data.furtherDetails);
    } else {
      this.verifyDetailsNotProvided();
    }

    return this;
  }

  // Verify summary list structure
  verifySummaryListStructure(): XRayResultsAndFindingsPage {
    cy.get("dl.govuk-summary-list").should("be.visible");

    // Verify each row has key, value, and actions
    cy.get(".govuk-summary-list__row").each(($row) => {
      cy.wrap($row).find(".govuk-summary-list__key").should("exist");
      cy.wrap($row).find(".govuk-summary-list__value").should("exist");
      cy.wrap($row).find(".govuk-summary-list__actions").should("exist");
    });

    return this;
  }

  // Verify all row keys are present
  verifyAllRowKeys(): XRayResultsAndFindingsPage {
    const expectedKeys = [
      "Chest X-ray results",
      "X-ray findings",
      "Give further details (optional)",
    ];

    expectedKeys.forEach((key, index) => {
      cy.get(".govuk-summary-list__row")
        .eq(index)
        .within(() => {
          cy.get(".govuk-summary-list__key").should("contain", key);
        });
    });

    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): XRayResultsAndFindingsPage {
    this.verifyPageLoaded();
    this.verifySummaryListDisplayed();
    this.verifyAllSummaryRows();
    this.verifySummaryListStructure();
    this.verifyAllRowKeys();
    this.verifyXrayResultsRow();
    this.verifyXrayFindingsRow();
    this.verifyDetailsRow();
    this.verifyAllChangeLinks();
    this.verifySaveAndContinueButton();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Quick test all change links navigation
  testAllChangeLinks(): XRayResultsAndFindingsPage {
    // Test Chest X-ray results change link
    this.changeXrayResults();
    cy.go("back");

    // Test X-ray findings change link
    this.changeXrayFindings();
    cy.go("back");

    // Test further details change link
    this.changeFurtherDetails();
    cy.go("back");

    return this;
  }
}
