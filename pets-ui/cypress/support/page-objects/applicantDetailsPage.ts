/**
 * ApplicantDetailsPage - refactored to use composition over inheritance
 * This page handles applicant personal information entry
 */
import { DateUtils } from "../../support/DateUtils";
import { ButtonHelper, ErrorHelper, FormHelper, GdsComponentHelper } from "../../support/helpers";
import { BasePage } from "../BasePageNew";

export class ApplicantDetailsPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private error = new ErrorHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/visa-applicant-personal-information");
  }

  // ============================================================
  // PAGE VERIFICATION
  // ============================================================

  verifyPageLoaded(): ApplicantDetailsPage {
    this.gds.verifyPageHeading("Visa applicant personal information");
    return this;
  }

  // ============================================================
  // PERSONAL DETAILS METHODS
  // ============================================================

  fillFullName(name: string): ApplicantDetailsPage {
    this.form.fillTextInputByTestId("name", name);
    return this;
  }

  selectSex(sex: "Female" | "Male"): ApplicantDetailsPage {
    this.form.checkRadio("sex", sex);
    return this;
  }

  selectNationality(country: string): ApplicantDetailsPage {
    this.form.selectDropdownByName("countryOfNationality", country);
    return this;
  }

  // ============================================================
  // DATE OF BIRTH METHODS
  // ============================================================

  fillBirthDate(day: string, month: string, year: string): ApplicantDetailsPage {
    this.form.fillDateFields("Date of birth", day, month, year);
    return this;
  }

  /**
   * Fill birth date for a specific age
   * @param age - Age in years
   */
  fillBirthDateForAge(age: number): ApplicantDetailsPage {
    const dob = DateUtils.getDOBComponentsForAge(age);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  /**
   * Fill birth date for a child (under 11 years)
   * @param age - Optional specific age, or random between 2-10
   */
  fillChildBirthDate(age?: number): ApplicantDetailsPage {
    const dob = DateUtils.getChildDOBComponents(age);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  /**
   * Fill birth date for an adult (11+ years)
   * @param age - Age in years, defaults to 30
   */
  fillAdultBirthDate(age: number = 30): ApplicantDetailsPage {
    const dob = DateUtils.getAdultDOBComponents(age);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  /**
   * Fill birth date for an infant (under 12 months)
   * @param ageInMonths - Age in months (0-11)
   */
  fillInfantBirthDate(ageInMonths: number): ApplicantDetailsPage {
    if (ageInMonths >= 12) {
      throw new Error("Use fillChildBirthDate for children 12 months or older");
    }
    const dob = DateUtils.getInfantDOBComponents(ageInMonths);
    this.fillBirthDate(dob.day, dob.month, dob.year);
    return this;
  }

  // ============================================================
  // COMPLETE FORM METHODS
  // ============================================================

  /**
   * Fill complete applicant personal information
   */
  fillCompletePersonalInfo(data: {
    name: string;
    sex: "Female" | "Male";
    nationality: string;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
  }): ApplicantDetailsPage {
    this.fillFullName(data.name);
    this.selectSex(data.sex);
    this.fillBirthDate(data.dobDay, data.dobMonth, data.dobYear);
    this.selectNationality(data.nationality);
    return this;
  }

  /**
   * Fill form and submit - convenience method for common flow
   */
  fillAndSubmit(data: {
    name: string;
    sex: "Female" | "Male";
    nationality: string;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
  }): void {
    this.fillCompletePersonalInfo(data);
    this.button.clickContinue();
  }

  /**
   * Submit the form by clicking the Continue button
   */
  submitForm(): ApplicantDetailsPage {
    this.button.clickContinue();
    return this;
  }

  // ============================================================
  // VALIDATION METHODS
  // ============================================================

  /**
   * Verify field-level error for a specific field
   */
  verifyFieldError(fieldId: string, errorMessage: string): ApplicantDetailsPage {
    this.error.validateFieldError(fieldId, errorMessage);
    return this;
  }

  /**
   * Verify error summary is displayed
   */
  verifyErrorSummary(): ApplicantDetailsPage {
    this.error.verifyErrorSummaryDisplayed();
    return this;
  }

  /**
   * Verify specific error message in summary
   */
  verifyErrorMessage(message: string): ApplicantDetailsPage {
    this.error.verifyErrorSummaryMessage(message);
    return this;
  }

  /**
   * Verify multiple field errors at once
   */
  verifyMultipleErrors(errors: Record<string, string>): ApplicantDetailsPage {
    this.error.validateMultipleFieldErrors(errors);
    return this;
  }
}
