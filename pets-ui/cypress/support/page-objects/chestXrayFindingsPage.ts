// This holds all fields for the Chest X-ray Findings Page
import { BasePage } from "../BasePageNew";
import { FormHelper, GdsComponentHelper, ButtonHelper, ErrorHelper } from "../helpers";

// Types for X-ray findings form data
interface XrayFindingsData {
  minorFindings?: string[];
  associatedMinorFindings?: string[];
  activeTbFindings?: string[];
  xrayResultDetail?: string;
}

export class ChestXrayFindingsPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();

  constructor() {
    super("/enter-x-ray-findings");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayFindingsPage {
    cy.contains("h1.govuk-heading-l", "Enter X-ray findings").should("be.visible");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify radiographic findings section
  verifyRadiographicFindingsSection(): ChestXrayFindingsPage {
    cy.get("#radiographic-findings.govuk-form-group").should("be.visible");
    return this;
  }

  // Verify minor findings section
  verifyMinorFindingsSection(): ChestXrayFindingsPage {
    cy.contains("h2.govuk-heading-m", "Minor findings").should("be.visible");
    cy.get("#xray-minor-findings.govuk-form-group").should("be.visible");
    cy.get("#xray-minor-findings-hint").should("contain", "Select all that apply");
    cy.get('input[name="xrayMinorFindings"]').should("have.length", 5);

    // Verify all minor findings options exist and are visible
    const minorFindingsOptions = [
      "1.1 Single fibrous streak, band or scar",
      "1.2 Bony islets",
      "2.1 Pleural capping with a smooth inferior border (less than 1cm thick at all points)",
      "2.2 Unilateral or bilateral costophrenic angle blunding (below the horizontal)",
      "2.3 Calcified nodule(s) in the hilum or mediastinum with no pulmonary granulomas",
    ];

    minorFindingsOptions.forEach((option, index) => {
      cy.get(`#xray-minor-findings-option-${index}`).should("exist");
      cy.get(`label[for="xray-minor-findings-option-${index}"]`)
        .should("be.visible")
        .should("contain", option);
    });

    return this;
  }

  // Minor findings selection methods
  selectMinorFindings(findings: string[]): ChestXrayFindingsPage {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayMinorFindings"][value="${finding}"]`).then(($input) => {
        const id = $input.attr("id");
        cy.get(`label[for="${id}"]`).click();
      });
    });
    return this;
  }

  // Select minor finding by index (0-4)
  selectMinorFindingByIndex(index: number): ChestXrayFindingsPage {
    cy.get(`label[for="xray-minor-findings-option-${index}"]`).click();
    return this;
  }

  // Verify minor finding is checked
  verifyMinorFindingChecked(index: number): ChestXrayFindingsPage {
    cy.get(`#xray-minor-findings-option-${index}`).should("be.checked");
    return this;
  }

  // Verify minor findings associated with TB section
  verifyAssociatedMinorFindingsSection(): ChestXrayFindingsPage {
    cy.contains(
      "h2.govuk-heading-m",
      "Minor findings (occasionally associated with TB infection)",
    ).should("be.visible");
    cy.get("#xray-associated-minor-findings.govuk-form-group").should("be.visible");
    cy.get("#xray-associated-minor-findings-hint").should("contain", "Select all that apply");
    cy.get('input[name="xrayAssociatedMinorFindings"]').should("have.length", 5);

    // Verify all associated minor findings options exist and are visible
    const associatedFindingsOptions = [
      "3.1 Solitary granuloma (less than 1cm and of any lobe) with an unremarkable hilum",
      "3.2 Solitary granuloma (less than 1cm and of any lobe) with calcified or enlarged hilar lymph nodes",
      "3.3 Single or multiple calcified pulmonary nodules or micronodules with distinct borders",
      "3.4 Calcified pleural lesions",
      "3.5 Costophrenic angle blunting (either side above the horizontal)",
    ];

    associatedFindingsOptions.forEach((option, index) => {
      cy.get(`#xray-associated-minor-findings-option-${index}`).should("exist");
      cy.get(`label[for="xray-associated-minor-findings-option-${index}"]`)
        .should("be.visible")
        .should("contain", option);
    });

    return this;
  }

  // Minor findings associated with TB selection methods
  selectAssociatedMinorFindings(findings: string[]): ChestXrayFindingsPage {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayAssociatedMinorFindings"][value="${finding}"]`).then(($input) => {
        const id = $input.attr("id");
        cy.get(`label[for="${id}"]`).click();
      });
    });
    return this;
  }

  // Select associated minor finding by index (0-4)
  selectAssociatedMinorFindingByIndex(index: number): ChestXrayFindingsPage {
    cy.get(`label[for="xray-associated-minor-findings-option-${index}"]`).click();
    return this;
  }

  // Verify associated minor finding is checked
  verifyAssociatedMinorFindingChecked(index: number): ChestXrayFindingsPage {
    cy.get(`#xray-associated-minor-findings-option-${index}`).should("be.checked");
    return this;
  }

  // Verify active TB findings section
  verifyActiveTbFindingsSection(): ChestXrayFindingsPage {
    cy.contains(
      "h2.govuk-heading-m",
      "Findings sometimes seen in active TB (or other conditions)",
    ).should("be.visible");
    cy.get("#xray-active-tb-findings.govuk-form-group").should("be.visible");
    cy.get("#xray-active-tb-findings-hint").should("contain", "Select all that apply");
    cy.get('input[name="xrayActiveTbFindings"]').should("have.length", 8);

    // Verify all active TB findings options exist and are visible
    const activeTbFindingsOptions = [
      "4.0 Notable apical pleural capping (rough or ragged inferior border, or equal to or greater than 1cm thick at any point)",
      "4.1 Apical fibronodular, fibrocalcific lesions or apical microcalcifications",
      "4.2 Single or multiple pulmonary nodules or micronodules (noncalcified or poorly defined)",
      "4.3 Isolated hilar or mediastinal mass or lymphadenopathy (noncalcified)",
      "4.4 Single or multiple pulmonary nodules, or masses equal to or greater than 1cm",
      "4.5 Non-calcified pleural fibrosis or effusion",
      "4.6 Interstitial fibrosis, parenchymal lung disease or acute pulmonary disease",
      "4.7 Any cavitating lesion or 'fluffy' or 'soft' lesions felt likely to represent active TB",
    ];

    activeTbFindingsOptions.forEach((option, index) => {
      cy.get(`#xray-active-tb-findings-option-${index}`).should("exist");
      cy.get(`label[for="xray-active-tb-findings-option-${index}"]`)
        .should("be.visible")
        .should("contain", option); // Using 'contain' instead of exact match
    });

    return this;
  }

  // Active TB findings selection methods
  selectActiveTbFindings(findings: string[]): ChestXrayFindingsPage {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayActiveTbFindings"][value="${finding}"]`).then(($input) => {
        const id = $input.attr("id");
        cy.get(`label[for="${id}"]`).click();
      });
    });
    return this;
  }

  // Select active TB finding by index (0-7)
  selectActiveTbFindingByIndex(index: number): ChestXrayFindingsPage {
    cy.get(`label[for="xray-active-tb-findings-option-${index}"]`).click();
    return this;
  }

  // Verify active TB finding is checked
  verifyActiveTbFindingChecked(index: number): ChestXrayFindingsPage {
    cy.get(`#xray-active-tb-findings-option-${index}`).should("be.checked");
    return this;
  }

  // Verify details section
  verifyDetailsSection(): ChestXrayFindingsPage {
    cy.contains("h2.govuk-heading-m", "Give further details (optional)").should("be.visible");
    cy.get("#xray-result-detail.govuk-form-group").should("be.visible");
    cy.get('textarea[name="xrayResultDetail"]').should("be.visible");
    cy.get("#xray-result-detail-hint").should(
      "contain",
      "Add details if X-ray results are abnormal",
    );
    return this;
  }

  // Enter result details
  enterXrayResultDetails(details: string): ChestXrayFindingsPage {
    cy.get('textarea[name="xrayResultDetail"]').clear().type(details);
    return this;
  }

  // Verify X-ray result details value
  verifyXrayResultDetailsValue(expectedDetails: string): ChestXrayFindingsPage {
    cy.get('textarea[name="xrayResultDetail"]').should("have.value", expectedDetails);
    return this;
  }

  // Clear X-ray result details
  clearXrayResultDetails(): ChestXrayFindingsPage {
    cy.get('textarea[name="xrayResultDetail"]').clear();
    return this;
  }

  // Click continue button
  clickContinueButton(): ChestXrayFindingsPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Verify back link to chest X-ray results
  verifyBackLinkToChestXrayResults(): ChestXrayFindingsPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/chest-x-ray-results")
      .should("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): ChestXrayFindingsPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Verify fieldset structure
  verifyFieldsetStructure(): ChestXrayFindingsPage {
    cy.get("#xray-minor-findings fieldset.govuk-fieldset").should("be.visible");
    cy.get("#xray-associated-minor-findings fieldset.govuk-fieldset").should("be.visible");
    cy.get("#xray-active-tb-findings fieldset.govuk-check").should("be.visible");
    return this;
  }

  // Verify all checkboxes are unchecked (initial state)
  verifyAllCheckboxesUnchecked(): ChestXrayFindingsPage {
    cy.get('input[name="xrayMinorFindings"]:checked').should("not.exist");
    cy.get('input[name="xrayAssociatedMinorFindings"]:checked').should("not.exist");
    cy.get('input[name="xrayActiveTbFindings"]:checked').should("not.exist");
    return this;
  }

  // Verify form data matches expected data
  verifyFormData(expectedData: XrayFindingsData): ChestXrayFindingsPage {
    if (expectedData.xrayResultDetail) {
      cy.get('textarea[name="xrayResultDetail"]').should(
        "have.value",
        expectedData.xrayResultDetail,
      );
    }

    if (expectedData.minorFindings) {
      expectedData.minorFindings.forEach((finding) => {
        cy.get(`input[name="xrayMinorFindings"][value="${finding}"]`).should("be.checked");
      });
    }

    if (expectedData.associatedMinorFindings) {
      expectedData.associatedMinorFindings.forEach((finding) => {
        cy.get(`input[name="xrayAssociatedMinorFindings"][value="${finding}"]`).should(
          "be.checked",
        );
      });
    }

    if (expectedData.activeTbFindings) {
      expectedData.activeTbFindings.forEach((finding) => {
        cy.get(`input[name="xrayActiveTbFindings"][value="${finding}"]`).should("be.checked");
      });
    }

    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayFindingsPage {
    this.verifyPageLoaded();
    this.verifyAssociatedMinorFindingsSection();
    this.verifyActiveTbFindingsSection();
    this.verifyDetailsSection();
    this.verifyBackLinkToChestXrayResults();
    this.verifyServiceName();
    return this;
  }

  // Complete form with minor findings only
  completeFormWithMinorFindings(minorFindings: string[], details?: string): ChestXrayFindingsPage {
    if (minorFindings && minorFindings.length > 0) {
      this.selectMinorFindings(minorFindings);
    }

    if (details) {
      this.enterXrayResultDetails(details);
    }

    this.clickContinueButton();
    return this;
  }

  // Complete form with associated minor findings
  completeFormWithAssociatedMinorFindings(
    associatedFindings: string[],
    details?: string,
  ): ChestXrayFindingsPage {
    if (associatedFindings && associatedFindings.length > 0) {
      this.selectAssociatedMinorFindings(associatedFindings);
    }

    if (details) {
      this.enterXrayResultDetails(details);
    }

    this.clickContinueButton();
    return this;
  }

  // Complete form with active TB findings
  completeFormWithActiveTbFindings(
    activeTbFindings: string[],
    details?: string,
  ): ChestXrayFindingsPage {
    if (activeTbFindings && activeTbFindings.length > 0) {
      this.selectActiveTbFindings(activeTbFindings);
    }

    if (details) {
      this.enterXrayResultDetails(details);
    }

    this.clickContinueButton();
    return this;
  }

  // Complete form with all types of findings
  completeFormWithAllFindings(data: XrayFindingsData): ChestXrayFindingsPage {
    if (data.minorFindings && data.minorFindings.length > 0) {
      this.selectMinorFindings(data.minorFindings);
    }

    if (data.associatedMinorFindings && data.associatedMinorFindings.length > 0) {
      this.selectAssociatedMinorFindings(data.associatedMinorFindings);
    }

    if (data.activeTbFindings && data.activeTbFindings.length > 0) {
      this.selectActiveTbFindings(data.activeTbFindings);
    }

    if (data.xrayResultDetail) {
      this.enterXrayResultDetails(data.xrayResultDetail);
    }

    this.clickContinueButton();
    return this;
  }

  // Uncheck all checkboxes
  uncheckAllCheckboxes(): ChestXrayFindingsPage {
    // For GOV.UK checkboxes, we need to click the labels to uncheck
    cy.get('input[name="xrayMinorFindings"]:checked').each(($input) => {
      const id = $input.attr("id");
      cy.get(`label[for="${id}"]`).click();
    });

    cy.get('input[name="xrayAssociatedMinorFindings"]:checked').each(($input) => {
      const id = $input.attr("id");
      cy.get(`label[for="${id}"]`).click();
    });

    cy.get('input[name="xrayActiveTbFindings"]:checked').each(($input) => {
      const id = $input.attr("id");
      cy.get(`label[for="${id}"]`).click();
    });

    return this;
  }
}
