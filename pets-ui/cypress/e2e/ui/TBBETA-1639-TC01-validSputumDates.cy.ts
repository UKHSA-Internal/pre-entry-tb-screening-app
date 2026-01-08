//PETS Date Validation Test: Valid Scenario - Optimal Dates (Medical=X-ray, Sputum Days 1,2,3)
// Biz Rule 1: Medical screening on clinic visit date, X-ray same day
// Biz Rule 2: Sputum after medical and X-ray, 3 consecutive days
// Biz Rule 3: All within 7 days from medical screening
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckChestXrayImagesPage } from "../../support/page-objects/checkChestXrayImagesPage";
import { CheckSputumSampleInfoPage } from "../../support/page-objects/checkSputumSampleInfoPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import { ChestXrayConfirmationPage } from "../../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
import { ChestXrayResultsPage } from "../../support/page-objects/chestXrayResultsPage";
import { ChestXrayUploadPage } from "../../support/page-objects/chestXrayUploadPage";
import { ClinicCertificateInfoPage } from "../../support/page-objects/clinicCertificateInfoPage";
import { EnterSputumSampleResultsPage } from "../../support/page-objects/enterSputumSampleResultsPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
import { RadiologicalOutcomeConfPage } from "../../support/page-objects/radiologicalOutcomeConfPage";
import { SputumCollectionPage } from "../../support/page-objects/sputumCollectionPage";
import { SputumConfirmationPage } from "../../support/page-objects/sputumConfirmationPage";
import { SputumDecisionConfirmationPage } from "../../support/page-objects/sputumDecisionConfirmationPage";
import { SputumDecisionInfoPage } from "../../support/page-objects/sputumDecisionInfoPage";
import { SputumQuestionPage } from "../../support/page-objects/sputumQuestionPage";
import { TbCertificateQuestionPage } from "../../support/page-objects/tbCertificateQuestionPage";
import { TbCertificateSummaryPage } from "../../support/page-objects/tbCertificateSummaryPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { TbScreeningCompletePage } from "../../support/page-objects/tbScreeningCompletePage";
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

describe("PETS Date Validation: Valid Scenario - Optimal Dates", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
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
  const sputumConfirmationPage = new SputumConfirmationPage();
  const sputumDecisionConfirmationPage = new SputumDecisionConfirmationPage();
  const sputumDecisionInfoPage = new SputumDecisionInfoPage();
  const checkChestXrayImagesPage = new CheckChestXrayImagesPage();
  const checkSputumSampleInfoPage = new CheckSputumSampleInfoPage();
  const enterSputumSampleResultsPage = new EnterSputumSampleResultsPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const clinicCertificateInfoPage = new ClinicCertificateInfoPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const chestXrayResultsPage = new ChestXrayResultsPage();
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const tbScreeningCompletePage = new TbScreeningCompletePage();
  const visaCategoryPage = new VisaCategoryPage();
  const xRayResultsAndFindingsPage = new XRayResultsAndFindingsPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";
  let selectedVisaCategory: string;

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBFormatted: string;
  let adultDOBSumPageFormat: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDateFormatted: string;
  let sputumSample1Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample2Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample3Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample1Formatted: string;
  let sputumSample2Formatted: string;
  let sputumSample3Formatted: string;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();

    // Generate dynamic dates for adult applicant (25 years old)
    adultAge = 25;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    adultDOBFormatted = DateUtils.normalizeDateForComparison(
      DateUtils.formatDateDDMMYYYY(DateUtils.getAdultDateOfBirth(adultAge)),
    );
    const dobDate = DateUtils.getAdultDateOfBirth(adultAge);
    adultDOBSumPageFormat = DateUtils.formatDateGOVUK(dobDate);
    // Generate passport dates (issued 2 years ago, expires in 8 years)
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // OPTIMAL SCENARIO: Medical screening today, X-ray same day
    const screening = DateUtils.getDateInPast(0, 0, 4); // Today
    screeningDate = DateUtils.getDateComponents(screening);

    // X-ray same day as medical screening (optimal)
    const xray = DateUtils.getDateInPast(0, 0, 4); // Same day
    xrayDate = DateUtils.getDateComponents(xray);
    xrayDateFormatted = DateUtils.formatDateGOVUK(xray);

    // Sputum collection dates: consecutive days 1, 2, 3 after X-ray
    const sample1 = DateUtils.getDateInPast(0, 0, 3); // 1 day after today
    const sample2 = DateUtils.getDateInPast(0, 0, 2); // 2 days after today
    const sample3 = DateUtils.getDateInPast(0, 0, 1); // 1 day after today

    sputumSample1Date = DateUtils.getDateComponents(sample1);
    sputumSample2Date = DateUtils.getDateComponents(sample2);
    sputumSample3Date = DateUtils.getDateComponents(sample3);

    sputumSample1Formatted = DateUtils.formatDateGOVUK(sample1);
    sputumSample2Formatted = DateUtils.formatDateGOVUK(sample2);
    sputumSample3Formatted = DateUtils.formatDateGOVUK(sample3);

    // Log dates generated for debugging
    cy.log("=== OPTIMAL DATE SCENARIO ===");
    cy.log(`Medical Screening: Day 0 (Today)`);
    cy.log(`X-ray: Day 0 (Same as Medical)`);
    cy.log(`Sputum Sample 1: Day 1`);
    cy.log(`Sputum Sample 2: Day 2`);
    cy.log(`Sputum Sample 3: Day 3`);
    cy.log(`Total Duration: 3 days (within 7-day window)`);
    cy.log(`Adult Age: ${adultAge}`);
    cy.log(`Adult DOB: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(`Screening Date: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);
    cy.log(`X-ray Date: ${xrayDate.day}/${xrayDate.month}/${xrayDate.year}`);
    cy.log(
      `Sputum Sample 1: ${sputumSample1Date.day}/${sputumSample1Date.month}/${sputumSample1Date.year}`,
    );
    cy.log(
      `Sputum Sample 2: ${sputumSample2Date.day}/${sputumSample2Date.month}/${sputumSample2Date.year}`,
    );
    cy.log(
      `Sputum Sample 3: ${sputumSample3Date.day}/${sputumSample3Date.month}/${sputumSample3Date.year}`,
    );
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
    applicantSearchPage.verifyPageLoaded();

    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryCode = randomCountry?.value;
    countryName = randomCountry?.label;
    passportNumber = getRandomPassportNumber();
    tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
    cy.log(`Using TB certificate number: ${tbCertificateNumber}`);
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
  });

  it("should successfully complete TB screening with optimal date scenario: Medical=X-ray same day, Sputum consecutive days 1,2,3", () => {
    // Search for new applicant
    cy.acceptCookies();
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.clickCreateNewApplicant();

    // Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Jane Smith")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("123 Test Street")
      .fillTownOrCity("Test City")
      .fillProvinceOrState("Saint Michael")
      .selectAddressCountry(countryName)
      .fillPostcode("LS1 3BB")
      .submitForm();

    // Upload Applicant Photo
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage.uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg");
    applicantPhotoUploadPage.clickContinue();
    // Verify redirection to the Check Photo page
    cy.url().should("include", "/check-visa-applicant-photo");

    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.verifyPageHeadingText();
    checkPhotoPage.verifyUploadedPhotoDisplayed();
    checkPhotoPage.verifyFilenameDisplayed();
    checkPhotoPage.verifyImageLayout();
    checkPhotoPage.verifyRadioButtonsExist();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();

    // Applicant Summary
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.verifyAllSummaryValues({
      "Full name": "Jane Smith",
      Sex: "Female",
      Nationality: countryName,
      "Date of birth": adultDOBSumPageFormat,
      "Passport number": passportNumber,
    });
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

    // Travel Information
    travelInformationPage.verifyPageLoaded();
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "456 Park Lane",
      ukAddressLine2: "Floor 2",
      ukTownOrCity: "Manchester",
      ukPostcode: "M1 1AA",
      mobileNumber: "07700900123",
      email: "pets.tester@hotmail.com",
    });
    // Submit the form
    travelInformationPage.submitForm();

    // Review Travel Summary with random visa type
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
      .fillScreeningDate(screeningDate.day, screeningDate.month, screeningDate.year)
      .fillAge(adultAge.toString())
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

    // Calculate expected age from birth date
    const expectedAge = DateUtils.calculateAge(DateUtils.getAdultDateOfBirth(adultAge));
    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: `${expectedAge} years old`,
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "No abnormalities detected. Patient appears healthy.",
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

    // Verify the date was entered correctly
    chestXrayUploadPage.enterDateXrayTaken(xrayDate.day, xrayDate.month, xrayDate.year);

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
    checkChestXrayImagesPage.verifyDateOfXray(xrayDateFormatted);

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

      // Verify Chest X-ray Confirmation Panel
      chestXrayConfirmationPage.verifyConfirmationPanel();
      // Verify next steps
      chestXrayConfirmationPage.verifyNextStepsSection();

      // Click "Continue" button and verify redirection to TB Progress Tracker
      chestXrayConfirmationPage.clickContinueAndVerifyRedirection();

      // NOW navigate to chest X-ray Results Page from the tracker
      tbProgressTrackerPage.clickTaskLink("Radiological outcome");

      // Verify redirection to Chest X-Ray Results Page
      chestXrayResultsPage.verifyPageLoaded();
      chestXrayResultsPage.verifyAllPageElements();
      chestXrayResultsPage.verifyFormDisplayed();
      chestXrayResultsPage.verifyAllRadioOptions();

      // Select "Chest X-ray Abnormal" option and continue to X-ray Findings Page
      chestXrayResultsPage.selectNonTBAbnormality();
      chestXrayResultsPage.clickContinueAndVerifyRedirection();

      // Verify redirection to "Chest X-ray Findings Page"
      chestXrayFindingsPage
        .verifyPageLoaded()
        .verifyAllPageElements()
        .verifyRadiographicFindingsSection()
        .verifyMinorFindingsSection();
      // Fill in findings and continue
      chestXrayFindingsPage.selectMinorFindingByIndex(3); // Select "2.2 Unilateral or bilateral costophrenic"

      // Click "continue" button to redirect to
      chestXrayFindingsPage.clickContinueButton();

      // Verify redirection to "Check chest X-ray results and findings" Page
      xRayResultsAndFindingsPage.verifyPageLoaded();
      // Click "Save and continue" to proceed to next page
      xRayResultsAndFindingsPage.clickSaveAndContinueButton();

      // Verify redirection to Radiological Outcome confirmation Page
      radiologicalOutcomeConfPage.verifyPageLoaded();
      radiologicalOutcomeConfPage.verifyAllPageElements();
      radiologicalOutcomeConfPage.verifyConfirmationPanel();
      radiologicalOutcomeConfPage.verifyWhatHappensNextSection();

      // Click "Continue" button to navigate to TB Progress Tracker
      radiologicalOutcomeConfPage.clickContinueButton();

      // NOW verify applicant info on TB Progress TRacker Page
      tbProgressTrackerPage.verifyPageLoaded();
      tbProgressTrackerPage.verifySectionHeadings();
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "Jane Smith",
        "Date of birth": adultDOBFormatted,
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });
      // NOW Navigate to "Make a sputum decision" Page from the tracker
      tbProgressTrackerPage.clickTaskLink("Make a sputum decision");

      // Sputum Question
      sputumQuestionPage.verifyPageLoaded();
      sputumQuestionPage.selectSputumRequired("Yes");
      sputumQuestionPage.clickContinue();

      sputumDecisionInfoPage.verifyAllPageElements();
      sputumDecisionInfoPage.clickSaveAndContinue();

      // Sputum Decision Confirmation
      sputumDecisionConfirmationPage.verifyPageLoaded();
      sputumDecisionConfirmationPage.verifyConfirmationPanel();
      sputumDecisionConfirmationPage.verifyConfirmationMessageContent();
      sputumDecisionConfirmationPage.clickContinueButton();

      // NOW verify applicant info on TB Progress TRacker Page
      tbProgressTrackerPage.verifyPageLoaded();
      tbProgressTrackerPage.verifySectionHeadings();
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "Jane Smith",
        "Date of birth": adultDOBFormatted,
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });
      // NOW Navigate to "Sputum collection and results" Page from the tracker
      tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

      // Verify redirection to "Sputum sample collection info" Page
      sputumCollectionPage.verifyPageLoaded();
      sputumCollectionPage.verifySectionHeaders();
      sputumCollectionPage.verifyPageStructure();

      // Fill sputum collection data for all three samples

      const sputumData = {
        sample1: {
          date: {
            day: sputumSample1Date.day,
            month: sputumSample1Date.month,
            year: sputumSample1Date.year,
          },
          collectionMethod: "Coughed up",
        },
        sample2: {
          date: {
            day: sputumSample2Date.day,
            month: sputumSample2Date.month,
            year: sputumSample2Date.year,
          },
          collectionMethod: "Induced",
        },
        sample3: {
          date: {
            day: sputumSample3Date.day,
            month: sputumSample3Date.month,
            year: sputumSample3Date.year,
          },
          collectionMethod: "Coughed up",
        },
      };

      sputumCollectionPage.fillAllSamples(sputumData);
      sputumCollectionPage.verifyFormFilledWith(sputumData);
      sputumCollectionPage.clickSaveAndContinueToResults();

      // Enter Sputum Sample Results
      cy.url().should("include", "/sputum-results");
      enterSputumSampleResultsPage.verifyPageLoaded();
      enterSputumSampleResultsPage.fillWithAllNegativeResults();
      enterSputumSampleResultsPage.clickSaveAndContinue();

      // Check Sputum Sample Info
      checkSputumSampleInfoPage.verifyPageLoaded();
      const expectedSampleData = {
        sample1: {
          dateCollected: sputumSample1Formatted,
          collectionMethod: "Coughed up",
          smearResult: "Negative",
          cultureResult: "Negative",
        },
        sample2: {
          dateCollected: sputumSample2Formatted,
          collectionMethod: "Induced",
          smearResult: "Negative",
          cultureResult: "Negative",
        },
        sample3: {
          dateCollected: sputumSample3Formatted,
          collectionMethod: "Coughed up",
          smearResult: "Negative",
          cultureResult: "Negative",
        },
      };
      checkSputumSampleInfoPage.verifyAllSampleInfo(expectedSampleData);
      checkSputumSampleInfoPage.clickSaveAndContinue();

      // Sputum Confirmation
      sputumConfirmationPage.verifyPageLoaded();
      sputumConfirmationPage.verifyConfirmationPanel();
      sputumConfirmationPage.verifyNextStepsSection();
      sputumConfirmationPage.verifyServiceName();
      sputumConfirmationPage.clickContinueButton();

      // TB Progress Tracker
      cy.url().should("include", "/tracker");
      tbProgressTrackerPage.verifyMultipleTaskStatuses({
        "Visa applicant details": "Completed",
        "UK travel information": "Completed",
        "Medical history and TB symptoms": "Completed",
        "Upload chest X-ray images": "Completed",
        "Radiological outcome": "Completed",
        "Make a sputum decision": "Completed",
        "Sputum collection and results": "Completed",
        "TB certificate outcome": "Not yet started",
      });

      // TB Certificate Outcome
      tbProgressTrackerPage.clickTaskLink("TB certificate outcome");
      tbCertificateQuestionPage.verifyPageLoaded();
      tbCertificateQuestionPage.selectTbClearanceOption("Yes");
      tbCertificateQuestionPage.clickContinue();

      // Clinic Certificate Info
      clinicCertificateInfoPage
        .verifyPageLoaded()
        .verifyCertificateExpiryDateCalculation()
        .saveCertificateReferenceNumber()
        .completeForm("Dr. Test Doctor", "All tests negative. Certificate issued.");

      // TB Certificate Summary
      tbCertificateSummaryPage.verifyPageLoaded();
      tbCertificateSummaryPage
        .verifyAllVisaApplicantInformation()
        .verifyAllCurrentResidentialAddressFields()
        .verifyAllProposedUKAddressFields()
        .verifyAllClinicCertificateInfo()
        .verifyAllScreeningInformation();
      tbCertificateSummaryPage.clickSubmitButton();

      // TB Screening Complete
      tbScreeningCompletePage.verifyPageLoaded();
      tbScreeningCompletePage.completeWithRefValidation();

      // Verify all page elements with saved certificate reference validation
      tbScreeningCompletePage.verifyAllWithSavedRef();

      cy.log("✓ OPTIMAL DATE SCENARIO TEST PASSED - All dates valid and within rules");
    });
  });
});
