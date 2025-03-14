//This holds all fields of the Chest X-ray Upload Page
export class ChestXrayUploadPage {
  visit(): void {
    cy.visit("/chest-xray-upload");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Upload chest X-ray images").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of Birth"?: string;
    "Passport Number"?: string;
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

  // Verify X-ray upload sections are displayed
  verifyXrayUploadSectionsDisplayed(): void {
    cy.contains("h2", "Postero-anterior X-ray").should("be.visible");
    cy.contains("h2", "Apical lordotic X-ray (optional)").should("be.visible");
    cy.contains("h2", "Lateral decubitus X-ray (optional)").should("be.visible");
  }

  // Upload postero-anterior X-ray file
  uploadPosteroAnteriorXray(filePath: string): void {
    cy.get('input[name="postero-anterior-xray"]').selectFile(filePath);
  }

  // Upload apical lordotic X-ray file (optional)
  uploadApicalLordoticXray(filePath: string): void {
    cy.get('input[name="apical-lordotic-xray"]').selectFile(filePath);
  }

  // Upload lateral decubitus X-ray file (optional)
  uploadLateralDecubitusXray(filePath: string): void {
    cy.get('input[name="lateral-decubitus-xray"]').selectFile(filePath);
  }

  // Verify file is uploaded for a specific X-ray type
  verifyFileUploaded(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): void {
    cy.get(`input[name="${xrayType}"]`).should("have.prop", "files.length", 1);
  }

  // Clear uploaded file for a specific X-ray type
  clearUploadedFile(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): void {
    cy.get(`input[name="${xrayType}"]`).clear();
  }
  // Click continue button
  clickContinue(): void {
    cy.contains("button", "Continue").click();
  }

  // Upload mandatory X-ray and submit form
  uploadMandatoryXrayAndSubmit(filePath: string): void {
    this.uploadPosteroAnteriorXray(filePath);
    this.clickContinue();
  }

  // Upload all X-rays and submit form
  uploadAllXraysAndSubmit(
    posteroAnteriorPath: string,
    apicalLordoticPath: string,
    lateralDecubitusPath: string,
  ): void {
    this.uploadPosteroAnteriorXray(posteroAnteriorPath);
    this.uploadApicalLordoticXray(apicalLordoticPath);
    this.uploadLateralDecubitusXray(lateralDecubitusPath);
    this.clickContinue();
  }

  // Verify form validation - ensure mandatory file is uploaded
  verifyFormValidation(): void {
    // Submit form without uploading mandatory X-ray
    this.clickContinue();

    // Verify validation error is displayed
    cy.get(".govuk-error-message").should("be.visible");
    cy.get("#postero-anterior-xray-error").should("be.visible");
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

  // Verify file types are accepted
  verifyAcceptedFileTypes(): void {
    cy.get('input[name="postero-anterior-xray"]').should("have.attr", "accept", "jpg,jpeg,png,pdf");
    cy.get('input[name="apical-lordotic-xray"]').should("have.attr", "accept", "jpg,jpeg,png,pdf");
    cy.get('input[name="lateral-decubitus-xray"]').should(
      "have.attr",
      "accept",
      "jpg,jpeg,png,pdf",
    );
  }

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of Birth"?: string;
    "Passport Number"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyXrayUploadSectionsDisplayed();
    this.verifyAcceptedFileTypes();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
  }
}
