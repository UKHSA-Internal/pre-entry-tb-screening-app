// Mixed Validation Error Test on Sputum Page
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

describe("Mixed Validation Error Test On Sputum Collection Page", () => {
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

  it("should display multiple validation errors for mixed invalid data scenarios", () => {
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
      .fillFullName("Test Mixed")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate("05", "12", "1988")
      .fillPassportIssueDate("20", "03", "2020")
      .fillPassportExpiryDate("20", "03", "2030")
      .fillAddressLine1("555 Mixed Street")
      .fillAddressLine2("Validation Block")
      .fillAddressLine3("Error District")
      .fillTownOrCity("Test City")
      .fillProvinceOrState("Test State")
      .selectAddressCountry(countryName)
      .fillPostcode("MX123")
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
        ukAddressLine1: "999 Mixed Ave",
        ukAddressLine2: "Level 3",
        ukTownOrCity: "Birmingham",
        ukPostcode: "B1 3CD",
        mobileNumber: "07700900789",
        email: "pets.tester2@hotmail.com",
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
      .fillAge("35")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Mixed validation test examination.")
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

    // Fill sputum collection data with mixed validation errors:
    // Sample 1: Missing day, has collection method
    // Sample 2: Invalid month, missing collection method
    // Sample 3: Complete but future date
    const mixedErrorData = {
      sample1: {
        date: { day: "", month: "06", year: "2024" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "15", month: "15", year: "2024" },
        collectionMethod: "",
      },
      sample3: {
        date: { day: "20", month: "12", year: "2026" },
        collectionMethod: "Induced",
      },
    };

    // Fill sample 1 - missing day, has collection method
    sputumCollectionPage.fillSample1Date(mixedErrorData.sample1.date);
    sputumCollectionPage.selectSample1CollectionMethod(mixedErrorData.sample1.collectionMethod);

    // Fill sample 2 - invalid month, no collection method
    sputumCollectionPage.fillSample2Date(mixedErrorData.sample2.date);

    // Fill sample 3 - future date, has collection method
    sputumCollectionPage.fillSample3Date(mixedErrorData.sample3.date);
    sputumCollectionPage.selectSample3CollectionMethod(mixedErrorData.sample3.collectionMethod);

    // Verify the form is filled with mixed data
    cy.get('[data-testid="date-sample-1-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-1-taken-month"]').should("have.value", "06");
    cy.get('[data-testid="date-sample-1-taken-year"]').should("have.value", "2024");
    cy.get('[name="collectionMethodSample1"]').should("have.value", "Coughed up");

    cy.get('[data-testid="date-sample-2-taken-day"]').should("have.value", "15");
    cy.get('[data-testid="date-sample-2-taken-month"]').should("have.value", "15");
    cy.get('[data-testid="date-sample-2-taken-year"]').should("have.value", "2024");
    //cy.get('[name="collectionMethodSample2"]').should("have.value", "");

    cy.get('[data-testid="date-sample-3-taken-day"]').should("have.value", "20");
    cy.get('[data-testid="date-sample-3-taken-month"]').should("have.value", "12");
    cy.get('[data-testid="date-sample-3-taken-year"]').should("have.value", "2026");
    cy.get('[name="collectionMethodSample3"]').should("have.value", "Induced");

    // Attempt to save and continue
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify error summary is displayed
    sputumCollectionPage.validateErrorSummaryVisible();

    // Verify multiple error messages are shown
    sputumCollectionPage.validateErrorSummaryContains([
      "Sputum sample 1 date must include a day, month and year",
      "Sputum sample 2 date must be a valid date",
      "Enter Sputum sample 2 collection method",
      "Sputum sample 3 date must be today or in the past",
    ]);

    // Verify individual field errors
    sputumCollectionPage.validateSample1DateError(
      "Sputum sample 1 date must include a day, month and year",
    );
    sputumCollectionPage.validateSample2DateError("Sputum sample 2 date must be a valid date");
    sputumCollectionPage.validateSample2CollectionMethodError();
    sputumCollectionPage.validateSample3DateError(
      "Sputum sample 3 date must be today or in the past",
    );

    // Verify comprehensive error state
    sputumCollectionPage.validateFormErrors({
      sample1Date: "Sputum sample 1 date must include a day, month and year",
      sample2Date: "Sputum sample 2 date must be a valid date",
      sample2CollectionMethod: "Enter Sputum sample 2 collection method",
      sample3Date: "Sputum sample 3 date must be today or in the past",
    });

    // Verify we remain on the sputum collection page
    cy.url().should("include", "/sputum-collection");
  });
});
