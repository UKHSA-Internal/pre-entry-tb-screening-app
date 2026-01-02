// PETS Date Validation Test: VALID - Passport Issue Date 1 Day AFTER Date of Birth
// VALIDATION: Passport issue date is after date of birth (minimum valid gap)
// Expected: Form submission succeeds, no validation errors
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Date Validation: VALID - Passport Issue 1 Day After DOB", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();

  // Define variables to store test data
  let countryName: string = "";
  let passportNumber: string = "";

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBSumPageFormat: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    createTestFixtures();

    // Generate dates for 28 year old adult
    adultAge = 28;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    const dobDate = DateUtils.getAdultDateOfBirth(adultAge);
    adultDOBSumPageFormat = DateUtils.formatDateGOVUK(dobDate);

    // VALID SCENARIO: Passport issued 1 day AFTER date of birth
    const birthDate = DateUtils.getAdultDateOfBirth(adultAge);
    const validPassportIssue = new Date(birthDate);
    validPassportIssue.setDate(birthDate.getDate() + 1); // 1 day after birth
    passportIssueDate = DateUtils.getDateComponents(validPassportIssue);

    // Passport expiry in future (10 years from today)
    const passportExpiry = DateUtils.getDateInFuture(10);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // Log dates for debugging
    cy.log("=== VALID SCENARIO: PASSPORT ISSUE 1 DAY AFTER DOB ===");
    cy.log(`Date of Birth: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year} (1 DAY AFTER BIRTH - VALID!)`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
    applicantSearchPage.verifyPageLoaded();

    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.label;
    passportNumber = getRandomPassportNumber();

    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
  });

  it("should accept passport issue date that is 1 day after date of birth", () => {
    // Search for new applicant
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.clickCreateNewApplicant();

    // Applicant Consent
    cy.acceptCookies();
    applicantConsentPage.continueWithConsent("Yes");
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details with VALID passport issue date (1 day after DOB)
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Test Valid Passport")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("789 Valid Street")
      .fillTownOrCity("Valid City")
      .fillProvinceOrState("Valid Province")
      .selectAddressCountry(countryName)
      .fillPostcode("V4L 1DD");

    // Submit form - should succeed
    applicantDetailsPage.submitForm();

    // Verify no errors
    cy.get(".govuk-error-summary").should("not.exist");
    cy.get(".govuk-error-message").should("not.exist");

    // Verify we've progressed to photo upload page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Complete photo upload
    applicantPhotoUploadPage.uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg");
    applicantPhotoUploadPage.clickContinue();

    // Check photo page
    cy.url().should("include", "/check-visa-applicant-photo");
    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();

    // Applicant Summary - verify details were saved correctly
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.verifyAllSummaryValues({
      "Full name": "Test Valid Passport",
      Sex: "Female",
      Nationality: countryName,
      "Date of birth": adultDOBSumPageFormat,
      "Passport number": passportNumber,
    });
    applicantSummaryPage.confirmDetails();

    // Verify applicant confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();
  });
});
