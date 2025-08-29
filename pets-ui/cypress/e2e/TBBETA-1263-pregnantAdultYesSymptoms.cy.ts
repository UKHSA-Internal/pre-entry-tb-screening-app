// Scenario: Adult Pregnant - Yes Symptoms, No History, Yes Contact, No X-ray uploaded, Yes Sputum required - TB Certificate Issued (3 months)
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { CheckSputumSampleInfoPage } from "../support/page-objects/checkSputumSampleInfoPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayNotTakenPage } from "../support/page-objects/chestXrayNotTakenPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
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

describe("PETS Scenario: Pregnant Adult with Symptoms and Close Contact, Certificate Issued (3 months)", () => {
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
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const chestXrayNotTakenPage = new ChestXrayNotTakenPage();
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
  let medicalRecordDate: string = "";

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

  it("should complete the full application process for pregnant adult with symptoms and close contact, issue certificate with 3 month expiry", () => {
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

    // Fill Applicant Details for Adult Female
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details for adult female
    applicantDetailsPage
      .fillFullName("Sarah Johnson")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("22", "08", "1992")
      .fillPassportIssueDate("15", "01", "2019")
      .fillPassportExpiryDate("15", "01", "2029")
      .fillAddressLine1("789 Queen Street")
      .fillAddressLine2("Suite 3A")
      .fillAddressLine3("City Centre")
      .fillTownOrCity("Dahome")
      .fillProvinceOrState("Dahome")
      .selectAddressCountry(countryName)
      .fillPostcode("B1233")
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

    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/applicant-summary");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Name", "Sarah Johnson");
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

    // Navigate to travel information from the tracker
    tbProgressTrackerPage.clickTaskLink("Travel information");

    // Fill travel information
    travelInformationPage.verifyPageLoaded();

    travelInformationPage
      .fillCompleteFormWithRandomVisa({
        ukAddressLine1: "321 Oxford Street",
        ukAddressLine2: "Flat 1B",
        ukTownOrCity: "London",
        ukPostcode: "W1D 1AA",
        mobileNumber: "07700900456",
        email: "sarah.pets.test@gmail.com",
      })
      .then((randomVisa) => {
        selectedVisaType = randomVisa;
        cy.log(`Selected random visa type: ${selectedVisaType}`);
        cy.wrap(selectedVisaType).as("selectedVisa");
      });

    travelInformationPage.submitForm();

    // Review Travel Summary
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.verifyVisaTypeIsValid();
    travelSummaryPage.submitForm();

    // Travel Confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Navigate to medical screening from the tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening Page - Adult pregnant with symptoms, no TB history, has close contact
    medicalScreeningPage.verifyPageLoaded();

    medicalScreeningPage
      .fillAge("31") // Adult age
      .selectTbSymptoms("Yes") // Yes to symptoms
      .selectPreviousTb("No") // No TB history
      .selectCloseContact("Yes") // Yes close contact
      .selectPregnancyStatus("Yes") // Pregnant
      .selectMenstrualPeriods("N/A") // N/A due to pregnancy
      .fillPhysicalExamNotes(
        "Pregnant adult female with TB symptoms. Reports close contact with active TB case. Requires comprehensive screening.",
      )
      .submitForm();

    // Store the date when medical history is recorded for later verification
    const currentDate = new Date().toLocaleDateString("en-GB");
    medicalRecordDate = currentDate;
    cy.wrap(medicalRecordDate).as("medicalRecordDate");

    // Verify redirection to medical summary
    medicalScreeningPage.verifyRedirectedToSummary();
    medicalSummaryPage.verifyPageLoaded();

    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: "31",
      tbSymptoms: "Yes",
      previousTb: "No",
      closeContactWithTb: "Yes",
      pregnant: "Yes",
      menstrualPeriods: "N/A",
      physicalExamNotes:
        "Pregnant adult female with TB symptoms. Reports close contact with active TB case. Requires comprehensive screening.",
    });

    // Confirm medical details
    medicalSummaryPage.confirmDetails();

    // Verify medical confirmation page and continue to chest X-ray
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Navigate to chest X-ray from the tracker
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");

    // Verify chest X-ray page - Select NO for X-ray (pregnant)
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenNo().clickContinue();

    // Verify X-ray reason page and select "Pregnant"
    chestXrayNotTakenPage.verifyPageLoaded();
    chestXrayNotTakenPage.selectPregnant();
    chestXrayNotTakenPage.submitForm();

    // Sputum Question - Select YES (required due to symptoms and close contact)
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Verify chest X-ray summary
    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.verifyXrayNotTakenSummaryInfo({
      "Select x-ray status": "No",
      "Enter reason X-ray not taken": "Pregnant",
    });

    // Verify sputum field shows "Yes"
    chestXraySummaryPage.verifySummaryValue("Sputum required?", "Yes");
    chestXraySummaryPage.clickSaveAndContinue();

    // Verify chest X-ray confirmation
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.verifyConfirmationPanel();
    chestXrayConfirmationPage.verifyNextStepsSection();
    chestXrayConfirmationPage.clickContinueButton();

    // Verify we're back at the progress tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Complete Sputum Collection - Click on Sputum collection link
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Verify sputum collection page loaded and fill data
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Fill sputum collection data for all three samples
    const sputumData = {
      sample1: {
        date: { day: "15", month: "02", year: "2025" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "16", month: "02", year: "2025" },
        collectionMethod: "Induced",
      },
      sample3: {
        date: { day: "17", month: "02", year: "2025" },
        collectionMethod: "Coughed up",
      },
    };

    sputumCollectionPage.fillAllSamples(sputumData);
    sputumCollectionPage.verifyFormFilledWith(sputumData);

    // Test partial sputum collection
    sputumCollectionPage.clickSaveProgress();

    // Verify check sputum sample info page with partial data
    checkSputumSampleInfoPage.verifyPageLoaded();
    checkSputumSampleInfoPage.verifySampleHeadings();
    checkSputumSampleInfoPage.verifyRequiredFieldsPresent();

    // Verify partial data is shown with "No data" for results
    const partialSampleData = {
      sample1: {
        dateTaken: "15/02/2025",
        collectionMethod: "Coughed up",
        smearResult: "No data",
        cultureResult: "No data",
      },
      sample2: {
        dateTaken: "16/02/2025",
        collectionMethod: "Induced",
        smearResult: "No data",
        cultureResult: "No data",
      },
      sample3: {
        dateTaken: "17/02/2025",
        collectionMethod: "Coughed up",
        smearResult: "No data",
        cultureResult: "No data",
      },
    };

    checkSputumSampleInfoPage.verifyAllSampleInfo(partialSampleData);
    checkSputumSampleInfoPage.clickSaveAndContinue();

    // Verify partial sputum confirmation
    sputumConfirmationPage.verifyPageLoaded();
    cy.contains("Partial sputum sample information confirmed").should("be.visible");
    sputumConfirmationPage.clickContinueButton();

    // Verify we're back at tracker with "In progress" status
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyTaskStatus("Sputum collection and results", "In progress");

    // Click on sputum collection again to enter results
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Enter partial sputum results
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.verifyAllPageElements();

    enterSputumSampleResultsPage.fillWithOnlyFirstSampleResults();
    enterSputumSampleResultsPage.clickSaveAndContinue();

    // Continue with more partial results workflow as per scenario
    checkSputumSampleInfoPage.verifyPageLoaded();
    checkSputumSampleInfoPage.clickSaveAndContinue();

    // Verify partial sputum confirmation
    sputumConfirmationPage.verifyPageLoaded();
    cy.contains("Partial sputum sample information confirmed").should("be.visible");
    sputumConfirmationPage.clickContinueButton();

    // Verify we're back at tracker with "In progress" status
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyTaskStatus("Sputum collection and results", "In progress");

    // Return to enter remaining results
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Fill remaining sputum results as negative
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.fillRemainingSamplesWithNegativeResults();

    enterSputumSampleResultsPage.clickSaveAndContinue();

    // Final sputum verification
    checkSputumSampleInfoPage.verifyPageLoaded();
    const finalSampleData = {
      sample1: {
        dateTaken: "15/02/2025",
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Positive",
      },
      sample2: {
        dateTaken: "16/02/2025",
        collectionMethod: "Induced",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample3: {
        dateTaken: "17/02/2025",
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
    };

    checkSputumSampleInfoPage.verifyAllSampleInfo(finalSampleData);
    checkSputumSampleInfoPage.clickSaveAndContinue();

    // Final sputum confirmation
    sputumConfirmationPage.verifyPageLoaded();
    cy.contains("All sputum sample information confirmed").should("be.visible");
    sputumConfirmationPage.clickContinueButton();

    // Verify sputum collection is now completed
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyTaskStatus("Sputum collection and results", "Completed");

    // Click on TB certificate declaration to continue
    tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

    // Verify TB Certificate Question page loaded and select YES
    tbCertificateQuestionPage.verifyPageLoaded();
    tbCertificateQuestionPage.selectTbClearanceOption("Yes");
    tbCertificateQuestionPage.verifyRadioSelection("Yes");
    tbCertificateQuestionPage.clickContinue();

    // Verify TB Certificate Declaration page
    tbCertificateDeclarationPage.verifyPageLoaded();
    tbCertificateDeclarationPage.verifyAllPageElements();
    tbCertificateDeclarationPage.verifyClinicInformationSummary();
    tbCertificateDeclarationPage.verifyExpectedClinicInformation();
    tbCertificateDeclarationPage.verifyAllFieldsEmpty();

    // Fill TB Certificate Declaration details
    const tbCertificateDeclarationData = {
      declaringPhysicianName: "Dr. Emily Watson",
      physicianComments:
        "Pregnant adult female with TB symptoms and close contact history. All sputum samples negative. Certificate issued with 3-month validity due to close contact with active TB.",
    };

    tbCertificateDeclarationPage.fillFormWithValidData(tbCertificateDeclarationData);
    tbCertificateDeclarationPage.verifyFormFilledWith(tbCertificateDeclarationData);
    tbCertificateDeclarationPage.clickContinue();

    // Verify TB Certificate Summary page
    tbCertificateSummaryPage.verifyPageLoaded();
    tbCertificateSummaryPage.verifyAllPageElements();

    // Verify applicant information
    tbCertificateSummaryPage.verifyApplicantInfoSection();
    tbCertificateSummaryPage.verifyApplicantInfo({
      Name: "Sarah Johnson",
      "Date of birth": "22 August 1992",
      "Passport number": passportNumber,
      Sex: "Female",
    });

    // Verify clinic and certificate information
    tbCertificateSummaryPage.verifyClinicCertificateSection();
    tbCertificateSummaryPage.verifyClinicCertificateInfo({
      "Clinic name": "Lakeside Medical & TB Screening Centre",
      "Declaring physician name": "Dr. Emily Watson",
      "Physician's comments":
        "Pregnant adult female with TB symptoms and close contact history. All sputum samples negative. Certificate issued with 3-month validity due to close contact with active TB.",
    });

    // Verify screening information
    tbCertificateSummaryPage.verifyScreeningInfoSection();
    tbCertificateSummaryPage.verifyScreeningInfo({
      "Chest X-ray done": "No",
      "Chest X-ray outcome": "Not provided",
      "Sputum collected": "Yes",
      "Sputum outcome": "Positive",
      Pregnant: "Yes",
      "Child under 11 years": "No",
    });

    tbCertificateSummaryPage.verifyApplicantPhoto();
    tbCertificateSummaryPage.verifyDeclarationText();
    tbCertificateSummaryPage.verifyChangeLinksExist();
    tbCertificateSummaryPage.verifyServiceName();
    tbCertificateSummaryPage.verifySubmitButton();

    // Submit the certificate information
    tbCertificateSummaryPage.clickSubmit();

    // Verify TB Certificate Confirmation page
    cy.url().should("include", "/tb-certificate-confirmation");
    tbCertificateConfirmationPage.verifyPageLoaded();
    tbCertificateConfirmationPage.verifyConfirmationPanel();
    tbCertificateConfirmationPage.verifyCertificateReferenceNumber();
    tbCertificateConfirmationPage.verifyCertificateReferenceNumberFormat();

    // Log certificate reference number for verification
    tbCertificateConfirmationPage.getCertificateReferenceNumber().then((certRef: string) => {
      cy.log(`Certificate Reference Number: ${certRef}`);
      cy.wrap(certRef).should("not.be.empty");
      cy.wrap(certRef).as("certificateReference");
    });

    tbCertificateConfirmationPage.verifyCompletionMessage();
    tbCertificateConfirmationPage.verifyWhatHappensNextSection();
    tbCertificateConfirmationPage.verifyViewPrintCertificateButton();
    tbCertificateConfirmationPage.verifyNavigationLinks();
    tbCertificateConfirmationPage.verifyFeedbackLink();
    tbCertificateConfirmationPage.verifyGridLayout();
    tbCertificateConfirmationPage.verifyServiceName();
  });
});
