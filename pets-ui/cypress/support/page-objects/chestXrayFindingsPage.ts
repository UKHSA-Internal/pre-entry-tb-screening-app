//This holds all fields of the Chest X-ray Findings Page
export class ChestXrayFindingsPage {
  visit(): void {
    cy.visit("/chest-xray-findings");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    // Check for the heading
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Enter radiological outcome and findings");

    // check the summary list is present
    cy.get(".govuk-summary-list").should("be.visible");
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): void {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
  }

  // Verify notification banner
  verifyNotificationBanner(): void {
    cy.get(".govuk-notification-banner").should("be.visible");
    cy.get(".govuk-notification-banner__title").should("contain", "Important");
    cy.get(".govuk-notification-banner__content").should("contain", "pulmonary TB");
  }

  // X-ray result selection methods
  selectXrayResultNormal(): void {
    cy.get('input[name="xrayResult"][value="Chest X-ray normal"]').check();
  }

  selectXrayResultNonTbAbnormality(): void {
    cy.get('input[name="xrayResult"][value="Non-TB abnormality"]').check();
  }

  selectXrayResultTb(): void {
    cy.get('input[name="xrayResult"][value="Old or active TB"]').check();
  }

  // Enter result details
  enterXrayResultDetails(details: string): void {
    cy.get('textarea[name="xrayResultDetail"]').clear().type(details);
  }

  // Minor findings selection methods
  selectMinorFindings(findings: string[]): void {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayMinorFindings"][value="${finding}"]`).check();
    });
  }

  // Minor findings associated with TB selection methods
  selectAssociatedMinorFindings(findings: string[]): void {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayAssociatedMinorFindings"][value="${finding}"]`).check();
    });
  }

  // Active TB findings selection methods
  selectActiveTbFindings(findings: string[]): void {
    findings.forEach((finding) => {
      cy.get(`input[name="xrayActiveTbFindings"][value="${finding}"]`).check();
    });
  }

  // Verify minor findings section
  verifyMinorFindingsSection(): void {
    cy.contains("h3", "Minor findings").should("be.visible");
    cy.get('input[name="xrayMinorFindings"]').should("have.length.at.least", 1);
  }

  // Verify minor findings associated with TB section
  verifyAssociatedMinorFindingsSection(): void {
    cy.contains("h3", "Minor findings (occasionally associated with TB infection)").should(
      "be.visible",
    );
    cy.get('input[name="xrayAssociatedMinorFindings"]').should("have.length.at.least", 1);
  }

  // Verify active TB findings section
  verifyActiveTbFindingsSection(): void {
    cy.contains("h3", "Findings sometimes seen in active TB (or other conditions)").should(
      "be.visible",
    );
    cy.get('input[name="xrayActiveTbFindings"]').should("have.length.at.least", 1);
  }

  // Get selected X-ray result
  getSelectedXrayResult(): Cypress.Chainable<string> {
    return cy.get('input[name="xrayResult"]:checked').invoke("val");
  }

  // Click save and continue button
  clickSaveAndContinue(): void {
    cy.contains("button", "Save and continue").click();
  }

  // Fill in form with complete data
  fillFormWithCompleteData(data: {
    xrayResult: "Chest X-ray normal" | "Non-TB abnormality" | "Old or active TB";
    xrayResultDetail?: string;
    minorFindings?: string[];
    associatedMinorFindings?: string[];
    activeTbFindings?: string[];
  }): void {
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
  }

  // Submit form with complete data
  submitFormWithCompleteData(data: {
    xrayResult: "Chest X-ray normal" | "Non-TB abnormality" | "Old or active TB";
    xrayResultDetail?: string;
    minorFindings?: string[];
    associatedMinorFindings?: string[];
    activeTbFindings?: string[];
  }): void {
    this.fillFormWithCompleteData(data);
    this.clickSaveAndContinue();
  }

  // Error validation methods
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
  }

  validateErrorContainsText(text: string): void {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
  }

  validateErrorSummary(expectedErrors: string[]): void {
    cy.get(".govuk-error-summary").should("be.visible");

    // Check each expected error is present in the error summary
    expectedErrors.forEach((errorText) => {
      cy.get(".govuk-error-summary__list").should("contain.text", errorText);
    });
  }

  // Form field error validations
  validateXrayResultFieldError(): void {
    cy.get("#xray-result").should("have.class", "govuk-form-group--error");
    cy.get("#xray-result").find(".govuk-error-message").should("be.visible");
  }

  validateFormErrors(expectedErrorMessages: {
    xrayResult?: string;
    xrayResultDetail?: string;
  }): void {
    // Validate X-ray result field error
    if (expectedErrorMessages.xrayResult) {
      cy.get("#xray-result").should("have.class", "govuk-form-group--error");
      cy.get("#xray-result")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.xrayResult);
    }

    // Validate X-ray result detail field error
    if (expectedErrorMessages.xrayResultDetail) {
      cy.get("#xray-result-detail").should("have.class", "govuk-form-group--error");
      cy.get("#xray-result-detail")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.xrayResultDetail);
    }
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

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyNotificationBanner();
    this.verifyMinorFindingsSection();
    this.verifyAssociatedMinorFindingsSection();
    this.verifyActiveTbFindingsSection();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }

  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
}
