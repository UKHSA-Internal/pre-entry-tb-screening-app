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
import { TbCertificateConfirmationPage } from "../support/page-objects/tbCertificateConfirmationPage";
import { TbCertificateDeclarationPage } from "../support/page-objects/tbCertificateDeclarationPage";
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
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const tbCertificateDeclarationPage = new TbCertificateDeclarationPage();

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

  it("should complete the full application process with sputum collection", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName) // Use country code for form filling
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

    // Complete Sputum Collection Question
    sputumQuestionPage.verifyPageLoaded();

    //Select "Yes" for Sputum Collection***
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Verify redirection to chest X-ray summary page
    cy.url().should("include", "/chest-xray-summary");

    // Verify chest X-ray summary page
    chestXraySummaryPage.verifyPageLoaded();

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
        dateTaken: "10/03/2025",
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample2: {
        dateTaken: "11/03/2025",
        collectionMethod: "Induced",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample3: {
        dateTaken: "12/03/2025",
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
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify we're back at the progress tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify sputum collection status is now "Completed"
    tbProgressTrackerPage.verifyTaskStatus("Sputum collection and results", "Completed");

    // Now all tasks should be completed except TB certificate declaration
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

    // Select "Yes" for TB clearance certificate issuance
    tbCertificateQuestionPage.selectTbClearanceOption("Yes");

    // Verify "Yes" is selected
    tbCertificateQuestionPage.verifyRadioSelection("Yes");

    // Submit the form and continue to TB Certificate Declaration page
    tbCertificateQuestionPage.clickContinue();

    // Verify redirection to TB Certificate Declaration page
    tbCertificateQuestionPage.verifyUrlContains("/tb-certificate-declaration");

    // Verify TB Certificate Declaration page is loaded
    tbCertificateDeclarationPage.verifyPageLoaded();

    // Verify all page elements are present
    tbCertificateDeclarationPage.verifyAllPageElements();

    // Capture Clinic Name for verification
    tbCertificateDeclarationPage.getClinicName().then((capturedClinicName: string) => {
      cy.log(`Captured clinic name: ${capturedClinicName}`);

      // Verify clinic information summary is displayed
      tbCertificateDeclarationPage.verifyClinicInformationSummary();

      // Verify expected clinic information is displayed
      tbCertificateDeclarationPage.verifyClinicInformationIsPresent();

      // Verify all fields are initially empty
      tbCertificateDeclarationPage.verifyAllFieldsEmpty();

      // Fill TB Certificate Declaration details
      const tbCertificateDeclarationData = {
        declaringPhysicianName: "Dr. Sarah Johnson",
        physicianComments:
          "Applicant has completed full TB screening. All tests negative.Certificate issued in accordance with UKHSA guidelines.",
      };

      // Fill the form with valid data
      tbCertificateDeclarationPage.fillFormWithValidData(tbCertificateDeclarationData);

      // Verify the form is filled correctly
      tbCertificateDeclarationPage.verifyFormFilledWith(tbCertificateDeclarationData);

      // Submit the form and continue
      tbCertificateDeclarationPage.clickContinue();

      // Verify redirection to TB Clearance Certificate Summary page
      tbCertificateDeclarationPage.verifyUrlContains("/tb-certificate-summary");

      // Verify TB Certificate Summary page loaded
      tbCertificateSummaryPage.verifyPageLoaded();

      // Verify all page elements and structure
      tbCertificateSummaryPage.verifyAllPageElements();

      // Verify applicant information section and data
      tbCertificateSummaryPage.verifyApplicantInfoSection();
      tbCertificateSummaryPage.verifyApplicantInfo({
        Name: "Jane Smith",
        "Date of birth": "15 March 2000",
        "Passport number": passportNumber,
        Sex: "Female",
      });

      // Verify clinic and certificate information section
      tbCertificateSummaryPage.verifyClinicCertificateSection();
      tbCertificateSummaryPage.verifyClinicCertificateInfo({
        "Clinic name": capturedClinicName,
        "Declaring physician name": "Dr. Sarah Johnson",
        "Physician's comments":
          "Applicant has completed full TB screening. All tests negative.Certificate issued in accordance with UKHSA guidelines.",
      });

      // Verify screening information section
      tbCertificateSummaryPage.verifyScreeningInfoSection();
      tbCertificateSummaryPage.verifyScreeningInfo({
        "Chest X-ray done": "Yes",
        "Chest X-ray outcome": "Chest X-ray normal",
        "Sputum collected": "Yes",
        "Sputum outcome": "Negative", // Based on the test data from sputum collection
        Pregnant: "No",
        "Child under 11 years": "No",
      });

      // Verify applicant photo is displayed
      tbCertificateSummaryPage.verifyApplicantPhoto();

      // Verify declaration text
      tbCertificateSummaryPage.verifyDeclarationText();

      // Verify change links exist for editable fields
      tbCertificateSummaryPage.verifyChangeLinksExist();

      // Test the change links functionality
      tbCertificateSummaryPage.verifyChangeLinksExist();

      // Verify back link navigation
      tbCertificateSummaryPage.verifyBackLinkNavigation();

      // Verify service name in header
      tbCertificateSummaryPage.verifyServiceName();

      // Verify submit button
      tbCertificateSummaryPage.verifySubmitButton();

      // Submit the certificate information
      tbCertificateSummaryPage.clickSubmit();

      // Verify redirection to TB Certificate Confirmation page
      cy.url().should("include", "/tb-certificate-confirmation");

      // Verify redirection to TB Certificate Confirmation page
      cy.url().should("include", "/tb-certificate-confirmation");

      // Verify TB Certificate Confirmation page loaded
      tbCertificateConfirmationPage.verifyPageLoaded();

      // Verify confirmation panel with correct title
      tbCertificateConfirmationPage.verifyConfirmationPanel();

      // Verify certificate reference number is displayed and get its value
      tbCertificateConfirmationPage.verifyCertificateReferenceNumber();

      // Verify certificate reference number format
      tbCertificateConfirmationPage.verifyCertificateReferenceNumberFormat();

      // Log certificate reference number for verification
      tbCertificateConfirmationPage.getCertificateReferenceNumber().then((certRef: string) => {
        cy.log(`Certificate Reference Number: ${certRef}`);
        cy.wrap(certRef).should("not.be.empty");
        // Store in test for potential later use in the test
        cy.wrap(certRef).as("certificateReference");
      });

      // Verify completion message
      tbCertificateConfirmationPage.verifyCompletionMessage();

      // Verify "What happens next" section
      tbCertificateConfirmationPage.verifyWhatHappensNextSection();

      // Verify "View or print certificate" button
      tbCertificateConfirmationPage.verifyViewPrintCertificateButton();

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
    });
  });
});
