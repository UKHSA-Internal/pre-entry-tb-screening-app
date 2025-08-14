// Empty Collection Method Test on Sputum Page
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../support/page-objects/medicalSummaryPage";
import { SputumCollectionPage } from "../support/page-objects/sputumCollectionPage";
import { SputumQuestionPage } from "../support/page-objects/sputumQuestionPage";
import { TBProgressTrackerPage } from "../support/page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../support/page-objects/travelSummaryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../support/test-helpers";

describe("Empty Collection Method Test On Sputum Collection Page", () => {
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
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";
  let selectedVisaType: string = "";

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
    countryCode = randomCountry?.value; // For form filling (e.g., "BRB")
    countryName = randomCountry?.label; // For validation (e.g., "Barbados")
    passportNumber = getRandomPassportNumber();
    tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
    cy.log(`Using TB certificate number: ${tbCertificateNumber}`);
  });

  it("should display error messages for missing collection methods with valid dates", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Fill applicant details
    applicantDetailsPage.verifyPageLoaded();
    applicantDetailsPage
      .fillFullName("Jane Sputum-Collection")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("20", "08", "1985")
      .fillPassportIssueDate("15", "01", "2019")
      .fillPassportExpiryDate("15", "01", "2029")
      .fillAddressLine1("789 Method Street")
      .fillAddressLine2("Unit 5")
      .fillAddressLine3("Collection Area")
      .fillTownOrCity("Test Town")
      .fillProvinceOrState("Test Province")
      .selectAddressCountry(countryName)
      .fillPostcode("54321")
      .submitForm();

    // Complete photo upload
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();
    applicantPhotoUploadPage.clickContinue();

    // Complete applicant summary
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.confirmDetails();
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.clickContinue();

    // Complete travel information
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("Travel information");
    travelInformationPage.verifyPageLoaded();
    travelInformationPage
      .fillCompleteFormWithRandomVisa({
        ukAddressLine1: "321 Collection Ave",
        ukAddressLine2: "Suite 10",
        ukTownOrCity: "Liverpool",
        ukPostcode: "L1 2AB",
        mobileNumber: "07700900456",
        email: "pets.tester3@hotmail.com",
      })
      .then((randomVisa) => {
        selectedVisaType = randomVisa;
        cy.log(`Selected random visa type: ${selectedVisaType}`);
      });
    travelInformationPage.submitForm();
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.submitForm();
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Complete medical screening
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillAge("38")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Patient shows no signs of TB symptoms.")
      .submitForm();
    medicalSummaryPage.verifyPageLoaded();
    medicalSummaryPage.confirmDetails();
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.clickContinueButton();

    // Complete chest X-ray
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenYes().clickContinue();
    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();
    chestXrayUploadPage.clickContinue();
    chestXrayFindingsPage.verifyPageLoaded();
    chestXrayFindingsPage
      .selectXrayResultNormal()
      .selectMinorFindings(["1.1 Single fibrous streak or band or scar"])
      .clickSaveAndContinue();
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();
    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.clickSaveAndContinue();
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.clickContinueButton();

    // Navigate to sputum collection
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Fill sputum collection data with valid dates but missing collection methods
    const validDatesNoMethods = {
      sample1: {
        date: { day: "10", month: "06", year: "2024" },
        collectionMethod: "", // Empty collection method
      },
      sample2: {
        date: { day: "12", month: "06", year: "2024" },
        collectionMethod: "", // Empty collection method
      },
      sample3: {
        date: { day: "14", month: "06", year: "2024" },
        collectionMethod: "", // Empty collection method
      },
    };

    // Fill dates only (collection methods remain empty)
    sputumCollectionPage.fillSample1Date(validDatesNoMethods.sample1.date);
    sputumCollectionPage.fillSample2Date(validDatesNoMethods.sample2.date);
    sputumCollectionPage.fillSample3Date(validDatesNoMethods.sample3.date);

    // Verify dates are filled correctly
    cy.get('[data-testid="date-sample-1-taken-day"]').should("have.value", "10");
    cy.get('[data-testid="date-sample-1-taken-month"]').should("have.value", "06");
    cy.get('[data-testid="date-sample-1-taken-year"]').should("have.value", "2024");

    // Attempt to save and continue without selecting collection methods
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify error summary is displayed
    sputumCollectionPage.validateErrorSummaryVisible();

    // Verify specific error messages for missing collection methods
    sputumCollectionPage.validateErrorSummaryContains([
      "Enter Sputum sample 1 collection method",
      "Enter Sputum sample 2 collection method",
      "Enter Sputum sample 3 collection method",
    ]);

    // Verify individual field errors for collection methods
    sputumCollectionPage.validateSample1CollectionMethodError();
    sputumCollectionPage.validateSample2CollectionMethodError();
    sputumCollectionPage.validateSample3CollectionMethodError();

    // Verify we remain on the sputum collection page
    cy.url().should("include", "/sputum-collection");
  });
});
