//PETS Scenario: Pregnant Adult - Yes Symptoms, No History, Yes Contact, No X-ray uploaded, Yes Sputum Required - TB Certificate Issued (3 months)
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckSputumSampleInfoPage } from "../../support/page-objects/checkSputumSampleInfoPage";
import { ChestXrayNotTakenPage } from "../../support/page-objects/chestXrayNotTakenPage";
import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
import { ClinicCertificateInfoPage } from "../../support/page-objects/clinicCertificateInfoPage";
import { EnterSputumSampleResultsPage } from "../../support/page-objects/enterSputumSampleResultsPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
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
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Scenario 4: Pregnant Adult Yes Symptoms, No X-ray, Sputum Required, Certificate Issued (3 months)", () => {
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
  const sputumDecisionConfirmationPage = new SputumDecisionConfirmationPage();
  const sputumDecisionInfoPage = new SputumDecisionInfoPage();
  const sputumQuestionPage = new SputumQuestionPage();
  const sputumCollectionPage = new SputumCollectionPage();
  const sputumConfirmationPage = new SputumConfirmationPage();
  const checkSputumSampleInfoPage = new CheckSputumSampleInfoPage();
  const enterSputumSampleResultsPage = new EnterSputumSampleResultsPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayNotTakenPage = new ChestXrayNotTakenPage();
  const clinicCertificateInfoPage = new ClinicCertificateInfoPage();
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const tbScreeningCompletePage = new TbScreeningCompletePage();
  const visaCategoryPage = new VisaCategoryPage();

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

  it("Pregnant Adult - Yes Symptoms, No History, Yes Contact, No X-ray uploaded, Yes Sputum Required - TB Certificate Issued (3 months)", () => {
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

    // Verify redirection to applicant search page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details for pregnant adult female
    applicantDetailsPage
      .fillFullName("Amina Johnson")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("22", "08", "1992")
      .fillPassportIssueDate("15", "03", "2019")
      .fillPassportExpiryDate("15", "03", "2029")
      .fillAddressLine1("Flat 2-3")
      .fillAddressLine2("789 Queen Street")
      .fillAddressLine3("Airport Residential Area")
      .fillTownOrCity("Accra")
      .fillProvinceOrState("Greater Accra")
      .selectAddressCountry(countryName)
      .fillPostcode("LS1 3BB")
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

    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/check-applicant-details");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Full name", "Amina Johnson");
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

    // Navigate to travel information from the tracker
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

    // Fill travel information
    travelInformationPage.verifyPageLoaded();

    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "789 Family Road",
      ukAddressLine2: "Apartment 2C",
      ukTownOrCity: "Bristol",
      ukPostcode: "BS1 4CC",
      mobileNumber: "07700900789",
      email: "pets.parents@hotmail.com",
    });

    // Submit the form
    travelInformationPage.submitForm();

    // Review Travel Summary
    travelSummaryPage.verifyPageLoaded();
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
    // Navigate to medical screening from the tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening Page - Pregnant yes symptoms, no TB history, yesclose contact
    medicalScreeningPage.verifyPageLoaded();

    medicalScreeningPage
      .fillScreeningDate("10", "9", "2025")
      .fillAge("33")
      .selectTbSymptoms("Yes") // Yes symptoms
      .selectPreviousTb("No") // No TB history
      .selectCloseContact("Yes") // Yes close contact
      .selectPregnancyStatus("Yes") // Yes Pregnant
      .selectMenstrualPeriods("No") // No due to pregnancy
      .fillPhysicalExamNotes(
        "Pregnant adult female with TB symptoms. Reports close contact with active TB case. Requires comprehensive screening.",
      )
      .submitForm();

    // Verify redirection to X-ray Question Page
    chestXrayPage.verifyPageLoaded();

    // Select "No" for X-ray Required
    chestXrayPage.selectXrayTakenNo();
    chestXrayPage.submitForm();

    // Verify redirection to X-ray reason Page
    chestXrayNotTakenPage.selectReasonXrayNotTaken("Pregnant");
    chestXrayNotTakenPage.submitForm();

    // Verify redirection to medical summary
    medicalSummaryPage.verifyPageLoaded();

    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: "33 years old",
      dateOfMedicalScreening: "10 September 2025",
      tbSymptoms: "Yes",
      previousTb: "No",
      closeContactWithTb: "Yes",
      pregnant: "Yes",
      menstrualPeriods: "No",
      physicalExamNotes:
        "Pregnant adult female with TB symptoms. Reports close contact with active TB case. Requires comprehensive screening.",
      xrayRequired: "No",
      reasonXrayNotRequired: "Pregnant",
    });

    // Confirm medical details
    medicalSummaryPage.verifySubmissionConfirmationMessage();
    medicalSummaryPage.confirmDetails();

    // Verify medical confirmation page and continue to chest X-ray
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    // Verify TB Screening Progress Tracker page
    tbProgressTrackerPage.verifySectionHeadings();
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "Amina Johnson",
      "Date of birth": "22/8/1992",
      "Passport number": passportNumber,
      "TB screening": "In progress",
    });
    tbProgressTrackerPage.verifyMultipleTaskStatuses({
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Not required",
      "Radiological outcome": "Not required",
      "Make a sputum decision": "Not yet started",
      "Sputum collection and results": "Cannot start yet",
      "TB certificate outcome": "Cannot start yet",
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
      Name: "Amina Johnson",
      "Date of birth": "22/8/1992",
      "Passport number": passportNumber,
      "TB screening": "In progress",
    });

    // NOW Navigate to "Sputum collection and results" Page from the tracker
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Verify sputum collection page is prefilled with data
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Fill sputum collection data for all three samples
    const sputumData = {
      sample1: {
        date: { day: "18", month: "09", year: "2025" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "19", month: "09", year: "2025" },
        collectionMethod: "Induced",
      },
      sample3: {
        date: { day: "20", month: "09", year: "2025" },
        collectionMethod: "Coughed up",
      },
    };

    sputumCollectionPage.fillAllSamples(sputumData);
    sputumCollectionPage.verifyFormFilledWith(sputumData);

    // Save and continue to results (direct path for this scenario)
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify redirection to Enter Sputum Sample Results page
    cy.url().should("include", "/enter-sputum-sample-results");

    // Enter sputum sample results page
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.verifyAllPageElements();

    // Fill sputum sample results with all negative results
    enterSputumSampleResultsPage.fillWithAllNegativeResults();

    // Verify the form is filled correctly
    const testResultsData =
      EnterSputumSampleResultsPage.getTestSampleResultsData().allNegativeResults;
    enterSputumSampleResultsPage.verifyFormFilledWith(testResultsData);
    enterSputumSampleResultsPage.clickSaveAndContinue();

    // Check sputum sample information page
    checkSputumSampleInfoPage.verifyPageLoaded();
    checkSputumSampleInfoPage.verifySampleHeadings();
    checkSputumSampleInfoPage.verifyRequiredFieldsPresent();

    // Validate sample data matches what was entered
    const expectedSampleData = {
      sample1: {
        dateCollected: "18 September 2025",
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample2: {
        dateCollected: "19 September 2025",
        collectionMethod: "Induced",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample3: {
        dateCollected: "20 September 2025",
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
    };

    checkSputumSampleInfoPage.verifyAllSampleInfo(expectedSampleData);
    checkSputumSampleInfoPage.verifyChangeLinksExist();
    checkSputumSampleInfoPage.verifyServiceName();
    checkSputumSampleInfoPage.clickSaveAndContinue();

    // Verify Sputum confirmation page
    sputumConfirmationPage.verifyPageLoaded();
    sputumConfirmationPage.verifyConfirmationPanel();
    sputumConfirmationPage.verifyNextStepsSection();
    sputumConfirmationPage.verifyServiceName();
    sputumConfirmationPage.clickContinueButton();

    // Verify we're back at tracker with completed status
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.verifyMultipleTaskStatuses({
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Not required",
      "Radiological outcome": "Not required",
      "Make a sputum decision": "Completed",
      "Sputum collection and results": "Completed",
      "TB certificate outcome": "Not yet started",
    });

    // Click on TB certificate declaration to continue
    tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

    // Verify TB Certificate Question page loaded and select YES
    tbCertificateQuestionPage.verifyPageLoaded();
    tbCertificateQuestionPage.selectTbClearanceOption("Yes");
    tbCertificateQuestionPage.verifyRadioSelection("Yes");
    tbCertificateQuestionPage.clickContinue();

    // Verify redirection to "Enter clinic and cert information" Page
    clinicCertificateInfoPage
      .verifyPageLoaded()
      .verifyCertificateExpiryDateCalculation3Months()
      .saveCertificateReferenceNumber()
      .completeForm(
        "Dr. Emily Watson",
        "Pregnant adult female with TB symptoms and close contact history. All sputum samples negative. Certificate issued with 3-month validity due to close contact with active TB.",
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
