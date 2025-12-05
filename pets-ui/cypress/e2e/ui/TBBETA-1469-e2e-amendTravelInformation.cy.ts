//PETS Private Beta E2E Test - Amend Travel Information for Partially Completed Submission
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckChestXrayImagesPage } from "../../support/page-objects/checkChestXrayImagesPage";
import { ChestXrayConfirmationPage } from "../../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
import { ChestXrayResultsPage } from "../../support/page-objects/chestXrayResultsPage";
import { ChestXrayUploadPage } from "../../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
import { RadiologicalOutcomeConfPage } from "../../support/page-objects/radiologicalOutcomeConfPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "../../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../../support/page-objects/travelSummaryPage";
import { VisaCategoryPage } from "../../support/page-objects/visaCategoryPage";
import { XRayResultsAndFindingsPage } from "../../support/page-objects/xRayResultsAndFindingsPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Application - Amend Travel Information for Partially Completed Submission", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const radiologicalOutcomeConfPage = new RadiologicalOutcomeConfPage();
  const checkChestXrayImagesPage = new CheckChestXrayImagesPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const chestXrayResultsPage = new ChestXrayResultsPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();
  const xRayResultsAndFindingsPage = new XRayResultsAndFindingsPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";
  let selectedVisaCategory: string;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
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

  it("should amend travel information for Partially completed submission", () => {
    // Search for applicant with passport number
    cy.acceptCookies();
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();

    applicantSearchPage.clickCreateNewApplicant();

    // Verify Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details
    applicantDetailsPage
      .fillFullName("John Smith")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate("20", "06", "1995")
      .fillPassportIssueDate("15", "08", "2019")
      .fillPassportExpiryDate("15", "08", "2029")
      .fillAddressLine1("456 Main Road")
      .fillAddressLine2("Suite 10C")
      .fillAddressLine3("City Centre")
      .fillTownOrCity("Manchester")
      .fillProvinceOrState("Greater Manchester")
      .selectAddressCountry(countryName)
      .fillPostcode("M1 1AA")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    // Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Continue to Applicant Summary page
    applicantPhotoUploadPage.clickContinue();

    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/check-visa-applicant-details");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Full name", "John Smith");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);
    applicantSummaryPage.verifySummaryValue("Nationality", countryName);

    // Submit the summary and continue to next step
    applicantSummaryPage.confirmDetails();

    // Verify Applicant Confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyConfirmationPanel();
    applicantConfirmationPage.verifyNextStepsSection();
    applicantConfirmationPage.clickContinue();

    // Verify redirection to TB Screening Progress Tracker page
    tbProgressTrackerPage.verifyPageLoaded();
    cy.url().should("include", "/tracker");

    // Navigate to Travel Information from the tracker
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

    // Verify redirection to Travel Information Page
    travelInformationPage.verifyPageLoaded();
    cy.url().should("include", "/visa-applicant-proposed-uk-address");

    // Fill in original travel information
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "789 Oxford Street",
      ukAddressLine2: "Flat 5B",
      ukTownOrCity: "London",
      ukPostcode: "W1D 2HG",
      mobileNumber: "07123456789",
      email: "pets.tester@hotmail.com",
    });
    // Submit the form
    travelInformationPage.submitForm();

    // Verify redirection to Travel Summary Page
    travelSummaryPage.verifyPageLoaded();
    cy.url().should("include", "/check-travel-information");

    // Verify travel information in summary
    travelSummaryPage.verifySummaryValue("Address line 1 (optional)", "789 Oxford Street");
    travelSummaryPage.verifySummaryValue("Address line 2 (optional)", "Flat 5B");
    travelSummaryPage.verifySummaryValue("Address line 3 (optional)", "Not provided");
    travelSummaryPage.verifySummaryValue("Town or city (optional)", "London");
    travelSummaryPage.verifySummaryValue("Postcode (optional)", "W1D 2HG");
    travelSummaryPage.verifySummaryValue("UK phone number (optional)", "07123456789");
    travelSummaryPage.verifySummaryValue("UK email address (optional)", "pets.tester@hotmail.com");

    // Submit travel summary
    travelSummaryPage.submitForm();

    // Verify Travel Confirmation page
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.verifyConfirmationPanel();
    travelConfirmationPage.verifyNextStepsSection();
    travelConfirmationPage.submitForm();

    // Verify redirection to TB Screening Progress Tracker page
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Navigate to Medical History from tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Verify Medical Screening page loaded
    medicalScreeningPage.verifyPageLoaded();

    // Fill medical screening
    medicalScreeningPage
      .fillScreeningDate("10", "9", "2025")
      .verifyAge("30")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.")
      .submitForm();

    // Verify redirection to X-ray Question Page
    chestXrayPage.verifyPageLoaded();

    // Select "Yes" for X-ray Required
    chestXrayPage.selectXrayTakenYes();
    chestXrayPage.submitForm();

    // Verify redirection to Medical Screening Summary Page
    medicalSummaryPage.verifyPageLoaded();
    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: "30 years old",
      dateOfMedicalScreening: "10 September 2025",
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "No abnormalities detected. Patient appears healthy.",
    });

    // Verify warning message and Submit form to confirm details
    medicalSummaryPage.verifySubmissionSection();
    medicalSummaryPage.confirmDetails();

    // Verify Medical Confirmation page
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Navigate to Chest X-ray upload from tracker
    tbProgressTrackerPage.clickTaskLink("Upload chest X-ray images");

    // Verify redirection to chest X-ray Images Upload page
    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage.verifyAllPageElements();

    // Verify date X-ray taken section is displayed
    chestXrayUploadPage.verifyDateXrayTakenSectionDisplayed();
    chestXrayUploadPage.verifyDateInputFields();

    // Enter the date manually when X-ray was taken
    const xrayDay = "20";
    const xrayMonth = "10";
    const xrayYear = "2025";
    chestXrayUploadPage.enterDateXrayTaken(xrayDay, xrayMonth, xrayYear);

    // Verify the date was entered correctly
    chestXrayUploadPage.verifyDateValue(xrayDay, xrayMonth, xrayYear);

    // Verify X-ray upload page and sections and upload image(s)
    chestXrayUploadPage.verifyXrayUploadSectionsDisplayed();
    chestXrayUploadPage.verifyFileUploadInstructions();
    chestXrayUploadPage.verifyAllFileDropZones();
    // Verify accepted file types include .dcm, .jpg, .jpeg, .png
    chestXrayUploadPage.verifyAcceptedFileTypes();

    // Upload Chest X-ray file
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();

    // Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Continue to X-ray findings page
    chestXrayUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });
    // Verify redirection to Check Chest X-ray Images page
    cy.url().should("include", "/check-chest-x-ray-images");

    // Verify Check Chest X-ray Images page loaded
    checkChestXrayImagesPage.verifyPageLoaded();

    // Verify page heading
    checkChestXrayImagesPage.verifyPageHeading();

    // Verify the date of X-ray is displayed (should match what was entered earlier)
    checkChestXrayImagesPage.verifyDateOfXray("20 October 2025");

    // Get and log the date of X-ray value
    checkChestXrayImagesPage.getDateOfXray().then((date) => {
      cy.log(`Date of X-ray: ${date}`);
    });
    // Verify at least one chest X-ray image is uploaded
    checkChestXrayImagesPage.verifyAtLeastOneImageUploaded();

    // Get and log the uploaded images
    checkChestXrayImagesPage.getUploadedImages().then((images) => {
      cy.log(`Uploaded images: ${images.join(", ")}`);

      // Verify change links exist
      checkChestXrayImagesPage.verifyChangeLinksExist();
      checkChestXrayImagesPage.verifyDateOfXrayChangeLink();
      checkChestXrayImagesPage.verifyChestXrayImagesChangeLink();

      // Verify submission section heading
      checkChestXrayImagesPage.verifySubmissionHeading();

      // Verify warning message and Click "Submit and continue"
      checkChestXrayImagesPage.verifyWarningMessage();
      checkChestXrayImagesPage.clickSaveAndContinue();
    });
    // Verify redirection to Chest X-ray Images Confirmation page
    cy.url().should("include", "/chest-x-ray-images-confirmed");
    chestXrayConfirmationPage.verifyPageLoaded();

    // Verify Chest X-ray Confirmation Panel and Next Steps
    chestXrayConfirmationPage.verifyConfirmationPanel();
    chestXrayConfirmationPage.verifyNextStepsSection();
    chestXrayConfirmationPage.clickContinueButton();

    // Verify redirection to TB Progress Tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to Radiological outcome (Chest X-ray Results) from the tracker
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");

    // Verify redirection to Chest X-Ray Results Page
    chestXrayResultsPage.verifyPageLoaded();
    chestXrayResultsPage.verifyAllPageElements();
    chestXrayResultsPage.verifyFormDisplayed();
    chestXrayResultsPage.verifyAllRadioOptions();

    // Select "Chest X-ray normal" option and continue to X-ray Findings Page
    chestXrayResultsPage.selectChestXrayNormal();
    chestXrayResultsPage.clickContinueAndVerifyRedirection();

    // Verify redirection to "Chest X-ray Findings Page"
    chestXrayFindingsPage
      .verifyPageLoaded()
      .verifyAllPageElements()
      .verifyRadiographicFindingsSection()
      .verifyMinorFindingsSection();

    // Click "continue" button to redirect to
    chestXrayFindingsPage.clickContinueButton();

    // Verify redirection to "Check chest X-ray results and findings" Page
    xRayResultsAndFindingsPage.verifyPageLoaded();
    xRayResultsAndFindingsPage.verifySubmissionSection();
    xRayResultsAndFindingsPage.clickSaveAndContinueButton();

    // Verify redirection to Radiological Outcome confirmation Page
    radiologicalOutcomeConfPage.verifyPageLoaded();
    radiologicalOutcomeConfPage.verifyConfirmationPanel();
    radiologicalOutcomeConfPage.verifyAllPageElements();
    radiologicalOutcomeConfPage.verifyWhatHappensNextSection();
    // Click "Continue" button to navigate to TB Progress Tracker
    radiologicalOutcomeConfPage.clickContinueButton();

    // Verify we're back on the TB Progress Tracker Page
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "John Smith",
      "Date of birth": "20/6/1995",
      "Passport number": passportNumber,
      "TB screening": "In progress",
    });
    tbProgressTrackerPage.verifyMultipleTaskStatuses({
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Completed",
      "Radiological outcome": "Completed",
      "Make a sputum decision": "Not yet started",
      "Sputum collection and results": "Cannot start yet",
      "TB certificate outcome": "Cannot start yet",
    });

    // Navigate to Make a sputum decision from tracker
    tbProgressTrackerPage.clickTaskLink("UK travel information");

    // Verify redirection to "Check travel information" page
    cy.url().should("include", "/check-travel-information");
    travelSummaryPage.verifyPageLoaded();

    // Verify initial data with correct field labels
    travelSummaryPage.verifySummaryValue("Address line 1 (optional)", "789 Oxford Street");
    travelSummaryPage.verifySummaryValue("Address line 2 (optional)", "Flat 5B");
    travelSummaryPage.verifySummaryValue("Town or city (optional)", "London");
    travelSummaryPage.verifySummaryValue("Postcode (optional)", "W1D 2HG");
    travelSummaryPage.verifySummaryValue("UK phone number (optional)", "07123456789");
    travelSummaryPage.verifySummaryValue("UK email address (optional)", "pets.tester@hotmail.com");

    cy.log("AMEND TRAVEL INFORMATION");

    // Click change link for "Address line 1 (optional)"
    travelSummaryPage.clickChangeLink("Address line 1 (optional)");

    // Verify redirection to "Visa applicants proposed UK address" page
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    travelInformationPage.verifyPageLoaded();

    // Verify page is in editable state
    travelInformationPage.verifyFormSections();

    cy.log("VERIFY INITIAL DATA IS RETAINED IN THE FORM ");

    // Verify that the form fields contain the initial data
    travelInformationPage.verifyFormFilledWith({
      ukAddressLine1: "789 Oxford Street",
      ukAddressLine2: "Flat 5B",
      ukTownOrCity: "London",
      ukPostcode: "W1D 2HG",
    });

    cy.log("AMEND ADDRESS FIELDS");

    // Make amendments to address fields
    travelInformationPage
      .fillAddressLine1("123 Baker Street")
      .fillAddressLine2("Apartment 221B")
      .fillTownOrCity("Birmingham")
      .fillPostcode("B1 1AA");

    // Submit the amended form
    travelInformationPage.submitForm();

    cy.log("Verify we're back on TB Certificate Summary Page");

    // Verify we're back on the TB Progress Tracker Page
    cy.url().should("include", "/check-travel-information");
    travelSummaryPage.verifyPageLoaded();

    // Verify that the amended data is now shown in the summary
    travelSummaryPage.verifySummaryValue("Address line 1 (optional)", "123 Baker Street");
    travelSummaryPage.verifySummaryValue("Address line 2 (optional)", "Apartment 221B");
    travelSummaryPage.verifySummaryValue("Town or city (optional)", "Birmingham");
    travelSummaryPage.verifySummaryValue("Postcode (optional)", "B1 1AA");
    // Submit the amended form
    travelSummaryPage.submitForm();
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "John Smith",
      "Date of birth": "20/6/1995",
      "Passport number": passportNumber,
      "TB screening": "In progress",
    });
    tbProgressTrackerPage.verifyMultipleTaskStatuses({
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Completed",
      "Radiological outcome": "Completed",
      "Make a sputum decision": "Not yet started",
      "Sputum collection and results": "Cannot start yet",
      "TB certificate outcome": "Cannot start yet",
    });
  });
});
