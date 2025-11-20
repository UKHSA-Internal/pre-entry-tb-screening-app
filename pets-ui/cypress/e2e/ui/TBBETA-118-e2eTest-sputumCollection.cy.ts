//Pets Private Beta E2E Test with Sputum Collection
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckChestXrayImagesPage } from "../../support/page-objects/checkChestXrayImagesPage";
import { CheckSputumSampleInfoPage } from "../../support/page-objects/checkSputumSampleInfoPage";
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

describe("PETS Application End-to-End Tests with Sputum Collection", () => {
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

  it("should complete the full application process with sputum collection", () => {
    // Search for applicant with passport number
    cy.acceptCookies();
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
    cy.url().should("include", "/upload-visa-applicant-photo");
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
    cy.url().should("include", "/check-applicant-details");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Name", "Jane Smith");
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

    /// Fill travel information (NO visa type parameter needed)
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
      .fillScreeningDate("10", "9", "2025")
      .fillAge("25")
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
        Name: "Jane Smith",
        "Date of birth": "15/3/2000",
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
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "Jane Smith",
        "Date of birth": "15/3/2000",
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
          date: { day: "10", month: "03", year: "2025" },
          collectionMethod: "Coughed up",
        },
        sample2: {
          date: { day: "11", month: "03", year: "2025" },
          collectionMethod: "Induced",
        },
        sample3: {
          date: { day: "12", month: "03", year: "2025" },
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

      // Fill sputum sample results
      enterSputumSampleResultsPage.fillWithAllNegativeResults();

      // Verify the form is filled correctly
      const testResultsData =
        EnterSputumSampleResultsPage.getTestSampleResultsData().allNegativeResults;
      enterSputumSampleResultsPage.verifyFormFilledWith(testResultsData);

      // Save and continue
      enterSputumSampleResultsPage.clickSaveAndContinue();
      // Verify page loads correctly
      checkSputumSampleInfoPage.verifyPageLoaded();

      // Verify all sample headings are present
      checkSputumSampleInfoPage.verifySampleHeadings();

      // Verify all required fields are present for each sample
      checkSputumSampleInfoPage.verifyRequiredFieldsPresent();

      // Validate sample data matches what was entered
      const expectedSampleData = {
        sample1: {
          dateTaken: "10 March 2025",
          collectionMethod: "Coughed up",
          smearResult: "Negative",
          cultureResult: "Negative",
        },
        sample2: {
          dateTaken: "11 March 2025",
          collectionMethod: "Induced",
          smearResult: "Negative",
          cultureResult: "Negative",
        },
        sample3: {
          dateTaken: "12 March 2025",
          collectionMethod: "Coughed up",
          smearResult: "Negative",
          cultureResult: "Negative",
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
      tbProgressTrackerPage.verifySectionHeadings();
      tbProgressTrackerPage.verifyApplicantInfo({
        Name: "Jane Smith",
        "Date of birth": "15/3/2000",
        "Passport number": passportNumber,
        "TB screening": "In progress",
      });
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

      // NOW Click "TB certificate outcome" Page from the tracker
      tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

      // Verify TB Certificate Question page loaded
      tbCertificateQuestionPage.verifyPageLoaded();

      // Select "Yes" for TB clearance certificate issuance
      tbCertificateQuestionPage.selectTbClearanceOption("Yes");

      // Verify "Yes" is selected
      tbCertificateQuestionPage.verifyRadioSelection("Yes");

      // Submit the form and continue to TB Certificate Declaration page
      tbCertificateQuestionPage.clickContinue();

      // Verify redirection to "Enter clinic and cert information" Page
      clinicCertificateInfoPage
        .verifyPageLoaded()
        .verifyCertificateExpiryDateCalculation()
        .verifyCertificateExpiryIs6MonthsFromIssueDate()
        .saveCertificateReferenceNumber()
        .completeForm(
          "Dr. Amanda Johnson",
          "Applicant Cleared for travel. All tests negative. Certificate issued in line with UKVI guidelines",
        );

      // Verify redirection to TB Summary Page
      tbCertificateSummaryPage.verifyPageLoaded();

      // Verify all information
      tbCertificateSummaryPage
        .verifyAllVisaApplicantInformation()
        .verifyAllCurrentResidentialAddressFields()
        .verifyAllProposedUKAddressFields()
        .verifyAllClinicCertificateInfo()
        .verifyAllScreeningInformation();

      // Click the "Submit" button to submit the application
      tbCertificateSummaryPage.clickSubmitButton();

      // Verify redirection to TB Screening Completion Page
      tbScreeningCompletePage.verifyPageLoaded();

      // Verify TB Screening completion message and Cert Number
      tbScreeningCompletePage.completeWithRefValidation();

      // Verify all page elements with saved certificate reference validation
      tbScreeningCompletePage.verifyAllWithSavedRef();
    });
  });
});
