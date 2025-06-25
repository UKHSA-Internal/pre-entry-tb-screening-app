//Pets Private Beta E2E Test with Sputum Collection - Sputum Sample Error Validatiion
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { CheckSputumSampleInfoPage } from "../support/page-objects/checkSputumSampleInfoPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "../support/page-objects/chestXrayUploadPage";
import { EnterSputumSampleResultsPage } from "../support/page-objects/enterSputumSampleResultsPage";
import { MedicalConfirmationPage } from "../support/page-objects/medicalConfirmationPage";
import { MedicalSummaryPage } from "../support/page-objects/medicalSummaryPage";
import { SputumCollectionPage } from "../support/page-objects/sputumCollectionPage";
import { SputumConfirmationPage } from "../support/page-objects/sputumConfirmationPage";
import { SputumQuestionPage } from "../support/page-objects/sputumQuestionPage";
import { TBProgressTrackerPage } from "../support/page-objects/tbProgressTrackerPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../support/test-helpers";
import { ApplicantDetailsPage } from "./../support/page-objects/applicantDetailsPage";
import { MedicalScreeningPage } from "./../support/page-objects/medicalScreeningPage";
import { TravelConfirmationPage } from "./../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "./../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "./../support/page-objects/travelSummaryPage";

describe("PETS Application End-to-End Tests with Sputum Collection", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const sputumQuestionPage = new SputumQuestionPage();
  const sputumCollectionPage = new SputumCollectionPage();
  const sputumConfirmationPage = new SputumConfirmationPage();
  const checkSputumSampleInfoPage = new CheckSputumSampleInfoPage();
  const enterSputumSampleResultsPage = new EnterSputumSampleResultsPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaType = "Students";

  // Define variables to store test data
  let countryName: string;
  let passportNumber: string;
  let tbCertificateNumber: string;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.value;
    passportNumber = getRandomPassportNumber();
    tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
    cy.log(`Using TB certificate number: ${tbCertificateNumber}`);
  });

  it("should display error messages where NO sputum sample results is selected", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details
    applicantDetailsPage
      .fillFullName("John Doe")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate("15", "03", "1990")
      .fillPassportIssueDate("10", "05", "2018")
      .fillPassportExpiryDate("10", "05", "2028")
      .fillAddressLine1("123 Test Street")
      .fillAddressLine2("Apartment 1A")
      .fillAddressLine3("Test Area")
      .fillTownOrCity("London")
      .fillProvinceOrState("Greater London")
      .selectAddressCountry(countryName)
      .fillPostcode("SW1A 1AA")
      .submitForm();

    // Upload Applicant Photo
    cy.url().should("include", "/applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess()
      .clickContinue();

    // Confirm Applicant Summary
    cy.url().should("include", "/applicant-summary");
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.confirmDetails();

    // Continue to travel information
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.clickContinueToTravelInformation();

    // Fill travel information
    travelInformationPage.verifyPageLoaded();
    travelInformationPage
      .selectVisaType(visaType)
      .fillAddressLine1("456 Park Lane")
      .fillAddressLine2("Floor 2")
      .fillTownOrCity("Manchester")
      .fillPostcode("M1 1AA")
      .fillMobileNumber("07700900123")
      .fillEmail("test.email@example.com")
      .submitForm();

    // Confirm travel summary
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.submitForm();
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.submitForm();

    // Complete medical screening
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillAge("25")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("No abnormalities detected.")
      .submitForm();

    // Confirm medical summary
    medicalSummaryPage.verifyPageLoaded();
    medicalSummaryPage.confirmDetails();
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.clickContinueButton();

    // Complete chest X-ray
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenYes().clickContinue();

    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess()
      .clickContinue();

    chestXrayFindingsPage.verifyPageLoaded();
    chestXrayFindingsPage
      .selectXrayResultNormal()
      .selectMinorFindings(["1.1 Single fibrous streak or band or scar"])
      .clickSaveAndContinue();

    // Select "Yes" for sputum collection
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Complete chest X-ray summary
    cy.url().should("include", "/chest-xray-summary");
    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.clickSaveAndContinue();
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.clickContinueButton();

    // Navigate to sputum collection from progress tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Complete sputum collection with sample data
    sputumCollectionPage.verifyPageLoaded();
    const sputumData = {
      sample1: {
        date: { day: "10", month: "03", year: "2025" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "11", month: "03", year: "2025" },
        collectionMethod: "Induced",
      },
      sample3: {
        date: { day: "12", month: "03", year: "2025" },
        collectionMethod: "Coughed up",
      },
    };
    sputumCollectionPage.fillAllSamples(sputumData);
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify Enter Sputum Sample Results page loaded
    cy.url().should("include", "/enter-sputum-sample-results");
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.verifyAllPageElements();

    // Submit form with no sample results selected
    // Verify all fields are empty on navigating to the sample results page
    enterSputumSampleResultsPage.verifyAllFieldsEmpty();

    // Submit form without filling any results
    enterSputumSampleResultsPage.clickSaveAndContinue();

    // Verify error validation for empty form
    enterSputumSampleResultsPage.verifyFormValidationForEmptyForm();

    // Verify error summary is visible with correct message
    enterSputumSampleResultsPage.validateErrorSummaryVisible();
    enterSputumSampleResultsPage.validateNoSamplesEnteredError();
  });
});
