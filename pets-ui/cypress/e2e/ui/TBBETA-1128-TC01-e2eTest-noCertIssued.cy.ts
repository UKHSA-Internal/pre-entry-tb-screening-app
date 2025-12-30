//PETS Private Beta E2E Test with TB Certificate Not Issued
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
import { TbCertificateNotIssuedFormPage } from "../../support/page-objects/tbCertificateNotIssuedFormPage";
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

describe("PETS Application End-to-End Tests with TB Certificate Not Issued", () => {
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
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const chestXrayResultsPage = new ChestXrayResultsPage();
  const tbCertificateNotIssuedFormPage = new TbCertificateNotIssuedFormPage();
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
  let selectedVisaCategory: string;

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBFormatted: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDateFormatted: string;
  let sputumSample1Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample2Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample3Date: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();
    // Generate dynamic dates for adult applicant (30 years old)
    adultAge = 30;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    // Format with leading zeros, then normalize for UI comparison
    adultDOBFormatted = DateUtils.normalizeDateForComparison(
      DateUtils.formatDateDDMMYYYY(DateUtils.getAdultDateOfBirth(adultAge)),
    );

    // Generate passport dates (issued 2 years ago, expires in 8 years)
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // Generate screening date (1 month ago for realistic scenario)
    const screening = DateUtils.getDateInPast(0, 1, 0); // 1 month ago
    screeningDate = DateUtils.getDateComponents(screening);

    // Generate X-ray date (2 weeks ago, after screening)
    const xray = DateUtils.getDateInPast(0, 0, 14); // 2 weeks ago
    xrayDate = DateUtils.getDateComponents(xray);
    xrayDateFormatted = DateUtils.formatDateGOVUK(xray);

    // Generate sputum collection dates (2-3 months ago for realistic scenario)
    const sample1 = DateUtils.getDateInPast(0, 3, 0); // 3 months ago
    const sample2 = DateUtils.getDateInPast(0, 3, -1); // 1 day after sample 1
    const sample3 = DateUtils.getDateInPast(0, 3, -2); // 1 day after sample 2

    sputumSample1Date = DateUtils.getDateComponents(sample1);
    sputumSample2Date = DateUtils.getDateComponents(sample2);
    sputumSample3Date = DateUtils.getDateComponents(sample3);

    // Log generated dates for debugging
    cy.log(`Adult Age: ${adultAge}`);
    cy.log(`Adult DOB: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(`DOB Formatted: ${adultDOBFormatted}`);
    cy.log(
      `Calculated Age: ${DateUtils.calculateAge(DateUtils.getAdultDateOfBirth(adultAge))} years`,
    );
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year}`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
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
    applicantSearchPage.verifyPageLoaded();
    cy.acceptCookies();
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
      .selectCountryOfIssue(countryName) // Use country code for form filling
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
      .fillFullName("John Doe")
      .selectSex("Male")
      .selectNationality(countryName) // Use country code for form filling
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("789 Main Street")
      .fillAddressLine2("Suite 101")
      .fillAddressLine3("Stanbic Heights")
      .fillTownOrCity("Hallstatt")
      .fillProvinceOrState("Hallstatt")
      .selectAddressCountry(countryName) // Use country code for form filling
      .fillPostcode("84209")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    // Continue to Applicant Summary page
    applicantPhotoUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

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
    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/check-visa-applicant-details");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Full name", "John Doe");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);
    applicantSummaryPage.verifySummaryValue("Nationality", countryName);
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

    // Fill travel information
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "123 Business Park",
      ukAddressLine2: "Building A",
      ukTownOrCity: "Leeds",
      ukPostcode: "LS1 1AA",
      mobileNumber: "07700900456",
      email: "john.doe.tb@hotmail.com",
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
      .selectTbSymptoms("Yes")
      .selectPreviousTb("No")
      .selectCloseContact("Yes")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Applicant presents with persistent cough and night sweats.")
      .submitForm();

    // Verify redirection to X-ray Question Page
    chestXrayPage.verifyPageLoaded();

    // Select "Yes" for X-ray Required
    chestXrayPage.selectXrayTakenYes();
    chestXrayPage.submitForm();

    // Calculate expected age from birth date
    const expectedAge = DateUtils.calculateAge(DateUtils.getAdultDateOfBirth(adultAge));

    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: `${expectedAge} years old`,
      tbSymptoms: "Yes",
      tbSymptomsList: [],
      previousTb: "No",
      closeContactWithTb: "Yes",
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

      // Complete X-ray findings with abnormal results indicating TB
      chestXrayFindingsPage.selectActiveTbFindings([
        "4.1 Apical fibronodular, fibrocalcific lesions or apical microcalcifications",
        "4.7 Any cavitating lesion or 'fluffy' or 'soft' lesions felt likely to represent active TB",
      ]);
      chestXrayFindingsPage.enterXrayResultDetails("Major Active pulmonary TB Sympmtons observed.");

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
        Name: "John Doe",
        "Date of birth": adultDOBFormatted,
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });
      // NOW Navigate to "Make a sputum decision" Page from the tracker
      tbProgressTrackerPage.clickTaskLink("Make a sputum decision");

      // Verify redirection to Sputum Collection Question Page
      sputumQuestionPage.verifyPageLoaded();
      //Select "Yes" for Sputum Collection
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
      tbProgressTrackerPage.verifyTaskLinksExist();
      tbProgressTrackerPage.verifyServiceName();
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "John Doe",
        "Date of birth": adultDOBFormatted,
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });

      // Verify task statuses
      tbProgressTrackerPage.verifyMultipleTaskStatuses({
        "Visa applicant details": "Completed",
        "UK travel information": "Completed",
        "Medical history and TB symptoms": "Completed",
        "Upload chest X-ray images": "Completed",
        "Radiological outcome": "Completed",
        "Make a sputum decision": "Completed",
        "Sputum collection and results": "Not yet started",
        "TB certificate outcome": "Cannot start yet",
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
      cy.url().should("include", "/sputum-results");

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
          dateCollected: "15 March 2025",
          collectionMethod: "Coughed up",
          smearResult: "Positive",
          cultureResult: "Positive",
        },
        sample2: {
          dateCollected: "16 March 2025",
          collectionMethod: "Induced",
          smearResult: "Positive",
          cultureResult: "Positive",
        },
        sample3: {
          dateCollected: "17 March 2025",
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

      // All tasks should now be completed except TB certificate declaration
      // Verify task statuses
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
      cy.url().should("include", "/why-are-you-not-issuing-certificate");

      // Verify TB Certificate Not Issued Form page is loaded
      tbCertificateNotIssuedFormPage.verifyPageLoaded();
      tbCertificateNotIssuedFormPage.verifyAllPageElements();
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

      // Verify TB Certificate Summary page loaded in "not issued" scenario
      tbCertificateSummaryPage.verifyPageLoaded();
      tbCertificateSummaryPage.verifyNotificationBannerContent();
      tbCertificateSummaryPage.verifyNotificationBannerList();
      tbCertificateSummaryPage.verifyAllPageElements();

      // Verify certificate not issued information
      tbCertificateSummaryPage.verifyCertificateNotIssuedInfo({
        "Reason for not issuing certificate": "Confirmed or suspected TB",
        "Declaring Physician's name": "Dr. Magic Johnson",
        "Physician's comments":
          "Applicant has positive sputum results and abnormal chest X-ray findings consistent with active pulmonary tuberculosis. Certificate cannot be issued at this time.",
      });

      // Verify change links exist for editable fields
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

      // Verify redirection to TB Screening Completion Page
      tbScreeningCompletePage.verifyPageLoaded();

      // Verify all page elements for NOT ISSUED scenario (no certificate reference to validate)
      tbScreeningCompletePage.verifyAllPageElementsForNotIssued();

      // Click "View a summary for this visa applicant" link to go to tracker
      tbScreeningCompletePage.clickSummaryLink();

      // Verify we're on the tracker page
      tbProgressTrackerPage.verifyPageLoaded();

      // Verify overall TB screening status is now "Certificate not issued"
      tbProgressTrackerPage.verifyTBScreeningStatus("Certificate not issued");

      // Verify all task statuses in final state
      tbProgressTrackerPage.verifyMultipleTaskStatuses({
        "Visa applicant details": "Completed",
        "UK travel information": "Completed",
        "Medical history and TB symptoms": "Completed",
        "Upload chest X-ray images": "Completed",
        "Radiological outcome": "Completed",
        "Make a sputum decision": "Completed",
        "Sputum collection and results": "Completed",
        "TB certificate outcome": "Certificate not issued",
      });

      // Verify all tasks are still clickable for review even when certificate is not issued
      tbProgressTrackerPage.verifyAllTasksClickableWhenComplete();

      // Log test completion
      cy.log("TB Certificate Not Issued E2E Test completed successfully");
    });
  });
});
