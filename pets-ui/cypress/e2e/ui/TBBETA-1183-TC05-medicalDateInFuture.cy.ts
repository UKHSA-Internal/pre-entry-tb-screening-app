// PETS Date Validation Test: INVALID - Medical Screening Date in the Future
// VIOLATION: Medical screening date cannot be in the future
// Expected Error: "The date of the medical screening must be today or in the past 6 months"
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
import { ContactInformationPage } from "../../support/page-objects/contactInformationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "../../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../../support/page-objects/travelSummaryPage";
import { VisaCategoryPage } from "../../support/page-objects/visaCategoryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Date Validation: INVALID - Medical Screening in Future", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();
  const contactInformationPage = new ContactInformationPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();

  // Define variables to store test data
  let countryName: string = "";
  let passportNumber: string = "";
  let selectedVisaCategory: string;

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBSumPageFormat: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let futureScreeningDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    createTestFixtures();

    // Generate dates for 32 year old adult
    adultAge = 32;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    const dobDate = DateUtils.getAdultDateOfBirth(adultAge);
    adultDOBSumPageFormat = DateUtils.formatDateGOVUK(dobDate);

    // Generate valid passport dates
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // INVALID SCENARIO: Medical screening in the future (1 day from now)
    const futureScreening = DateUtils.getDateInFuture(0, 0, 1); // 1 day in the future
    futureScreeningDate = DateUtils.getDateComponents(futureScreening);

    // Log dates for debugging
    cy.log("=== INVALID SCENARIO: MEDICAL SCREENING IN FUTURE ===");
    cy.log(`DOB Formatted: ${adultDOBSumPageFormat}`);
    cy.log(
      `Medical Screening: ${futureScreeningDate.day}/${futureScreeningDate.month}/${futureScreeningDate.year} (1 DAY IN FUTURE - INVALID!)`,
    );
    cy.log(`VIOLATION: Medical screening date cannot be in the future`);
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

  it("should reject medical screening date that is in the future", () => {
    // Search for new applicant
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.clickCreateNewApplicant();

    // Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details - Page 1: Personal Information
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Test Future Medical")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .submitForm();

    // Fill Applicant Details - Page 2: Passport Information
    passportInformationPage.verifyPageLoaded();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .fillIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillExpiryDate(passportExpiryDate.day, passportExpiryDate.month, passportExpiryDate.year)
      .submitForm();

    // Fill Applicant Details - Page 3: Contact Information
    contactInformationPage.verifyPageLoaded();
    contactInformationPage
      .fillAddressLine1("999 Future Street")
      .fillTownOrCity("Future City")
      .fillProvinceOrState("Future Province")
      .selectCountry(countryName)
      .fillPostcode("FUT 0RE")
      .submitForm();

    // Upload Applicant Photo
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage.uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg");
    applicantPhotoUploadPage.clickContinue();

    // Check Photo page
    cy.url().should("include", "/check-visa-applicant-photo");
    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.verifyPageHeadingText();
    checkPhotoPage.verifyUploadedPhotoDisplayed();
    checkPhotoPage.verifyFilenameDisplayed();
    checkPhotoPage.verifyImageLayout();
    checkPhotoPage.verifyRadioButtonsExist();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();

    // Applicant Summary - verify details were saved correctly
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.verifyAllSummaryValues({
      "Full name": "Test Future Medical",
      Sex: "Male",
      Nationality: countryName,
      "Date of birth": adultDOBSumPageFormat,
      "Passport number": passportNumber,
    });
    applicantSummaryPage.confirmDetails();

    // Applicant Confirmation
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();
    applicantConfirmationPage.clickContinue();

    // TB Progress Tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("UK travel information");

    // Select random category and store the selected value
    visaCategoryPage.selectRandomVisaCategory();
    visaCategoryPage.getSelectedVisaCategory().then((category) => {
      selectedVisaCategory = category;
      cy.log(`Selected random visa category: ${selectedVisaCategory}`);

      // Store as alias for use throughout the test
      cy.wrap(selectedVisaCategory).as("selectedVisa");
    });

    // Click continue to proceed to travel information page
    visaCategoryPage.clickContinue();

    // NOW verify the travel information page
    travelInformationPage.verifyPageLoaded();

    /// Fill travel information (NO visa type parameter needed)
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "Flat 201, Future Building",
      ukAddressLine2: "Floor 2",
      ukTownOrCity: "Manchester",
      ukPostcode: "FT2 3AB",
      mobileNumber: "07700900123",
      email: "pets.tester@hotmail.com",
    });

    // Submit the form
    travelInformationPage.submitForm();

    // Review Travel Summary with random visa type
    travelSummaryPage.verifyPageLoaded();

    // Verify the random visa type is valid and displayed correctly
    travelSummaryPage.verifyVisaTypeIsValid();

    // Verify details by clicking change links and checking fields
    travelSummaryPage.clickChangeLink("Address line 1 (optional)");
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.go("back");

    travelSummaryPage.clickChangeLink("Town or city (optional)");
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.go("back");

    travelSummaryPage.clickChangeLink("UK phone number (optional)");
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.go("back");

    // Submit the summary page
    travelSummaryPage.submitForm();

    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // TB Progress Tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening Page - Enter INVALID future date
    medicalScreeningPage.verifyPageLoaded();

    cy.log("ATTEMPTING INVALID MEDICAL SCREENING DATE: Future date");
    cy.log("EXPECTED: Validation error should be displayed");

    // Fill medical screening with INVALID future date
    medicalScreeningPage.fillMedicalScreeningDate(
      futureScreeningDate.day,
      futureScreeningDate.month,
      futureScreeningDate.year,
    );
    medicalScreeningPage
      .selectTBSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.");

    // Attempt to continue - should fail validation
    medicalScreeningPage.submitForm();

    // Verify error summary is displayed
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary__title")
      .should("be.visible")
      .and("contain.text", "There is a problem");

    // Verify the specific error message in error summary
    cy.get(".govuk-error-summary__body")
      .should("be.visible")
      .and("contain.text", "The medical screening date must be today or in the past");

    // Verify inline error message on the medical screening date field
    cy.get(".govuk-error-message")
      .should("be.visible")
      .and("contain.text", "The medical screening date must be today or in the past");
  });
});
