/**
 * ChestXrayUploadPage - refactored to use composition over inheritance
 * This page handles chest X-ray image uploads with date entry
 */
import { BasePage } from "../BasePageNew";
import {
  ButtonHelper,
  ErrorHelper,
  FileUploadHelper,
  FormHelper,
  GdsComponentHelper,
} from "../helpers";

export class ChestXrayUploadPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private upload = new FileUploadHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();
  private gds = new GdsComponentHelper();

  constructor() {
    super("/upload-chest-x-ray-images");
  }

  // ============================================================
  // PAGE VERIFICATION
  // ============================================================

  verifyPageLoaded(): ChestXrayUploadPage {
    this.gds.verifyPageHeading("Upload chest X-ray images");
    cy.get("form").should("be.visible");
    return this;
  }

  // ============================================================
  // DATE X-RAY TAKEN SECTION
  // ============================================================

  verifyDateXrayTakenSectionDisplayed(): ChestXrayUploadPage {
    cy.contains("h2.govuk-heading-m", "When was the X-ray taken?").should("be.visible");
    cy.get("#date-xray-taken").should("be.visible");
    cy.get("#date-xray-taken-hint").should("be.visible").and("contain", "For example, 31 3 2025");
    return this;
  }

  enterDateXrayTaken(day: string, month: string, year: string): ChestXrayUploadPage {
    this.form.fillDateFieldsBySelector(
      "#date-xray-taken-day",
      "#date-xray-taken-month",
      "#date-xray-taken-year",
      day,
      month,
      year,
    );
    return this;
  }

  clickTodayQuickfill(): ChestXrayUploadPage {
    cy.get('[data-testid="date-xray-taken-quickfill-today"]').click();
    return this;
  }

  clickYesterdayQuickfill(): ChestXrayUploadPage {
    cy.get('[data-testid="date-xray-taken-quickfill-yesterday"]').click();
    return this;
  }

  verifyDateInputFields(): ChestXrayUploadPage {
    this.form.verifyFieldVisible("#date-xray-taken-day");
    this.form.verifyFieldVisible("#date-xray-taken-month");
    this.form.verifyFieldVisible("#date-xray-taken-year");
    return this;
  }

  verifyDateValue(xrayDay: string, xrayMonth: string, xrayYear: string): ChestXrayUploadPage {
    this.form.verifyFormFieldValue("#date-xray-taken-day", xrayDay);
    this.form.verifyFormFieldValue("#date-xray-taken-month", xrayMonth);
    this.form.verifyFormFieldValue("#date-xray-taken-year", xrayYear);
    return this;
  }

  // ============================================================
  // X-RAY UPLOAD SECTIONS
  // ============================================================

  verifyXrayUploadSectionsDisplayed(): ChestXrayUploadPage {
    cy.contains("h2.govuk-heading-m", "Upload X-ray images").should("be.visible");
    cy.contains("h3.govuk-heading-s", "Postero-anterior view").should("be.visible");
    cy.contains("h3.govuk-heading-s", "Apical lordotic view (optional)").should("be.visible");
    cy.contains("h3.govuk-heading-s", "Lateral decubitus view (optional)").should("be.visible");
    return this;
  }

  verifyFileUploadInstructions(): ChestXrayUploadPage {
    cy.contains("p.govuk-body", "Upload a file").should("be.visible");
    cy.get(".govuk-hint")
      .contains("File type must be DCM. Images must be less than 50MB.")
      .should("be.visible");
    return this;
  }

  verifyFileDropZone(xrayId: string): ChestXrayUploadPage {
    this.upload.verifyFileDropZone(xrayId);
    cy.get(`#${xrayId}`).within(() => {
      cy.contains(".file-upload-or-drop", "or drop file").should("be.visible");
    });
    return this;
  }

  verifyAllFileDropZones(): ChestXrayUploadPage {
    this.verifyFileDropZone("postero-anterior-xray");
    this.verifyFileDropZone("apical-lordotic-xray");
    this.verifyFileDropZone("lateral-decubitus-xray");
    return this;
  }

  verifyNoFileChosen(xrayId: string): ChestXrayUploadPage {
    this.upload.verifyNoFileChosen(xrayId);
    return this;
  }

  verifyAllPageElements(): ChestXrayUploadPage {
    this.verifyPageLoaded();
    this.verifyDateXrayTakenSectionDisplayed();
    this.verifyXrayUploadSectionsDisplayed();
    return this;
  }

  verifyDicomUploadContainers(): ChestXrayUploadPage {
    cy.get("#postero-anterior-xray").should("be.visible");
    cy.get("#apical-lordotic-xray").should("be.visible");
    cy.get("#lateral-decubitus-xray").should("be.visible");
    return this;
  }

  verifyAcceptedFileTypes(): ChestXrayUploadPage {
    cy.get(".govuk-hint").contains("File type must be DCM").should("be.visible");
    return this;
  }

  verifyUploadSuccess(): ChestXrayUploadPage {
    // Verify that the file has been uploaded successfully
    cy.get('[data-testid="postero-anterior-xray"]') // ← Changed from "posteroAnteriorXrayFileName"
      .should("exist")
      .and(($input) => {
        const files = ($input[0] as HTMLInputElement).files;
        expect(files).to.have.length.greaterThan(0);
      });
    return this;
  }

  // ============================================================
  // FILE UPLOAD METHODS
  // ============================================================

  uploadPosteroAnteriorXray(filePath: string): ChestXrayUploadPage {
    this.upload.uploadFile("posteroAnteriorXrayFileName", filePath);
    return this;
  }

  uploadApicalLordoticXray(filePath: string): ChestXrayUploadPage {
    this.upload.uploadFile("apicalLordoticXrayFileName", filePath);
    return this;
  }

  uploadLateralDecubitusXray(filePath: string): ChestXrayUploadPage {
    this.upload.uploadFile("lateralDecubitusXrayFileName", filePath);
    return this;
  }

  verifyFileUploaded(
    xrayType:
      | "posteroAnteriorXrayFileName"
      | "apicalLordoticXrayFileName"
      | "lateralDecubitusXrayFileName",
  ): ChestXrayUploadPage {
    this.upload.verifyFileUploaded(xrayType);
    return this;
  }

  clearUploadedFile(
    xrayType:
      | "posteroAnteriorXrayFileName"
      | "apicalLordoticXrayFileName"
      | "lateralDecubitusXrayFileName",
  ): ChestXrayUploadPage {
    this.upload.clearUploadedFile(xrayType);
    return this;
  }

  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  clickContinue(): ChestXrayUploadPage {
    // Wait for any potential upload processing to complete
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").and("be.enabled");
    this.upload.waitForUpload(1000);
    this.button.clickContinue();
    return this;
  }

  submitForm(): ChestXrayUploadPage {
    this.button.clickContinue();
    return this;
  }

  // ============================================================
  // VALIDATION METHODS
  // ============================================================

  verifyErrorSummary(): ChestXrayUploadPage {
    this.error.verifyErrorSummaryDisplayed();
    return this;
  }

  verifyFieldError(fieldId: string, errorMessage: string): ChestXrayUploadPage {
    this.error.validateFieldError(fieldId, errorMessage);
    return this;
  }

  verifyDateError(errorMessage: string): ChestXrayUploadPage {
    this.error.validateFieldError("date-xray-taken", errorMessage);
    return this;
  }

  verifyFileUploadError(fieldName: string, errorMessage?: string): ChestXrayUploadPage {
    this.upload.verifyFileUploadError(fieldName, errorMessage);
    return this;
  }

  // ============================================================
  // COMPLETE UPLOAD FLOW
  // ============================================================

  /**
   * Complete upload flow with all required files
   */
  completeUploadWithAllFiles(
    day: string,
    month: string,
    year: string,
    posteroAnteriorFile: string,
    apicalLordoticFile?: string,
    lateralDecubitusFile?: string,
  ): ChestXrayUploadPage {
    this.enterDateXrayTaken(day, month, year);
    this.uploadPosteroAnteriorXray(posteroAnteriorFile);

    if (apicalLordoticFile) {
      this.uploadApicalLordoticXray(apicalLordoticFile);
    }

    if (lateralDecubitusFile) {
      this.uploadLateralDecubitusXray(lateralDecubitusFile);
    }

    return this;
  }

  /**
   * Verify complete page structure
   */
  verifyPageStructure(): ChestXrayUploadPage {
    this.verifyPageLoaded();
    this.verifyDateXrayTakenSectionDisplayed();
    this.verifyXrayUploadSectionsDisplayed();
    this.verifyFileUploadInstructions();
    this.verifyAllFileDropZones();
    return this;
  }
}
