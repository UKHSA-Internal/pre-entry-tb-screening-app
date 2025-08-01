// This holds all fields for the Chest X-ray Findings Page
import { BasePage } from "../BasePage";

// Types for X-ray findings form data
interface XrayFindingsData {
  xrayResult: "Chest X-ray normal" | "Non-TB abnormality" | "Old or active TB";
  xrayResultDetail?: string;
  minorFindings?: string[];
  associatedMinorFindings?: string[];
  activeTbFindings?: string[];
}

// Types for error validation
interface XrayFindingsErrors {
  xrayResult?: string;
  xrayResultDetail?: string;
}

export class ChestXrayFindingsPage extends BasePage {
  constructor() {
    super("/chest-xray-findings");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayFindingsPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Enter radiological outcome and findings");

    // Check the form is present
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify notification banner
  verifyNotificationBanner(): ChestXrayFindingsPage {
    cy.get(".govuk-notification-banner").should("be.visible");
    cy.get(".govuk-notification-banner__title").should("contain", "Important");
    cy.get(".govuk-notification-banner__content").should("contain", "pulmonary TB");

    // Verify specific content
    cy.get(".govuk-notification-banner__content")
      .should("contain", "If a visa applicant's chest X-rays indicate that they have pulmonary TB")
      .and("contain", "give them a referral letter and copies of the:");

    // Verify list items
    cy.get(".govuk-notification-banner__content ul li")
      .should("have.length", 3)
      .and("contain", "chest X-ray")
      .and("contain", "radiology report")
      .and("contain", "medical record form");

    return this;
  }

  // Verify radiological outcome section
  verifyRadiologicalOutcomeSection(): ChestXrayFindingsPage {
    cy.contains("h2", "Radiological outcome").should("be.visible");
    cy.get("#xray-result.govuk-form-group").should("be.visible");
    cy.get('input[name="xrayResult"]').should("have.length", 3);

    // Verify all radio button options
    cy.get('input[name="xrayResult"][value="Chest X-ray normal"]').should("be.visible");
    cy.get('input[name="xrayResult"][value="Non-TB abnormality"]').should("be.visible");
    cy.get('input[name="xrayResult"][value="Old or active TB"]').should("be.visible");

    // Verify labels
    cy.contains("label", "Chest X-ray normal").should("be.visible");
    cy.contains("label", "Non-TB abnormality").should("be.visible");
    cy.contains("label", "Old or active TB").should("be.visible");

    return this;
  }

  // Verify details section
  verifyDetailsSection(): ChestXrayFindingsPage {
    cy.contains("h3", "Details").should("be.visible");
    cy.get("#xray-result-detail.govuk-form-group").should("be.visible");
    cy.get('textarea[name="xrayResultDetail"]').should("be.visible");
    cy.get("#xray-result-detail-hint").should("contain", "Give further details (optional)");
    return this;
  }

  // Verify radiographic findings section
  verifyRadiographicFindingsSection(): ChestXrayFindingsPage {
    cy.contains("h2", "Radiographic findings").should("be.visible");
    cy.get("#radiographic-findings.govuk-form-group").should("be.visible");
    return this;
  }

  // X-ray result selection methods
  selectXrayResultNormal(): ChestXrayFindingsPage {
    cy.get('input[name="xrayResult"][value="Chest X-ray normal"]').check();
    return this;
  }

  selectXrayResultNonTbAbnormality(): ChestXrayFindingsPage {
    cy.get('input[name="xrayResult"][value="Non-TB abnormality"]').check();
    return this;
  }

  selectXrayResultOldOrActiveTb(): ChestXrayFindingsPage {
    cy.get('input[name="xrayResult"][value="Old or active TB"]').check();
    return this;
  }

  // Backward compatibility
  selectXrayResultTb(): ChestXrayFindingsPage {
    return this.selectXrayResultOldOrActiveTb();
  }

  // Enhanced method for abnormal results (for certificate not issued scenarios)
  selectXrayResultAbnormal(): ChestXrayFindingsPage {
    // For tests that need abnormal results
    return this.selectXrayResultOldOrActiveTb();
  }

  // Verify selected X-ray result
  verifyXrayResultSelection(expectedResult: string): ChestXrayFindingsPage {
    cy.get(`input[name="xrayResult"][value="${expectedResult}"]`).should("be.checked");
    return this;
  }

  // Enter result details
  enterXrayResultDetails(details: string): ChestXrayFindingsPage {
    cy.get('textarea[name="xrayResultDetail"]').clear().type(details);
    return this;
  }

  // Verify minor findings section
  verifyMinorFindingsSection(): ChestXrayFindingsPage {
    cy.contains("h3", "Minor findings").should("be.visible");
    cy.get("#xray-minor-findings.govuk-form-group").should("be.visible");
    cy.get('input[name="xrayMinorFindings"]').should("have.length", 5);

    // Verify all minor findings options exist
    const minorFindingsOptions = [
      "1.1 Single fibrous streak or band or scar",
      "1.2 Bony islets",
      "2.1 Pleural capping with a smooth inferior border (less than 1cm thick at all points)",
      "2.2 Unilateral or bilateral costophrenic angle blunding (below the horizontal)",
      "2.3 Calcified nodule(s) in the hilum or mediastinum with no pulmonary granulomas",
    ];

    minorFindingsOptions.forEach((option) => {
      cy.get(`input[name="xrayMinorFindings"][value="${option}"]`).should("be.visible");
      cy.contains("label", option).should("be.visible");
    });

    return this;
  }

  // Minor findings selection methods
  selectMinorFindings(findings: string[]): ChestXrayFindingsPage {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayMinorFindings"][value="${finding}"]`).check();
    });
    return this;
  }

  // Verify minor findings associated with TB section
  verifyAssociatedMinorFindingsSection(): ChestXrayFindingsPage {
    cy.contains("h3", "Minor findings (occasionally associated with TB infection)").should(
      "be.visible",
    );
    cy.get("#xray-associated-minor-findings.govuk-form-group").should("be.visible");
    cy.get('input[name="xrayAssociatedMinorFindings"]').should("have.length", 5);

    // Verify all associated minor findings options exist
    const associatedFindingsOptions = [
      "3.1 Solitary granuloma (less than 1cm and of any lobe) with an unremarkable hilum",
      "3.2 Solitary granuloma (less than 1cm and of any lobe) with calcified or enlarged hilar lymph nodes",
      "3.3 Single or multiple calcified pulmonary nodules or micronodulese with distinct borders",
      "3.4 Calcified pleural lesion",
      "3.5 Costophrenic angle blunting (either side above the horizontal)",
    ];

    associatedFindingsOptions.forEach((option) => {
      cy.get(`input[name="xrayAssociatedMinorFindings"][value="${option}"]`).should("be.visible");
      cy.contains("label", option).should("be.visible");
    });

    return this;
  }

  // Minor findings associated with TB selection methods
  selectAssociatedMinorFindings(findings: string[]): ChestXrayFindingsPage {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayAssociatedMinorFindings"][value="${finding}"]`).check();
    });
    return this;
  }

  // Verify active TB findings section
  verifyActiveTbFindingsSection(): ChestXrayFindingsPage {
    cy.contains("h3", "Findings sometimes seen in active TB (or other conditions)").should(
      "be.visible",
    );
    cy.get("#xray-active-tb-findings.govuk-form-group").should("be.visible");
    cy.get('input[name="xrayActiveTbFindings"]').should("have.length", 8);

    // Verify all active TB findings options exist
    const activeTbFindingsOptions = [
      "4.0 Notable apical pleural capping (rough or ragged inferior border an/or equal or greater than 1cm thick at any point)",
      "4.1 Apical fibronodular or fibrocalcific lesions or apical microcalcifications",
      "4.2 Single or multiple pulmonary nodules or micronodules (noncalcified or poorly defined)",
      "4.3 Isolated hilar or mediastinal mass or lymphadenopathy (noncalcified)",
      "4.4 Single or multiple pulmonary nodules / masses equal or greater than 1cm",
      "4.5 Non calcified pleural fibrosis or effusion",
      "4.6 Interstitial fibrosis or parenchymal lung disease and or acute pulmonary disease",
      "4.7 Any cavitating lesion or 'fluffy' or 'soft' lesions felt likely to represent active TB",
    ];

    activeTbFindingsOptions.forEach((option) => {
      cy.get(`input[name="xrayActiveTbFindings"][value="${option}"]`).should("be.visible");
      cy.contains("label", option).should("be.visible");
    });

    return this;
  }

  // Active TB findings selection methods
  selectActiveTbFindings(findings: string[]): ChestXrayFindingsPage {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayActiveTbFindings"][value="${finding}"]`).check();
    });
    return this;
  }

  // Enhanced method for major/abnormal findings (for certificate not issued scenarios)
  selectMajorFindings(findings: string[]): ChestXrayFindingsPage {
    // For backward compatibility and test readability
    return this.selectActiveTbFindings(findings);
  }

  // Get selected X-ray result
  getSelectedXrayResult(): Cypress.Chainable<string> {
    return cy
      .get('input[name="xrayResult"]:checked')
      .invoke("val")
      .then((val) => {
        return val ? String(val) : "";
      });
  }

  // Get selected findings
  getSelectedMinorFindings(): Cypress.Chainable<string[]> {
    return cy.get('input[name="xrayMinorFindings"]:checked').then(($checkboxes) => {
      const values: string[] = [];
      $checkboxes.each((_, checkbox) => {
        if (checkbox && (checkbox as HTMLInputElement).value) {
          values.push((checkbox as HTMLInputElement).value);
        }
      });
      return values;
    });
  }

  getSelectedAssociatedMinorFindings(): Cypress.Chainable<string[]> {
    return cy.get('input[name="xrayAssociatedMinorFindings"]:checked').then(($checkboxes) => {
      const values: string[] = [];
      $checkboxes.each((_, checkbox) => {
        if (checkbox && (checkbox as HTMLInputElement).value) {
          values.push((checkbox as HTMLInputElement).value);
        }
      });
      return values;
    });
  }

  getSelectedActiveTbFindings(): Cypress.Chainable<string[]> {
    return cy.get('input[name="xrayActiveTbFindings"]:checked').then(($checkboxes) => {
      const values: string[] = [];
      $checkboxes.each((_, checkbox) => {
        if (checkbox && (checkbox as HTMLInputElement).value) {
          values.push((checkbox as HTMLInputElement).value);
        }
      });
      return values;
    });
  }

  // Get all current form values
  getCurrentFormValues(): Cypress.Chainable<XrayFindingsData> {
    return cy.get("body").then(() => {
      return cy.get('input[name="xrayResult"]:checked').then(($checkedRadio) => {
        const xrayResult =
          $checkedRadio.length > 0 && $checkedRadio[0]
            ? ($checkedRadio[0] as HTMLInputElement).value
            : "";

        return cy
          .get('textarea[name="xrayResultDetail"]')
          .invoke("val")
          .then((details) => {
            return this.getSelectedMinorFindings().then((minorFindings) => {
              return this.getSelectedAssociatedMinorFindings().then((associatedMinorFindings) => {
                return this.getSelectedActiveTbFindings().then((activeTbFindings) => {
                  const result: XrayFindingsData = {
                    xrayResult: xrayResult as
                      | "Chest X-ray normal"
                      | "Non-TB abnormality"
                      | "Old or active TB",
                    xrayResultDetail: details ? String(details) : undefined,
                    minorFindings: minorFindings.length > 0 ? minorFindings : undefined,
                    associatedMinorFindings:
                      associatedMinorFindings.length > 0 ? associatedMinorFindings : undefined,
                    activeTbFindings: activeTbFindings.length > 0 ? activeTbFindings : undefined,
                  };
                  return result;
                });
              });
            });
          });
      });
    });
  }

  // Click save and continue button
  clickSaveAndContinue(): ChestXrayFindingsPage {
    cy.get('button[type="submit"]').contains("Save and continue").should("be.visible").click();
    return this;
  }

  // Verify save and continue button
  verifySaveAndContinueButton(): ChestXrayFindingsPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Save and continue");
    return this;
  }

  // Fill in form with complete data
  fillFormWithCompleteData(data: XrayFindingsData): ChestXrayFindingsPage {
    // Select X-ray result
    if (data.xrayResult === "Chest X-ray normal") {
      this.selectXrayResultNormal();
    } else if (data.xrayResult === "Non-TB abnormality") {
      this.selectXrayResultNonTbAbnormality();
    } else if (data.xrayResult === "Old or active TB") {
      this.selectXrayResultOldOrActiveTb();
    }

    // Enter details if provided
    if (data.xrayResultDetail) {
      this.enterXrayResultDetails(data.xrayResultDetail);
    }

    // Select findings if provided
    if (data.minorFindings && data.minorFindings.length > 0) {
      this.selectMinorFindings(data.minorFindings);
    }

    if (data.associatedMinorFindings && data.associatedMinorFindings.length > 0) {
      this.selectAssociatedMinorFindings(data.associatedMinorFindings);
    }

    if (data.activeTbFindings && data.activeTbFindings.length > 0) {
      this.selectActiveTbFindings(data.activeTbFindings);
    }

    return this;
  }

  // Submit form with complete data
  submitFormWithCompleteData(data: XrayFindingsData): ChestXrayFindingsPage {
    this.fillFormWithCompleteData(data);
    this.clickSaveAndContinue();
    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(expectedData: XrayFindingsData): ChestXrayFindingsPage {
    if (expectedData.xrayResult) {
      this.verifyXrayResultSelection(expectedData.xrayResult);
    }

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

  // Verify all fields are empty (initial state)
  verifyAllFieldsEmpty(): ChestXrayFindingsPage {
    cy.get('input[name="xrayResult"]:checked').should("not.exist");
    cy.get('textarea[name="xrayResultDetail"]').should("have.value", "");
    cy.get('input[name="xrayMinorFindings"]:checked').should("not.exist");
    cy.get('input[name="xrayAssociatedMinorFindings"]:checked').should("not.exist");
    cy.get('input[name="xrayActiveTbFindings"]:checked').should("not.exist");
    return this;
  }

  // Form field error validations - using base class methods
  validateXrayResultFieldError(errorMessage?: string): ChestXrayFindingsPage {
    this.validateFieldError("xray-result", errorMessage);
    return this;
  }

  validateFormErrors(expectedErrorMessages: XrayFindingsErrors): ChestXrayFindingsPage {
    // Validate X-ray result field error
    if (expectedErrorMessages.xrayResult) {
      this.validateFieldError("xray-result", expectedErrorMessages.xrayResult);
    }

    // Validate X-ray result detail field error
    if (expectedErrorMessages.xrayResultDetail) {
      this.validateFieldError("xray-result-detail", expectedErrorMessages.xrayResultDetail);
    }

    return this;
  }

  // Verify form validation when submitting empty form
  verifyFormValidationForEmptyForm(): ChestXrayFindingsPage {
    this.clickSaveAndContinue();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(): ChestXrayFindingsPage {
    this.clickSaveAndContinue();
    this.verifyUrlContains("/sputum-question");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): ChestXrayFindingsPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/chest-xray-upload");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ChestXrayFindingsPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Verify form group structure
  verifyFormGroupStructure(): ChestXrayFindingsPage {
    cy.get("#xray-result.govuk-form-group").should("be.visible");
    cy.get("#xray-result-detail.govuk-form-group").should("be.visible");
    cy.get("#radiographic-findings.govuk-form-group").should("be.visible");
    cy.get("#xray-minor-findings.govuk-form-group").should("be.visible");
    cy.get("#xray-associated-minor-findings.govuk-form-group").should("be.visible");
    cy.get("#xray-active-tb-findings.govuk-form-group").should("be.visible");
    return this;
  }

  // Verify fieldset structure
  verifyFieldsetStructure(): ChestXrayFindingsPage {
    cy.get("#xray-result fieldset.govuk-fieldset").should("be.visible");
    cy.get("#xray-minor-findings fieldset.govuk-fieldset").should("be.visible");
    cy.get("#xray-associated-minor-findings fieldset.govuk-fieldset").should("be.visible");
    cy.get("#xray-active-tb-findings fieldset.govuk-fieldset").should("be.visible");
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayFindingsPage {
    this.verifyPageLoaded()
      .verifyNotificationBanner()
      .verifyRadiologicalOutcomeSection()
      .verifyDetailsSection()
      .verifyRadiographicFindingsSection()
      .verifyMinorFindingsSection()
      .verifyAssociatedMinorFindingsSection()
      .verifyActiveTbFindingsSection()
      .verifyFormGroupStructure()
      .verifyFieldsetStructure()
      .verifySaveAndContinueButton()
      .verifyBackLinkNavigation()
      .verifyServiceName();
    return this;
  }

  // Quick completion methods for common scenarios

  // Complete form with normal X-ray and minor findings
  completeFormWithNormalXray(minorFindings?: string[], details?: string): ChestXrayFindingsPage {
    this.selectXrayResultNormal();

    if (details) {
      this.enterXrayResultDetails(details);
    }

    if (minorFindings && minorFindings.length > 0) {
      this.selectMinorFindings(minorFindings);
    }

    this.clickSaveAndContinue();
    return this;
  }

  // Complete form with abnormal X-ray and active TB findings
  completeFormWithAbnormalXray(
    activeTbFindings: string[],
    details?: string,
  ): ChestXrayFindingsPage {
    this.selectXrayResultOldOrActiveTb();

    if (details) {
      this.enterXrayResultDetails(details);
    }

    if (activeTbFindings && activeTbFindings.length > 0) {
      this.selectActiveTbFindings(activeTbFindings);
    }

    this.clickSaveAndContinue();
    return this;
  }

  // Complete form with non-TB abnormality
  completeFormWithNonTbAbnormality(findings?: string[], details?: string): ChestXrayFindingsPage {
    this.selectXrayResultNonTbAbnormality();

    if (details) {
      this.enterXrayResultDetails(details);
    }

    if (findings && findings.length > 0) {
      this.selectAssociatedMinorFindings(findings);
    }

    this.clickSaveAndContinue();
    return this;
  }

  // Test all form sections by filling them
  testAllFormSections(): ChestXrayFindingsPage {
    // Test X-ray result selection
    this.selectXrayResultNormal();
    this.verifyXrayResultSelection("Chest X-ray normal");

    this.selectXrayResultNonTbAbnormality();
    this.verifyXrayResultSelection("Non-TB abnormality");

    this.selectXrayResultOldOrActiveTb();
    this.verifyXrayResultSelection("Old or active TB");

    // Test details field
    this.enterXrayResultDetails("Test details");
    cy.get('textarea[name="xrayResultDetail"]').should("have.value", "Test details");

    // Test minor findings
    this.selectMinorFindings(["1.1 Single fibrous streak or band or scar"]);
    cy.get(
      'input[name="xrayMinorFindings"][value="1.1 Single fibrous streak or band or scar"]',
    ).should("be.checked");

    return this;
  }

  // Comprehensive verification for certificate not issued scenarios
  verifyPageForCertificateNotIssuedScenario(): ChestXrayFindingsPage {
    this.verifyAllPageElements();

    // Verify that all options for abnormal findings are available
    this.verifyActiveTbFindingsSection();

    // Verify notification banner is prominent
    this.verifyNotificationBanner();

    return this;
  }
}
