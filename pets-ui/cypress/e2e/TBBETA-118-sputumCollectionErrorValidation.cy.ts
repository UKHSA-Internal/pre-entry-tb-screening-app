//Pets Private Beta E2E Test with Sputum Collection
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

describe("PETS Application Sputum Collection Validation", () => {
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
  /* const tbClearanceCertificatePage = new TbClearanceCertificatePage();
  const tbClearanceCertificateSummaryPage = new TbClearanceCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage(); */
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

  it("should prevent user from preceeding without providing sputum sample collection information and display error messages", () => {
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
      .selectNationality(countryName)
      .fillBirthDate("15", "03", "2000")
      .fillPassportIssueDate("10", "05", "2018")
      .fillPassportExpiryDate("10", "05", "2028")
      .fillAddressLine1("123 High Street")
      .fillAddressLine2("Apartment 4B")
      .fillAddressLine3("Downtown")
      .fillTownOrCity("London")
      .fillProvinceOrState("Greater London")
      .selectAddressCountry(countryName)
      .fillPostcode("SW1A 1AA")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    applicantPhotoUploadPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

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
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);

    //confirm above details to proceed to next page
    applicantSummaryPage.confirmDetails();

    // Verify applicant confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();

    // Continue to travel information Page
    applicantConfirmationPage.clickContinueToTravelInformation();

    travelInformationPage.verifyPageLoaded();

    // Fill in travel information
    travelInformationPage
      .selectVisaType(visaType)
      .fillAddressLine1("456 Park Lane")
      .fillAddressLine2("Floor 2")
      .fillTownOrCity("Manchester")
      .fillPostcode("M1 1AA")
      .fillMobileNumber("07700900123")
      .fillEmail("pets.tester@hotmail.com")
      .submitForm();

    // Review Travel Summary
    travelSummaryPage.verifyPageLoaded();

    // Verify all required values are present on the summary page first
    travelSummaryPage.verifyRequiredSummaryValues(
      visaType,
      "456 Park Lane",
      "Manchester",
      "M1 1AA",
      "07700900123",
      "pets.tester@hotmail.com",
    );

    // Verify details by clicking change links and checking fields
    travelSummaryPage.clickChangeLink("Visa type");
    travelSummaryPage.verifyFieldValueOnChangePage("Visa type", visaType);

    travelSummaryPage.clickChangeLink("UK address line 1");
    travelSummaryPage.verifyFieldValueOnChangePage("UK address line 1", "456 Park Lane");

    travelSummaryPage.clickChangeLink("UK town or city");
    travelSummaryPage.verifyFieldValueOnChangePage("UK town or city", "Manchester");

    travelSummaryPage.clickChangeLink("UK mobile number");
    travelSummaryPage.verifyFieldValueOnChangePage("UK mobile number", "07700900123");
    // Submit the summary page
    travelSummaryPage.submitForm();

    // Travel Confirmation confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.submitForm();

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

    // Verify chest X-ray page
    chestXrayPage.verifyPageLoaded();

    // Check applicant information is displayed
    chestXrayPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Select "Yes" for X-ray taken and continue
    chestXrayPage.selectXrayTakenYes().clickContinue();

    // Verify X-ray upload page using
    chestXrayUploadPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    chestXrayUploadPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

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

    // Check applicant information is displayed correctly
    chestXrayFindingsPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Complete X-ray findings
    chestXrayFindingsPage
      .selectXrayResultNormal()
      .selectMinorFindings(["1.1 Single fibrous streak or band or scar"])
      .clickSaveAndContinue();

    // Complete Sputum Collection Question
    sputumQuestionPage.verifyPageLoaded();

    //Select "Yes" for Sputum Collection
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Verify redirection to chest X-ray summary page
    cy.url().should("include", "/chest-xray-summary");

    // Verify chest X-ray summary page
    chestXraySummaryPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    chestXraySummaryPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Verify X-ray summary information
    chestXraySummaryPage.verifyXraySummaryInfo({
      "Select X-ray status": "Yes",
      "Enter radiological outcome": "Chest X-ray normal",
    });

    // Verify sputum field now shows "Yes"
    chestXraySummaryPage.verifySummaryValue("Sputum required?", "Yes");

    // Verify change links exist
    chestXraySummaryPage.verifyChangeLinksExist();

    // Save and continue to the next page
    chestXraySummaryPage.clickSaveAndContinue();

    // Verify chest X-ray confirmation page
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.verifyConfirmationPanel();
    chestXrayConfirmationPage.verifyNextStepsSection();
    chestXrayConfirmationPage.verifyBreadcrumbNavigation();
    chestXrayConfirmationPage.verifyServiceName();
    chestXrayConfirmationPage.clickContinueButton();

    // Verify redirection to TB Screening Progress Tracker page
    cy.url().should("include", "/tracker");

    // Verify TB Screening Progress Tracker page
    tbProgressTrackerPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Verify task status information
    tbProgressTrackerPage.verifyVisaApplicantDetailsCompleted();

    // Verify complete all sections text
    tbProgressTrackerPage.verifyCompleteAllSectionsText();

    // Verify task links exist
    tbProgressTrackerPage.verifyTaskLinksExist();

    // Verify service name
    tbProgressTrackerPage.verifyServiceName();

    // Verify task statuses - Sputum should now be "Not yet started" instead of "Not required"
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "Sputum collection and results": "Not yet started",
      "TB certificate declaration": "Not yet started",
    });

    //Complete Sputum Collection
    // Click on Sputum collection link from the progress tracker
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Verify sputum collection page loaded
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Test error validation
    sputumCollectionPage.clickSaveAndContinueToResults();
    sputumCollectionPage.validateAllRequiredFieldErrors();
    sputumCollectionPage.verifyFieldErrorStates();
  });
});
