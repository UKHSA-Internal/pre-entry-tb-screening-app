//PETS Private Beta E2E Test with TB Certificate Not Issued
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
import { TbCertificateConfirmationPage } from "../support/page-objects/tbCertificateConfirmationPage";
import { TbCertificateNotIssuedFormPage } from "../support/page-objects/tbCertificateNotIssuedFormPage";
import { TbCertificateQuestionPage } from "../support/page-objects/tbCertificateQuestionPage";
import { TbCertificateSummaryPage } from "../support/page-objects/tbCertificateSummaryPage";
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

describe("PETS Application End-to-End Tests with TB Certificate Not Issued", () => {
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
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();
  const tbCertificateNotIssuedFormPage = new TbCertificateNotIssuedFormPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
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

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
  });

  it("should complete the full application process with TB certificate not issued due to confirmed TB", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryCode) // Use country code for form filling
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
      .selectNationality(countryCode) // Use country code for form filling
      .fillBirthDate("20", "05", "1995")
      .fillPassportIssueDate("15", "08", "2019")
      .fillPassportExpiryDate("15", "08", "2029")
      .fillAddressLine1("789 Main Street")
      .fillAddressLine2("Suite 101")
      .fillAddressLine3("Stanbic Heights")
      .fillTownOrCity("Hallstatt")
      .fillProvinceOrState("Hallstatt")
      .selectAddressCountry(countryCode) // Use country code for form filling
      .fillPostcode("84209")
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
    applicantSummaryPage.verifySummaryValue("Name", "John Doe");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);
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
        ukAddressLine1: "123 Business Park",
        ukAddressLine2: "Building A",
        ukTownOrCity: "Leeds",
        ukPostcode: "LS1 1AA",
        mobileNumber: "07700900456",
        email: "john.doe.tb@hotmail.com",
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
      .fillAge("29")
      .selectTbSymptoms("Yes")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Applicant presents with persistent cough and night sweats.")
      .submitForm();

    // Verify redirection to medical summary
    medicalScreeningPage.verifyRedirectedToSummary();
    medicalSummaryPage.verifyPageLoaded();

    //Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: "29",
      tbSymptoms: "Yes",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "Applicant presents with persistent cough and night sweats.",
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

    // Complete X-ray findings with abnormal results indicating TB
    chestXrayFindingsPage
      .selectXrayResultAbnormal() // Select abnormal instead of normal
      .selectMajorFindings([
        "4.1 Apical fibronodular or fibrocalcific lesions or apical microcalcifications",
        "4.7 Any cavitating lesion or 'fluffy' or 'soft' lesions felt likely to represent active TB",
      ])
      .clickSaveAndContinue();

    // Complete Sputum Collection Question
    sputumQuestionPage.verifyPageLoaded();

    //Select "Yes" for Sputum Collection***
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Verify redirection to chest X-ray summary page
    cy.url().should("include", "/chest-xray-summary");

    // Verify chest X-ray summary page
    chestXraySummaryPage.verifyPageLoaded();

    // Verify X-ray summary information with abnormal results
    chestXraySummaryPage.verifyXraySummaryInfo({
      "Select X-ray status": "Yes",
      "Enter radiological outcome": "Old or active TB",
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
    chestXrayConfirmationPage.verifyServiceName();
    chestXrayConfirmationPage.clickContinueButton();

    // Verify redirection to TB Screening Progress Tracker page
    cy.url().should("include", "/tracker");

    // Verify TB Screening Progress Tracker page
    tbProgressTrackerPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "John Doe",
      "Date of birth": "20/05/1995",
      "Passport number": passportNumber,
    });

    // Verify task status information
    tbProgressTrackerPage.verifyVisaApplicantDetailsCompleted();

    // Verify task links exist
    tbProgressTrackerPage.verifyTaskLinksExist();

    // Verify service name
    tbProgressTrackerPage.verifyServiceName();

    // Verify task statuses
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "Sputum collection and results": "Not yet started",
      "TB certificate outcome": "Not yet started",
    });

    //Complete Sputum Collection
    // Click on Sputum collection link from the progress tracker
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Verify sputum collection page loaded
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Fill sputum collection data for all three samples
    const sputumData = {
      sample1: {
        date: { day: "15", month: "03", year: "2025" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "16", month: "03", year: "2025" },
        collectionMethod: "Induced",
      },
      sample3: {
        date: { day: "17", month: "03", year: "2025" },
        collectionMethod: "Coughed up",
      },
    };

    // Fill all samples
    sputumCollectionPage.fillAllSamples(sputumData);

    // Verify the form is filled correctly
    sputumCollectionPage.verifyFormFilledWith(sputumData);

    // Save and continue to results
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify redirection to Enter Sputum Sample Results page
    cy.url().should("include", "/enter-sputum-sample-results");

    // Verify Enter Sputum Sample Results page loaded
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.verifyAllPageElements();

    // Fill sputum sample results with positive results indicating TB
    enterSputumSampleResultsPage.fillWithAllPositiveResults();

    // Verify the form is filled correctly with positive results
    const testResultsData =
      EnterSputumSampleResultsPage.getTestSampleResultsData().allPositiveResults;
    enterSputumSampleResultsPage.verifyFormFilledWith(testResultsData);

    // Save and continue
    enterSputumSampleResultsPage.clickSaveAndContinue();

    // Verify page loads correctly
    checkSputumSampleInfoPage.verifyPageLoaded();

    // Verify all sample headings are present
    checkSputumSampleInfoPage.verifySampleHeadings();

    // Verify all required fields are present for each sample
    checkSputumSampleInfoPage.verifyRequiredFieldsPresent();

    // Validate sample data matches what was entered (with positive results)
    const expectedSampleData = {
      sample1: {
        dateTaken: "15/03/2025",
        collectionMethod: "Coughed up",
        smearResult: "Positive",
        cultureResult: "Positive",
      },
      sample2: {
        dateTaken: "16/03/2025",
        collectionMethod: "Induced",
        smearResult: "Positive",
        cultureResult: "Positive",
      },
      sample3: {
        dateTaken: "17/03/2025",
        collectionMethod: "Coughed up",
        smearResult: "Positive",
        cultureResult: "Positive",
      },
    };

    // Verify all sample information matches expected data
    checkSputumSampleInfoPage.verifyAllSampleInfo(expectedSampleData);

    // Verify change links are present and point to correct pages
    checkSputumSampleInfoPage.verifyChangeLinksExist();

    // Verify service name in header
    checkSputumSampleInfoPage.verifyServiceName();

    // Submit the summary and continue to next step
    checkSputumSampleInfoPage.clickSaveAndContinue();

    // Verify Sputum confirmation page
    sputumConfirmationPage.verifyPageLoaded();
    sputumConfirmationPage.verifyConfirmationPanel();
    sputumConfirmationPage.verifyNextStepsSection();
    sputumConfirmationPage.verifyServiceName();
    sputumConfirmationPage.clickContinueButton();

    // Verify redirection to TB Screening Progress Tracker page
    cy.url().should("include", "/tracker");

    // Verify TB Screening Progress Tracker page
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify we're back at the progress tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify sputum collection status is now "Completed"
    tbProgressTrackerPage.verifyTaskStatus("Sputum collection and results", "Completed");

    // All tasks should now be completed except TB certificate declaration
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "Sputum collection and results": "Completed",
      "TB certificate outcome": "Not yet started",
    });

    // Click on TB certificate declaration to continue
    tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

    // Verify TB Certificate Question page loaded
    tbCertificateQuestionPage.verifyPageLoaded();

    // Select "No" for TB clearance certificate issuance (certificate NOT issued)
    tbCertificateQuestionPage.selectTbClearanceOption("No");

    // Verify "No" is selected
    tbCertificateQuestionPage.verifyRadioSelection("No");

    // Submit the form and continue to TB Certificate Not Issued Form page
    tbCertificateQuestionPage.clickContinue();

    // Verify redirection to TB Certificate Not Issued Form page
    cy.url().should("include", "/tb-certificate-not-issued");

    // Verify TB Certificate Not Issued Form page is loaded
    tbCertificateNotIssuedFormPage.verifyPageLoaded();

    // Verify all page elements are present
    tbCertificateNotIssuedFormPage.verifyAllPageElements();

    // Verify all fields are initially empty
    tbCertificateNotIssuedFormPage.verifyAllFieldsEmpty();

    // Fill TB Certificate Not Issued Form details
    const tbCertificateNotIssuedData = {
      reasonNotIssued: "Confirmed or suspected TB" as const, // Reason for not issuing
      declaringPhysicianName: "Dr. Magic Johnson",
      physicianComments:
        "Applicant has positive sputum results and abnormal chest X-ray findings consistent with active pulmonary tuberculosis. Certificate cannot be issued at this time.",
    };

    // Fill the form with valid data (now uses label-based selection internally)
    tbCertificateNotIssuedFormPage.fillFormWithValidData(tbCertificateNotIssuedData);

    // Verify the form is filled correctly
    tbCertificateNotIssuedFormPage.verifyFormFilledWith(tbCertificateNotIssuedData);

    // Submit the form and continue
    tbCertificateNotIssuedFormPage.clickContinue();

    // Verify redirection to TB Certificate Summary page (not issued scenario)
    cy.url().should("include", "/tb-certificate-summary");

    // Verify TB Certificate Summary page loaded in "not issued" mode
    tbCertificateSummaryPage.verifyPageLoaded();

    // Verify page is in certificate not issued mode
    tbCertificateSummaryPage.verifyCertificateNotIssuedMode();

    // Verify all page elements and structure for not issued scenario
    tbCertificateSummaryPage.verifyAllPageElements();

    // Verify applicant information section and data
    tbCertificateSummaryPage.verifyApplicantInfoSection();
    tbCertificateSummaryPage.verifyApplicantInfo({
      Name: "John Doe",
      "Date of birth": "20 May 1995",
      "Passport number": passportNumber,
      Sex: "Male",
    });

    // Verify certificate not issued information
    tbCertificateSummaryPage.verifyCertificateNotIssuedInfo({
      "Reason for not issuing certificate": "Confirmed or suspected TB",
      "Declaring Physician's name": "Dr. Magic Johnson",
      "Physician's comments":
        "Applicant has positive sputum results and abnormal chest X-ray findings consistent with active pulmonary tuberculosis. Certificate cannot be issued at this time.",
    });

    // Verify screening information section
    tbCertificateSummaryPage.verifyScreeningInfoSection();
    tbCertificateSummaryPage.verifyScreeningInfo({
      "Chest X-ray done": "Yes",
      "Chest X-ray outcome": "Chest X-ray abnormal",
      "Sputum collected": "Yes",
      "Sputum outcome": "Positive", // Based on the positive test data from sputum collection
      Pregnant: "No",
      "Child under 11 years": "No",
    });

    // Verify change links exist for editable fields (not issued scenario)
    tbCertificateSummaryPage.verifyChangeLinksForNotIssued();

    // Test the change links functionality
    tbCertificateSummaryPage.verifyChangeLinksForNotIssued();

    // Verify back link navigation for not issued scenario
    tbCertificateSummaryPage.verifyBackLinkForNotIssued();

    // Verify service name in header
    tbCertificateSummaryPage.verifyServiceName();

    // Verify submit button
    tbCertificateSummaryPage.verifySubmitButton();

    // Submit the certificate information
    tbCertificateSummaryPage.clickSubmit();

    // Verify redirection to TB Certificate Confirmation page
    cy.url().should("include", "/tb-certificate-confirmation");

    // Verify TB Certificate Confirmation page loaded (not issued scenario)
    tbCertificateConfirmationPage.verifyPageLoaded();

    // Verify confirmation panel with correct title for NOT ISSUED
    tbCertificateConfirmationPage.verifyConfirmationPanelNotIssued();

    // Verify warning panel styling for not issued scenario
    tbCertificateConfirmationPage.verifyWarningPanelStyling();

    // Verify completion message
    tbCertificateConfirmationPage.verifyCompletionMessage();

    // Verify "What happens next" section
    tbCertificateConfirmationPage.verifyWhatHappensNextSection();

    // In this "not issued" scenario, there should be NO "View or print certificate" button
    // The button should not exist since no certificate was issued
    cy.contains("View or print certificate").should("not.exist");
    // Verify navigation links section
    tbCertificateConfirmationPage.verifyNavigationLinks();

    // Verify feedback link
    tbCertificateConfirmationPage.verifyFeedbackLink();

    // Verify grid layout structure
    tbCertificateConfirmationPage.verifyGridLayout();

    // Verify back link navigation
    tbCertificateConfirmationPage.verifyBackLinkNavigation();

    // Verify service name in header
    tbCertificateConfirmationPage.verifyServiceName();

    // Navigate back to tracker to verify task status updates
    tbCertificateConfirmationPage.clickViewSummaryLink();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify TB certificate outcome status is now "Certificate not issued"
    tbProgressTrackerPage.verifyTaskStatus("TB certificate outcome", "Certificate not issued");

    // Verify overall TB screening status is now "Certificate not issued"
    tbProgressTrackerPage.verifyTBScreeningStatus("Certificate not issued");

    // Verify all task statuses in final state
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "Sputum collection and results": "Completed",
      "TB certificate outcome": "Certificate not issued",
    });

    // Verify all tasks are still clickable for review even when certificate is not issued
    tbProgressTrackerPage.verifyAllTasksClickableWhenComplete();

    // Log test completion
    cy.log("TB Certificate Not Issued E2E Test completed successfully");
  });
});
