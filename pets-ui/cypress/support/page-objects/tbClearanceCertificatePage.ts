import { BasePage } from "../BasePage";

// Types for TB certificate form
interface TbCertificateDetails {
  clearanceIssued: "Yes" | "No";
  physicianComments?: string;
  certificateDay?: string;
  certificateMonth?: string;
  certificateYear?: string;
  certificateNumber?: string;
}

// Types for error validation
interface TbCertificateErrors {
  isIssued?: string;
  comments?: string;
  issueDate?: string;
  certificateNumber?: string;
}

export class TbClearanceCertificatePage extends BasePage {
  constructor() {
    super("/tb-certificate-declaration");
  }

  verifyPageLoaded(): TbClearanceCertificatePage {
    super.verifyPageHeading("Enter TB clearance certificate declaration");
    return this;
  }

  // Verify applicant details in summary
  verifySummaryDetails(details: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): TbClearanceCertificatePage {
    this.verifySummaryValues(details);
    return this;
  }

  // TB Clearance Certificate Actions
  selectTbClearanceIssued(option: "Yes" | "No"): TbClearanceCertificatePage {
    this.checkRadio("isIssued", option);
    return this;
  }

  fillPhysicianComments(comments: string): TbClearanceCertificatePage {
    cy.get('[name="comments"]').type(comments);
    return this;
  }

  // TB Certificate Date Actions
  fillTbCertificateDate(day: string, month: string, year: string): TbClearanceCertificatePage {
    this.fillDateFields("tb-certificate-date", day, month, year, "aria");
    return this;
  }

  fillTbCertificateNumber(number: string): TbClearanceCertificatePage {
    cy.get('input[id="tb-certificate-number"]').should("be.visible").clear().type(number);
    return this;
  }

  // Complete form with valid data
  fillFormWithValidData(options: TbCertificateDetails): TbClearanceCertificatePage {
    this.selectTbClearanceIssued(options.clearanceIssued);

    if (options.physicianComments) {
      this.fillPhysicianComments(options.physicianComments);
    }

    // Only fill certificate details if clearance was issued
    if (options.clearanceIssued === "Yes") {
      if (options.certificateDay && options.certificateMonth && options.certificateYear) {
        this.fillTbCertificateDate(
          options.certificateDay,
          options.certificateMonth,
          options.certificateYear,
        );
      }

      if (options.certificateNumber) {
        this.fillTbCertificateNumber(options.certificateNumber);
      }
    }

    this.submitForm("Continue");
    return this;
  }

  // Enhanced error validation
  validateFormErrors(expectedErrorMessages: TbCertificateErrors): TbClearanceCertificatePage {
    if (expectedErrorMessages.isIssued) {
      this.validateFieldError("tb-clearance-issued", expectedErrorMessages.isIssued);
    }

    if (expectedErrorMessages.comments) {
      this.validateFieldError("physician-comments", expectedErrorMessages.comments);
    }

    if (expectedErrorMessages.issueDate) {
      this.validateFieldError("tb-certificate-date", expectedErrorMessages.issueDate);
    }

    if (expectedErrorMessages.certificateNumber) {
      this.validateFieldError("tb-certificate-number", expectedErrorMessages.certificateNumber);
    }

    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(): TbClearanceCertificatePage {
    this.submitForm("Continue");
    this.verifyUrlContains("/tb-certificate-summary");
    return this;
  }
}
