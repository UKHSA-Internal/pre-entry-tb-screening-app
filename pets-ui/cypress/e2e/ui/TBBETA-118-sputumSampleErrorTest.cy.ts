// Empty Form Submission Test on Sputum Page
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
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const enterSputumSampleResultsPage = new EnterSputumSampleResultsPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
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
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate!: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDate!: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample1Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample2Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample3Date: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();

    // Generate dynamic dates for adult applicant (25 years old)
    adultAge = 25;
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
    const screening = DateUtils.getDateInPast(0, 1, 0);
    screeningDate = DateUtils.getDateComponents(screening);

    // Generate X-ray date (2 weeks ago, after screening)
    const xray = DateUtils.getDateInPast(0, 0, 14);
    xrayDate = DateUtils.getDateComponents(xray);

    // Generate sputum collection dates (3 months ago for realistic scenario)
    const sputumSample1 = DateUtils.getDateInPast(0, 3, 0); // 3 months ago
    const sputumSample2 = new Date(sputumSample1);
    sputumSample2.setDate(sputumSample2.getDate() + 1); // Next day
    const sputumSample3 = new Date(sputumSample2);
    sputumSample3.setDate(sputumSample3.getDate() + 1); // Next day

    sputumSample1Date = DateUtils.getDateComponents(sputumSample1);
    sputumSample2Date = DateUtils.getDateComponents(sputumSample2);
    sputumSample3Date = DateUtils.getDateComponents(sputumSample3);
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
      .fillAddressLine1("100 Palm Street")
      .fillAddressLine2("Blank Building")
      .fillAddressLine3("Void Village")
      .fillTownOrCity("Testers Town")
      .fillProvinceOrState("Empire State")
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
      ukAddressLine1: "200 London Road",
      ukAddressLine2: "Shoreditch",
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
      .fillScreeningDate(screeningDate.day, screeningDate.month, screeningDate.year)
      .fillAge(adultAge.toString())
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Test where NO sputum sample results is selected.")
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

    // Validate the prefilled form with calculated age
    medicalSummaryPage.fullyValidateSummary({
      age: `${expectedAge} years old`,
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "Test where NO sputum sample results is selected.",
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

    // Enter the date manually when X-ray was taken (using dynamic date)
    chestXrayUploadPage.enterDateXrayTaken(xrayDate.day, xrayDate.month, xrayDate.year);

    // Verify the date was entered correctly
    chestXrayUploadPage.verifyDateValue(xrayDate.day, xrayDate.month, xrayDate.year);

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

    // Get and log the date of X-ray value
    checkChestXrayImagesPage.getDateOfXray().then((date) => {
      cy.log(`Date of X-ray: ${date}`);
    });
    // Verify the date of X-ray is displayed (should match what was entered earlier)
    checkChestXrayImagesPage.verifyDateOfXrayComponents(
      xrayDate.day,
      xrayDate.month,
      xrayDate.year,
    );
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
        Name: "Jane Smith",
        "Date of birth": adultDOBFormatted,
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

      /// Fill sputum collection data for all three samples
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

      // Fill all samples using the new method
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

      // Submit form with no sample results selected
      // Verify all fields are empty on navigating to the sample results page
      enterSputumSampleResultsPage.verifyFormValidationEmpty();

      // Submit form without filling any results
      enterSputumSampleResultsPage.clickSaveAndContinue();

      // Verify error validation for empty form
      enterSputumSampleResultsPage.verifyFormValidationForEmptyForm();

      // Verify error summary is visible with correct message
      enterSputumSampleResultsPage.validateErrorSummaryVisible();
    });
  });
});
