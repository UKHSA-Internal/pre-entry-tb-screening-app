//Pets Private Beta E2E Test with Sputum Collection
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { ChestXrayFindingsPage } from "../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXrayUploadPage } from "../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../support/page-objects/medicalConfirmationPage";
import { MedicalSummaryPage } from "../support/page-objects/medicalSummaryPage";
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
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
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
      .fillFullName("Jane Smith")
      .selectSex("Female")
      .selectNationality(countryName) // Use country code for form filling
      .fillBirthDate("15", "03", "2000")
      .fillPassportIssueDate("10", "05", "2018")
      .fillPassportExpiryDate("10", "05", "2028")
      .fillAddressLine1("123 High Street")
      .fillAddressLine2("Apartment 4B")
      .fillAddressLine3("Downtown")
      .fillTownOrCity("London")
      .fillProvinceOrState("Greater London")
      .selectAddressCountry(countryName) // Use country code for form filling
      .fillPostcode("SW1A 1AA")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    //Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Continue to Applicant Summary page
    applicantPhotoUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/applicant-summary");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Name", "Jane Smith");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName); // Use country name for validation
    applicantSummaryPage.verifySummaryValue("Country of nationality", countryName);
    applicantSummaryPage.verifySummaryValue("Country", countryName);

    // Confirm above details to proceed to next page
    applicantSummaryPage.confirmDetails();

    // Verify applicant confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();

    // Click continue - this goes to tracker
    applicantConfirmationPage.clickContinue();

    // Verify we're on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to travel information from the tracker
    tbProgressTrackerPage.clickTaskLink("Travel information");

    // NOW verify the travel information page
    travelInformationPage.verifyPageLoaded();

    // Fill travel information with random visa type and capture the selected visa
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
        // Store the selected visa type for later use
        selectedVisaType = randomVisa;
        cy.log(`Selected random visa type: ${selectedVisaType}`);

        // Store as alias for use throughout the test
        cy.wrap(selectedVisaType).as("selectedVisa");
      });

    // Submit the form
    travelInformationPage.submitForm();

    // Review Travel Summary with random visa type
    travelSummaryPage.verifyPageLoaded();

    // Verify the random visa type is valid and displayed correctly
    travelSummaryPage.verifyVisaTypeIsValid();

    // Verify details by clicking change links and checking fields
    travelSummaryPage.clickChangeLink("UK address line 1");
    cy.url().should("include", "/travel-details");
    cy.go("back");

    travelSummaryPage.clickChangeLink("UK town or city");
    cy.url().should("include", "/travel-details");
    cy.go("back");

    travelSummaryPage.clickChangeLink("UK mobile number");
    cy.url().should("include", "/travel-details");
    cy.go("back");

    // Submit the summary page
    travelSummaryPage.submitForm();

    // Travel Confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to medical screening from the tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening Page
    medicalScreeningPage.verifyPageLoaded();

    medicalScreeningPage
      .fillAge("25")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.")
      .submitForm();

    // Verify redirection to medical summary
    medicalScreeningPage.verifyRedirectedToSummary();
    medicalSummaryPage.verifyPageLoaded();

    //Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: "25",
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "No abnormalities detected. Patient appears healthy.",
    });

    // Confirm medical details
    medicalSummaryPage.confirmDetails();

    // Verify medical confirmation page and continue to chest X-ray
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to chest X-ray from the tracker
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");

    // Verify chest X-ray page
    chestXrayPage.verifyPageLoaded();

    // Select "Yes" for X-ray taken and continue
    chestXrayPage.selectXrayTakenYes().clickContinue();

    // Verify X-ray upload page using
    chestXrayUploadPage.verifyPageLoaded();

    // Upload Chest X-ray file
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();

    //Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Continue to X-ray findings page
    chestXrayUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

    // Verify X-ray findings page
    chestXrayFindingsPage.verifyPageLoaded();

    // Complete X-ray findings
    chestXrayFindingsPage
      .selectXrayResultNormal()
      .selectMinorFindings(["1.1 Single fibrous streak or band or scar"])
      .clickSaveAndContinue();

    //Complete Sputum Collection
    sputumQuestionPage.verifyPageLoaded();

    // Continue without selecting sputum option
    sputumQuestionPage.clickContinue();

    // Verify error is displayed
    sputumQuestionPage.verifyProblemHeading();
    sputumQuestionPage.verifyErrorSummaryDisplayed();
    sputumQuestionPage.verifyErrorSummaryMessage();
    sputumQuestionPage.verifyFieldErrorMessage();
  });
});
