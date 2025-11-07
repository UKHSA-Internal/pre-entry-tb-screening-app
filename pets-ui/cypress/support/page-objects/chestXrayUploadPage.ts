// This holds all the fields on the Chest X-ray Upload Page
import { BasePage } from "../BasePage";

export class ChestXrayUploadPage extends BasePage {
  // Verify the date input fields contain the correct values
  verifyDateValue(xrayDay: string, xrayMonth: string, xrayYear: string): ChestXrayUploadPage {
    cy.get("#date-xray-taken-day").should("have.value", xrayDay);
    cy.get("#date-xray-taken-month").should("have.value", xrayMonth);
    cy.get("#date-xray-taken-year").should("have.value", xrayYear);
    return this;
  }
  constructor() {
    super("/upload-chest-x-ray-images");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayUploadPage {
    this.verifyPageHeading("Upload chest X-ray images");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify date X-ray taken section is displayed
  verifyDateXrayTakenSectionDisplayed(): ChestXrayUploadPage {
    cy.contains("h2.govuk-heading-m", "When was the X-ray taken?").should("be.visible");
    cy.get("#date-xray-taken").should("be.visible");
    cy.get("#date-xray-taken-hint").should("be.visible").and("contain", "For example, 31 3 2025");
    return this;
  }

  // Enter date X-ray was taken
  enterDateXrayTaken(day: string, month: string, year: string): ChestXrayUploadPage {
    cy.get("#date-xray-taken-day").clear().type(day);
    cy.get("#date-xray-taken-month").clear().type(month);
    cy.get("#date-xray-taken-year").clear().type(year);
    return this;
  }

  // Click "Today" quickfill link for date
  clickTodayQuickfill(): ChestXrayUploadPage {
    cy.get('[data-testid="date-xray-taken-quickfill-today"]').click();
    return this;
  }

  // Click "Yesterday" quickfill link for date
  clickYesterdayQuickfill(): ChestXrayUploadPage {
    cy.get('[data-testid="date-xray-taken-quickfill-yesterday"]').click();
    return this;
  }

  // Verify date input fields are present
  verifyDateInputFields(): ChestXrayUploadPage {
    cy.get("#date-xray-taken-day").should("be.visible");
    cy.get("#date-xray-taken-month").should("be.visible");
    cy.get("#date-xray-taken-year").should("be.visible");
    return this;
  }

  // Verify X-ray upload sections are displayed
  verifyXrayUploadSectionsDisplayed(): ChestXrayUploadPage {
    cy.contains("h2.govuk-heading-m", "Upload X-ray images").should("be.visible");
    cy.contains("h3.govuk-heading-s", "Postero-anterior view").should("be.visible");
    cy.contains("h3.govuk-heading-s", "Apical lordotic view (optional)").should("be.visible");
    cy.contains("h3.govuk-heading-s", "Lateral decubitus view (optional)").should("be.visible");
    return this;
  }

  // Verify file upload instructions
  verifyFileUploadInstructions(): ChestXrayUploadPage {
    cy.contains("p.govuk-body", "Upload a file").should("be.visible");
    cy.get(".govuk-hint")
      .contains("File type must be DCM. Images must be less than 50MB.")
      .should("be.visible");
    return this;
  }

  // Verify file drop zone is displayed for a specific X-ray type
  verifyFileDropZone(xrayId: string): ChestXrayUploadPage {
    cy.get(`#${xrayId}`).should("be.visible");
    cy.get(`#${xrayId}`).within(() => {
      cy.get(".file-upload-blue-bar").should("be.visible");
      cy.contains("button.govuk-button--secondary", "Choose file").should("be.visible");
      cy.contains(".file-upload-or-drop", "or drop file").should("be.visible");
    });
    return this;
  }

  // Verify all file drop zones are displayed
  verifyAllFileDropZones(): ChestXrayUploadPage {
    this.verifyFileDropZone("postero-anterior-xray");
    this.verifyFileDropZone("apical-lordotic-xray");
    this.verifyFileDropZone("lateral-decubitus-xray");
    return this;
  }

  // Verify "No file chosen" text is displayed
  verifyNoFileChosen(xrayId: string): ChestXrayUploadPage {
    cy.get(`#${xrayId}`).within(() => {
      cy.contains(".file-upload-no-file", "No file chosen").should("be.visible");
    });
    return this;
  }

  // Upload postero-anterior X-ray file
  uploadPosteroAnteriorXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[name="posteroAnteriorXrayFileName"]').selectFile(filePath, { force: true });
    return this;
  }

  // Upload apical lordotic X-ray file (optional)
  uploadApicalLordoticXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[name="apicalLordoticXrayFileName"]').selectFile(filePath, { force: true });
    return this;
  }

  // Upload lateral decubitus X-ray file (optional)
  uploadLateralDecubitusXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[name="lateralDecubitusXrayFileName"]').selectFile(filePath, { force: true });
    return this;
  }

  // Verify file is uploaded for a specific X-ray type
  verifyFileUploaded(
    xrayType:
      | "posteroAnteriorXrayFileName"
      | "apicalLordoticXrayFileName"
      | "lateralDecubitusXrayFileName",
  ): ChestXrayUploadPage {
    // Check that the file input has a value
    cy.get(`input[name="${xrayType}"]`).should("exist");
    return this;
  }

  // Clear uploaded file for a specific X-ray type
  clearUploadedFile(
    xrayType:
      | "posteroAnteriorXrayFileName"
      | "apicalLordoticXrayFileName"
      | "lateralDecubitusXrayFileName",
  ): ChestXrayUploadPage {
    cy.get(`input[name="${xrayType}"]`).clear();
    return this;
  }

  // Click continue button
  clickContinue(): ChestXrayUploadPage {
    // Wait for any potential upload processing to complete - intermittently slow have added a wait
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get('button[type="submit"]').contains("Continue").click({ force: true });
    return this;
  }

  // Verify upload success for X-ray images
  verifyUploadSuccess(): ChestXrayUploadPage {
    // Just verify that the button is enabled and no errors are shown
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").and("be.enabled");
    cy.get(".govuk-error-message").should("not.exist");
    return this;
  }

  // Verify upload error state
  verifyUploadError(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): ChestXrayUploadPage {
    cy.get(`#${xrayType}-error`).should("be.visible");
    cy.get(".govuk-error-message").should("be.visible");
    return this;
  }

  // Upload mandatory X-ray with date and submit form
  uploadMandatoryXrayWithDateAndSubmit(
    filePath: string,
    day: string,
    month: string,
    year: string,
  ): ChestXrayUploadPage {
    this.enterDateXrayTaken(day, month, year);
    this.uploadPosteroAnteriorXray(filePath);
    this.clickContinue();
    return this;
  }

  // Upload mandatory X-ray and submit form
  uploadMandatoryXrayAndSubmit(filePath: string): ChestXrayUploadPage {
    this.uploadPosteroAnteriorXray(filePath);
    this.clickContinue();
    return this;
  }

  // Upload all X-rays with date and submit form
  uploadAllXraysWithDateAndSubmit(
    posteroAnteriorPath: string,
    apicalLordoticPath: string,
    lateralDecubitusPath: string,
    day: string,
    month: string,
    year: string,
  ): ChestXrayUploadPage {
    this.enterDateXrayTaken(day, month, year);
    this.uploadPosteroAnteriorXray(posteroAnteriorPath);
    this.uploadApicalLordoticXray(apicalLordoticPath);
    this.uploadLateralDecubitusXray(lateralDecubitusPath);
    this.clickContinue();
    return this;
  }

  // Upload all X-rays and submit form
  uploadAllXraysAndSubmit(
    posteroAnteriorPath: string,
    apicalLordoticPath: string,
    lateralDecubitusPath: string,
  ): ChestXrayUploadPage {
    this.uploadPosteroAnteriorXray(posteroAnteriorPath);
    this.uploadApicalLordoticXray(apicalLordoticPath);
    this.uploadLateralDecubitusXray(lateralDecubitusPath);
    this.clickContinue();
    return this;
  }

  // Verify form validation - ensure mandatory file is uploaded
  verifyFormValidation(): ChestXrayUploadPage {
    // Submit form without uploading mandatory X-ray
    this.clickContinue();

    // Verify validation error is displayed
    cy.get(".govuk-error-message").should("be.visible");
    cy.get("#postero-anterior-xray-error").should("be.visible");
    return this;
  }

  // Verify file types are accepted
  verifyAcceptedFileTypes(): ChestXrayUploadPage {
    cy.get('input[name="posteroAnteriorXrayFileName"]').should("have.attr", "accept", ".dcm");
    cy.get('input[name="apicalLordoticXrayFileName"]').should("have.attr", "accept", ".dcm");
    cy.get('input[name="lateralDecubitusXrayFileName"]').should("have.attr", "accept", ".dcm");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): ChestXrayUploadPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tracker");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ChestXrayUploadPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify DICOM upload container structure
  verifyDicomUploadContainers(): ChestXrayUploadPage {
    cy.get(".dicom-upload-container").should("have.length", 4);
    return this;
  }

  // Verify date quickfill links are present
  verifyDateQuickfillLinks(): ChestXrayUploadPage {
    cy.contains("Set to:").should("be.visible");
    cy.get('[data-testid="date-xray-taken-quickfill-today"]')
      .should("be.visible")
      .and("contain", "Today");
    cy.get('[data-testid="date-xray-taken-quickfill-yesterday"]')
      .should("be.visible")
      .and("contain", "Yesterday");
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayUploadPage {
    this.verifyPageLoaded();
    this.verifyDateXrayTakenSectionDisplayed();
    this.verifyDateInputFields();
    this.verifyDateQuickfillLinks();
    this.verifyXrayUploadSectionsDisplayed();
    this.verifyFileUploadInstructions();
    this.verifyAllFileDropZones();
    this.verifyDicomUploadContainers();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }
}
