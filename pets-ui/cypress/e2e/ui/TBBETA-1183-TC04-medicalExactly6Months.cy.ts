// PETS Date Validation Test: BOUNDARY VALID - Medical Screening Exactly 6 Months Ago
// VALIDATION: Medical screening date is exactly 6 months in the past (boundary test case)
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
import { ContactInformationPage } from "../../support/page-objects/contactInformationPage";
//import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
//import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
//import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
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

describe("PETS Date Validation: BOUNDARY VALID - Medical Screening Exactly 6 Months", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();
  const contactInformationPage = new ContactInformationPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  //const chestXrayPage = new ChestXrayPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  //const medicalSummaryPage = new MedicalSummaryPage();
  //const medicalConfirmationPage = new MedicalConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();

  // Define variables to store test data
  let countryName: string = "";
  let passportNumber: string = "";
  let selectedVisaCategory: string;

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBFormatted: string;
  let adultDOBSumPageFormat: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let validScreeningDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    createTestFixtures();

    // Generate dates for 31 year old adult
    adultAge = 31;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    adultDOBFormatted = DateUtils.normalizeDateForComparison(
      DateUtils.formatDateDDMMYYYY(DateUtils.getAdultDateOfBirth(adultAge)),
    );
    const dobDate = DateUtils.getAdultDateOfBirth(adultAge);
    adultDOBSumPageFormat = DateUtils.formatDateGOVUK(dobDate);

    // Generate valid passport dates
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // BOUNDARY SCENARIO: Medical screening exactly 6 months ago
    const validScreening = DateUtils.getDateInPast(6, 0, 0); // Exactly 6 months ago
    validScreeningDate = DateUtils.getDateComponents(validScreening);

    // Log dates for debugging
    cy.log("=== BOUNDARY VALID SCENARIO: MEDICAL SCREENING EXACTLY 6 MONTHS ===");
    cy.log(`DOB Formatted: ${adultDOBFormatted}`);
    cy.log(
      `Medical Screening: ${validScreeningDate.day}/${validScreeningDate.month}/${validScreeningDate.year} (EXACTLY 6 MONTHS AGO - VALID!)`,
    );
    cy.log(`SUCCESS: Medical screening at boundary of 6 month limit`);
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

  it("should accept medical screening date that is exactly 6 months old", () => {
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
    cy.acceptCookies();
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Test Six Month Medical")
      .selectSex("Female")
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
      .fillAddressLine1("600 Boundary Street")
      .fillTownOrCity("Boundary City")
      .fillProvinceOrState("Boundary Province")
      .selectCountry(countryName)
      .fillPostcode("64109 BC")
      .submitForm();

    // Upload Applicant Photo
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage.uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg");
    applicantPhotoUploadPage.clickContinue();

    // Check Photo page
    cy.url().should("include", "/check-visa-applicant-photo");
    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();

    // Applicant Summary - verify details were saved correctly
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.verifyAllSummaryValues({
      "Full name": "Test Six Month Medical",
      Sex: "Female",
      Nationality: countryName,
      "Date of birth": adultDOBSumPageFormat,
      "Passport number": passportNumber,
    });
    applicantSummaryPage.confirmDetails();

    // Applicant Confirmation
    applicantConfirmationPage.verifyPageLoaded();
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

    // Travel Information Page
    travelInformationPage.verifyPageLoaded();

    // Fill out travel information form
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "10 Downing Street",
      ukAddressLine2: "Westminster",
      ukTownOrCity: "London",
      ukPostcode: "SW1A 2AA",
      mobileNumber: "07123456789",
      email: "pets.tester3@hotmail.com",
    });
    // Submit the form
    travelInformationPage.submitForm();

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

    // Medical Screening Page - Enter VALID date (exactly 6 months)
    medicalScreeningPage.verifyPageLoaded();

    // Fill medical screening with VALID boundary date
    medicalScreeningPage.fillMedicalScreeningDate(
      validScreeningDate.day,
      validScreeningDate.month,
      validScreeningDate.year,
    );
    medicalScreeningPage
      .selectTBSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.")
      .submitForm();

    // Verify validation error
    cy.url().should("include", "/record-medical-history-tb-symptoms");
    cy.get(".govuk-error-summary")
      .should("be.visible")
      .and(
        "contain.text",
        "The date of the medical screening must be today or in the past 6 months",
      );
    cy.get(".govuk-error-message")
      .should("be.visible")
      .and(
        "contain.text",
        "The date of the medical screening must be today or in the past 6 months",
      );
  });
});
