// This holds all fields for the Chest X-ray Findings Page
import { BasePage } from "../BasePage";

export class ChestXrayFindingsPage extends BasePage {
  constructor() {
    super("/chest-xray-findings");
  }

  // Verify page loaded
  verifyPageLoaded(): this {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Enter radiological outcome and findings");

    // Check the summary list is present
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): this {
    this.verifySummaryValues(expectedValues);
    return this;
  }

  // Verify notification banner
  verifyNotificationBanner(): this {
    cy.get(".govuk-notification-banner").should("be.visible");
    cy.get(".govuk-notification-banner__title").should("contain", "Important");
    cy.get(".govuk-notification-banner__content").should("contain", "pulmonary TB");
    return this;
  }

  // X-ray result selection methods
  selectXrayResultNormal(): this {
    cy.get('input[name="xrayResult"][value="Chest X-ray normal"]').check();
    return this;
  }

  selectXrayResultNonTbAbnormality(): this {
    cy.get('input[name="xrayResult"][value="Non-TB abnormality"]').check();
    return this;
  }

  selectXrayResultTb(): this {
    cy.get('input[name="xrayResult"][value="Old or active TB"]').check();
    return this;
  }

  // Enter result details
  enterXrayResultDetails(details: string): this {
    this.fillTextarea("X-ray result details", details);
    return this;
  }

  // Minor findings selection methods
  selectMinorFindings(findings: string[]): this {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayMinorFindings"][value="${finding}"]`).check();
    });
    return this;
  }

  // Minor findings associated with TB selection methods
  selectAssociatedMinorFindings(findings: string[]): this {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayAssociatedMinorFindings"][value="${finding}"]`).check();
    });
    return this;
  }

  // Active TB findings selection methods
  selectActiveTbFindings(findings: string[]): this {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayActiveTbFindings"][value="${finding}"]`).check();
    });
    return this;
  }

  // Verify minor findings section
  verifyMinorFindingsSection(): this {
    cy.contains("h3", "Minor findings").should("be.visible");
    cy.get('input[name="xrayMinorFindings"]').should("have.length.at.least", 1);
    return this;
  }

  // Verify minor findings associated with TB section
  verifyAssociatedMinorFindingsSection(): this {
    cy.contains("h3", "Minor findings (occasionally associated with TB infection)").should(
      "be.visible",
    );
    cy.get('input[name="xrayAssociatedMinorFindings"]').should("have.length.at.least", 1);
    return this;
  }

  // Verify active TB findings section
  verifyActiveTbFindingsSection(): this {
    cy.contains("h3", "Findings sometimes seen in active TB (or other conditions)").should(
      "be.visible",
    );
    cy.get('input[name="xrayActiveTbFindings"]').should("have.length.at.least", 1);
    return this;
  }

  // Get selected X-ray result
  getSelectedXrayResult(): Cypress.Chainable<string> {
    return cy.get('input[name="xrayResult"]:checked').invoke("val");
  }

  // Click save and continue button - using base class method
  clickSaveAndContinue(): this {
    super.submitForm("Save and continue");
    return this;
  }

  // Fill in form with complete data
  fillFormWithCompleteData(data: {
    xrayResult: "Chest X-ray normal" | "Non-TB abnormality" | "Old or active TB";
    xrayResultDetail?: string;
    minorFindings?: string[];
    associatedMinorFindings?: string[];
    activeTbFindings?: string[];
  }): this {
    // Select X-ray result
    if (data.xrayResult === "Chest X-ray normal") {
      this.selectXrayResultNormal();
    } else if (data.xrayResult === "Non-TB abnormality") {
      this.selectXrayResultNonTbAbnormality();
    } else {
      this.selectXrayResultTb();
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
  submitFormWithCompleteData(data: {
    xrayResult: "Chest X-ray normal" | "Non-TB abnormality" | "Old or active TB";
    xrayResultDetail?: string;
    minorFindings?: string[];
    associatedMinorFindings?: string[];
    activeTbFindings?: string[];
  }): this {
    this.fillFormWithCompleteData(data);
    this.clickSaveAndContinue();
    return this;
  }

  // Form field error validations - using base class methods
  validateXrayResultFieldError(errorMessage?: string): this {
    this.validateFieldError("xray-result", errorMessage);
    return this;
  }

  validateFormErrors(expectedErrorMessages: {
    xrayResult?: string;
    xrayResultDetail?: string;
  }): this {
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

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): this {
    this.verifyPageLoaded()
      .verifyApplicantInfo(applicantInfo)
      .verifyNotificationBanner()
      .verifyMinorFindingsSection()
      .verifyAssociatedMinorFindingsSection()
      .verifyActiveTbFindingsSection()
      .verifyBreadcrumbNavigation()
      .verifyServiceName();
    return this;
  }
}
