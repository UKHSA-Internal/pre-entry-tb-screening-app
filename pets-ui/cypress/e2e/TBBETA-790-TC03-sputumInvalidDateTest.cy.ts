// Invalid Date Test on Sputum Page
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

describe("Invalid Date Test On Sputum Collection Page", () => {
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

  it("should display error messages for invalid dates (day 32, month 13, future year)", () => {
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
      .fillFullName("John Invalid - Tests")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate("15", "03", "1990")
      .fillPassportIssueDate("10", "05", "2018")
      .fillPassportExpiryDate("10", "05", "2028")
      .fillAddressLine1("123 Test Street")
      .fillAddressLine2("Test Area")
      .fillAddressLine3("Test District")
      .fillTownOrCity("Test City")
      .fillProvinceOrState("Test State")
      .selectAddressCountry(countryName)
      .fillPostcode("12345")
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
        ukAddressLine1: "456 Park Lane",
        ukAddressLine2: "Floor 2",
        ukTownOrCity: "Manchester",
        ukPostcode: "M1 1AA",
        mobileNumber: "07700900123",
        email: "pets.tester@hotmail.com",
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
      .fillAge("30")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Normal examination findings.")
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

    // Fill sputum collection data with invalid dates
    const invalidSputumData = {
      sample1: {
        date: { day: "32", month: "06", year: "2024" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "15", month: "13", year: "2024" },
        collectionMethod: "Induced",
      },
      sample3: {
        date: { day: "20", month: "08", year: "2030" },
        collectionMethod: "Gastric lavage",
      },
    };

    // Fill all samples with invalid data
    sputumCollectionPage.fillAllSamples(invalidSputumData);

    // Verify the form is filled with invalid data
    sputumCollectionPage.verifyFormFilledWith(invalidSputumData);

    // Attempt to save and continue
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify error summary is displayed
    sputumCollectionPage.validateErrorSummaryVisible();

    // Verify specific error messages for invalid dates
    sputumCollectionPage.validateErrorSummaryContains([
      "Sputum sample 1 date must be a valid date",
      "Sputum sample 2 date must be a valid date",
      "Sputum sample 3 date must be today or in the past",
    ]);

    // Verify individual field errors
    sputumCollectionPage.validateSample1DateError("Sputum sample 1 date must be a valid date");
    sputumCollectionPage.validateSample2DateError("Sputum sample 2 date must be a valid date");
    sputumCollectionPage.validateSample3DateError(
      "Sputum sample 3 date must be today or in the past",
    );

    // Verify error styling is applied
    sputumCollectionPage.verifyDateFieldErrorStates();
    sputumCollectionPage.verifyNoCollectionMethodErrors();

    // Verify we remain on the sputum collection page
    cy.url().should("include", "/sputum-collection");
  });
});
