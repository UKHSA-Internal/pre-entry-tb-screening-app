// PETS Date Validation Test: INVALID - Medical Screening More Than 6 Months Old
// VIOLATION: Medical screening date cannot be more than 6 months in the past
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

describe("PETS Date Validation: INVALID - Medical Screening > 6 Months Old", () => {
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
  let invalidScreeningDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    createTestFixtures();

    // Generate dates for 30 year old adult
    adultAge = 30;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    const dobDate = DateUtils.getAdultDateOfBirth(adultAge);
    adultDOBSumPageFormat = DateUtils.formatDateGOVUK(dobDate);

    // Generate valid passport dates
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // INVALID SCENARIO: Medical screening 6 months + 1 day in the past
    const invalidScreening = DateUtils.getDateInPast(6, 0, 1); // 6 months and 1 day ago
    invalidScreeningDate = DateUtils.getDateComponents(invalidScreening);

    // Log dates for debugging
    cy.log("=== INVALID SCENARIO: MEDICAL SCREENING > 6 MONTHS OLD ===");
    cy.log(
      `Medical Screening: ${invalidScreeningDate.day}/${invalidScreeningDate.month}/${invalidScreeningDate.year} (6 MONTHS + 1 DAY AGO - INVALID!)`,
    );
    cy.log(`VALIDATION: Medical screening cannot be more than 6 months in the past`);
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

  it("should reject medical screening date that is more than 6 months old", () => {
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
      .fillFullName("Test Old Medical")
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
      .fillAddressLine1("100 Old Medical Street")
      .fillTownOrCity("Old City")
      .fillProvinceOrState("Old Province")
      .selectCountry(countryName)
      .fillPostcode("O6M 0LD")
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
      "Full name": "Test Old Medical",
      Sex: "Male",
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
      ukAddressLine1: "221B Baker Street",
      ukAddressLine2: "",
      ukTownOrCity: "London",
      ukPostcode: "NW1 6XE",
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

    // Travel Confirmation Page
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // TB Progress Tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening Page - Enter INVALID date (> 6 months old)
    medicalScreeningPage.verifyPageLoaded();

    // ATTEMPTING INVALID MEDICAL SCREENING DATE: > 6 months old
    // Fill medical screening with INVALID date
    medicalScreeningPage.fillMedicalScreeningDate(
      invalidScreeningDate.day,
      invalidScreeningDate.month,
      invalidScreeningDate.year,
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

    // Verify we're still on the medical screening page
    cy.url().should("include", "/record-medical-history-tb-symptoms");

    // Verify error summary is displayed
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary__title")
      .should("be.visible")
      .and("contain.text", "There is a problem");

    // Verify the specific error message in error summary
    cy.get(".govuk-error-summary__body")
      .should("be.visible")
      .and(
        "contain.text",
        "The date of the medical screening must be today or in the past 6 months",
      );

    // Verify inline error message on the medical screening date field
    cy.get(".govuk-error-message")
      .should("be.visible")
      .and(
        "contain.text",
        "The date of the medical screening must be today or in the past 6 months",
      );
  });
});
