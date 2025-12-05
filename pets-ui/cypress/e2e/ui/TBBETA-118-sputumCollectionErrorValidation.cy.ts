// Empty Form Submission Test on Sputum Page
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
//import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "../../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
import { RadiologicalOutcomeConfPage } from "../../support/page-objects/radiologicalOutcomeConfPage";
import { SputumCollectionPage } from "../../support/page-objects/sputumCollectionPage";
import { SputumDecisionConfirmationPage } from "../../support/page-objects/sputumDecisionConfirmationPage";
import { SputumDecisionInfoPage } from "../../support/page-objects/sputumDecisionInfoPage";
import { SputumQuestionPage } from "../../support/page-objects/sputumQuestionPage";
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

describe("Empty Form Submission Test On Sputum Collection Page", () => {
  // Page object instances
  const applicantConsentPage = new ApplicantConsentPage();
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
  const radiologicalOutcomeConfPage = new RadiologicalOutcomeConfPage();
  const sputumQuestionPage = new SputumQuestionPage();
  const sputumCollectionPage = new SputumCollectionPage();
  const sputumDecisionConfirmationPage = new SputumDecisionConfirmationPage();
  const sputumDecisionInfoPage = new SputumDecisionInfoPage();
  const checkChestXrayImagesPage = new CheckChestXrayImagesPage();
  const chestXrayResultsPage = new ChestXrayResultsPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  //const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
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

  it("should display all errors when submitting a completely empty form", () => {
    // Search for applicant with passport number
    cy.acceptCookies();
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");

    // Fill applicant details
    applicantDetailsPage.verifyPageLoaded();
    applicantDetailsPage
      .fillFullName("Emma Tester - O'Empty")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("25", "09", "1992")
      .fillPassportIssueDate("01", "06", "2021")
      .fillPassportExpiryDate("01", "06", "2031")
      .fillAddressLine1("100 Empty Street")
      .fillAddressLine2("Blank Building")
      .fillAddressLine3("Void Village")
      .fillTownOrCity("Empty Town")
      .fillProvinceOrState("Empty State")
      .selectAddressCountry(countryName)
      .fillPostcode("EM123")
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

    // NOW verify the travel information page
    travelInformationPage.verifyPageLoaded();
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "200 Empty Road",
      ukAddressLine2: "Void Floor",
      ukTownOrCity: "London",
      ukPostcode: "E1 4MP",
      mobileNumber: "07700900000",
      email: "pets.tester3@hotmail.com",
    });

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
    travelSummaryPage.submitForm();
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Complete medical screening
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillScreeningDate("25", "09", "1992")
      .verifyAge("33")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Empty form test examination completed.")
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
      age: "33 years old",
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "Empty form test examination completed.",
    });

    // Confirm medical details
    medicalSummaryPage.confirmDetails();

    // Verify medical confirmation page and continue to TB Progress Tracker
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to chest X-ray from the tracker
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
    chestXrayUploadPage.verifyDicomUploadContainers();

    // Verify accepted file types include .dcm, .jpg, .jpeg, .png
    chestXrayUploadPage.verifyAcceptedFileTypes();

    // Upload Chest X-ray file
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();

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

      // Verify change links exist and have correct hrefs
      checkChestXrayImagesPage.verifyChangeLinksExist();

      // Verify "Date of X-ray" change link
      checkChestXrayImagesPage.verifyDateOfXrayChangeLink();

      // Verify "Chest X-ray images" change link
      checkChestXrayImagesPage.verifyChestXrayImagesChangeLink();

      // Verify submission section heading
      checkChestXrayImagesPage.verifySubmissionHeading();

      // Verify Save and Continue button
      checkChestXrayImagesPage.verifySaveAndContinueButton();

      // Verify warning message about not being able to change images
      checkChestXrayImagesPage.verifyWarningMessage();

      // Click "Save and continue" button
      checkChestXrayImagesPage.clickSaveAndContinue();

      // Verify redirection to chest X-ray Images confirmation Page
      chestXrayConfirmationPage.verifyPageLoaded();

      // Verify X-ray findings page
      //chestXrayFindingsPage.verifyPageLoaded();

      // Verify Chest X-ray Confirmation Panel
      chestXrayConfirmationPage.verifyConfirmationPanel();
      // Verify next steps
      chestXrayConfirmationPage.verifyNextStepsSection();
      // Click "Continue" button
      //chestXrayConfirmationPage.clickContinueButton();
      // Click "Continue" button and verify redirection to TB Progress Tracker
      chestXrayConfirmationPage.clickContinueAndVerifyRedirection();

      // NOW navigate to chest X-ray Results Page from the tracker
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

      // Click "Save and continue" to proceed to next page
      xRayResultsAndFindingsPage.clickSaveAndContinueButton();

      // Verify redirection to Radiological Outcome confirmation Page
      radiologicalOutcomeConfPage.verifyPageLoaded();
      //radiologicalOutcomeConfPage.verifyPageTitle();
      radiologicalOutcomeConfPage.verifyAllPageElements();
      radiologicalOutcomeConfPage.verifyConfirmationPanel();
      radiologicalOutcomeConfPage.verifyWhatHappensNextSection();

      // Click "Continue" button to navigate to TB Progress Tracker
      radiologicalOutcomeConfPage.clickContinueButton();

      // NOW verify applicant info on TB Progress TRacker Page
      tbProgressTrackerPage.verifyPageLoaded();
      tbProgressTrackerPage.verifySectionHeadings();
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "Emma Tester - O'Empty",
        "Date of birth": "25/9/1992",
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });

      // NOW Navigate to "Make a sputum decision" Page from the tracker
      tbProgressTrackerPage.clickTaskLink("Make a sputum decision");
      sputumQuestionPage.verifyPageLoaded();
      sputumQuestionPage.selectSputumRequiredYes().clickContinue();

      // Verify redirection to Sputum decision Info Page
      sputumDecisionInfoPage.verifyPageLoaded();
      sputumDecisionInfoPage.verifyAllPageElements();
      sputumDecisionInfoPage.clickSaveAndContinue();

      // Verify redirection to Sputum Decision Confirmation Page
      sputumDecisionConfirmationPage
        .verifyAllPageElements()
        .verifyConfirmationMessageContent()
        .clickContinueButton();

      // NOW verify applicant info on TB Progress TRacker Page
      tbProgressTrackerPage.verifyPageLoaded();
      tbProgressTrackerPage.verifySectionHeadings();
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "Emma Tester - O'Empty",
        "Date of birth": "25/9/1992",
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });

      // Navigate to sputum collection
      tbProgressTrackerPage.clickTaskLink("Sputum collection and results");
      sputumCollectionPage.verifyPageLoaded();
      sputumCollectionPage.verifySectionHeaders();
      sputumCollectionPage.verifyPageStructure();
      sputumCollectionPage.verifyAllFieldsEmpty();

      // Verify all fields are initially empty
      cy.get('[data-testid="date-sample-1-taken-day"]').should("have.value", "");
      cy.get('[data-testid="date-sample-1-taken-month"]').should("have.value", "");
      cy.get('[data-testid="date-sample-1-taken-year"]').should("have.value", "");

      // Check that collection method exists
      cy.get('[name="collectionMethodSample1"]').should("exist");

      cy.get('[data-testid="date-sample-2-taken-day"]').should("have.value", "");
      cy.get('[data-testid="date-sample-2-taken-month"]').should("have.value", "");
      cy.get('[data-testid="date-sample-2-taken-year"]').should("have.value", "");

      // Check that collection method exists
      cy.get('[name="collectionMethodSample2"]').should("exist");

      cy.get('[data-testid="date-sample-3-taken-day"]').should("have.value", "");
      cy.get('[data-testid="date-sample-3-taken-month"]').should("have.value", "");
      cy.get('[data-testid="date-sample-3-taken-year"]').should("have.value", "");
      // Check that collection method exists
      cy.get('[name="collectionMethodSample3"]').should("exist");

      // Attempt to submit the completely empty form
      sputumCollectionPage.clickSaveAndContinueToResults();

      // Verify error summary is displayed
      sputumCollectionPage.validateErrorSummaryVisible();

      // Verify all required field errors are shown
      sputumCollectionPage.validateAllRequiredFieldErrors();

      // Verify specific error messages for all samples
      sputumCollectionPage.validateErrorSummaryContains([
        "Enter the date sample 1 was taken on",
        "Enter Sputum sample 1 collection method",
        "Enter the date sample 2 was taken on",
        "Enter Sputum sample 2 collection method",
        "Enter the date sample 3 was taken on",
        "Enter Sputum sample 3 collection method",
      ]);

      // Verify individual field errors for all samples
      sputumCollectionPage.validateSample1DateError();
      sputumCollectionPage.validateSample1CollectionMethodError();
      sputumCollectionPage.validateSample2DateError();
      sputumCollectionPage.validateSample2CollectionMethodError();
      sputumCollectionPage.validateSample3DateError();
      sputumCollectionPage.validateSample3CollectionMethodError();

      // Verify comprehensive error validation
      sputumCollectionPage.validateFormErrors({
        sample1Date: "Enter the date sample 1 was taken on",
        sample1CollectionMethod: "Enter Sputum sample 1 collection method",
        sample2Date: "Enter the date sample 2 was taken on",
        sample2CollectionMethod: "Enter Sputum sample 2 collection method",
        sample3Date: "Enter the date sample 3 was taken on",
        sample3CollectionMethod: "Enter Sputum sample 3 collection method",
      });

      // Verify error styling is applied to all fields
      sputumCollectionPage.verifyFieldErrorStates();

      // Verify that error summary links work correctly
      cy.get('.govuk-error-summary__list a[href="#date-sample-1-taken"]').should("exist").click();
      cy.get('[data-testid="date-sample-1-taken-day"]').should("be.focused");

      cy.get('.govuk-error-summary__list a[href="#date-sample-2-taken"]').should("exist").click();
      cy.get('[data-testid="date-sample-2-taken-day"]').should("be.focused");

      cy.get('.govuk-error-summary__list a[href="#date-sample-3-taken"]').should("exist").click();
      cy.get('[data-testid="date-sample-3-taken-day"]').should("be.focused");

      // Verify we remain on the sputum collection page
      cy.url().should("include", "/enter-sputum-sample-collection-information");

      // Verify that all form fields still have the correct error styling
      cy.get("#date-sample-1-taken").should("have.class", "govuk-form-group--error");
      cy.get("#date-sample-2-taken").should("have.class", "govuk-form-group--error");
      cy.get("#date-sample-3-taken").should("have.class", "govuk-form-group--error");
      cy.get("#collection-method-sample-1").should("have.class", "govuk-form-group--error");
      cy.get("#collection-method-sample-2").should("have.class", "govuk-form-group--error");
      cy.get("#collection-method-sample-3").should("have.class", "govuk-form-group--error");
    });
  });
});
