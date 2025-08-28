//PETS Scenario: Child - No Symptoms, No History, No Contact, No X-ray uploaded, Yes Sputum Required - TB Certificate Issued (6 months)
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { CheckSputumSampleInfoPage } from "../support/page-objects/checkSputumSampleInfoPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
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

describe("PETS Scenario 4: Child with No Symptoms, No X-ray, Sputum Required, Certificate Issued (6 months)", () => {
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

  it("should complete the full application process for child with no symptoms, no X-ray, sputum required, and issue certificate with 6 month expiry", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to applicant search page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details for Child
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details for child (born in 2018, so under 11)
    applicantDetailsPage
      .fillFullName("Nana Quist")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("10", "11", "2018")
      .fillPassportIssueDate("20", "03", "2019")
      .fillPassportExpiryDate("20", "03", "2029")
      .fillAddressLine1("456 Children's Avenue")
      .fillAddressLine2("Block C")
      .fillAddressLine3("Airport Residential Area")
      .fillTownOrCity("Accra")
      .fillProvinceOrState("Greater Accra")
      .selectAddressCountry(countryName)
      .fillPostcode("LS1 3BB")
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
    applicantSummaryPage.verifySummaryValue("Name", "Nana Quist");
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
        ukAddressLine1: "789 Family Road",
        ukAddressLine2: "Apartment 2C",
        ukTownOrCity: "Bristol",
        ukPostcode: "BS1 4CC",
        mobileNumber: "07700900789",
        email: "pets.parents@hotmail.com",
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

    // Medical Screening Page - Child with no symptoms, no TB history, no close contact
    medicalScreeningPage.verifyPageLoaded();

    medicalScreeningPage
      .fillAge("6") // Child age (under 11)
      .selectTbSymptoms("No") // No symptoms
      .selectChildTbHistory("None of these") // None of these for child TB history
      .selectPreviousTb("No") // No TB history
      .selectCloseContact("No") // No close contact
      .selectPregnancyStatus("N/A") // N/A for child
      .selectMenstrualPeriods("N/A") // N/A for child
      .fillPhysicalExamNotes(
        "Child applicant aged 6 years. No TB symptoms or history. No close contact with TB. Physical examination normal for age.",
      )
      .submitForm();

    // Store the date when medical history is recorded for later verification
    const currentDate = new Date().toLocaleDateString("en-GB");
    medicalRecordDate = currentDate;
    cy.wrap(medicalRecordDate).as("medicalRecordDate");

    // Verify redirection to medical summary
    medicalScreeningPage.verifyRedirectedToSummary();
    medicalSummaryPage.verifyPageLoaded();

    // Validate the prefilled form for child
    medicalSummaryPage.fullyValidateSummary({
      age: "6",
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "N/A",
      menstrualPeriods: "N/A",
      physicalExamNotes:
        "Child applicant aged 6 years. No TB symptoms or history. No close contact with TB. Physical examination normal for age.",
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

    // Verify chest X-ray page - Select NO for X-ray (child)
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenNo().clickContinue();

    // Verify X-ray reason page and select "Child"
    cy.url().should("include", "/chest-xray-not-taken");
    cy.get("input[value='Child']").check();
    cy.get("button").contains("Continue").click();

    // Sputum Question - Select YES (required for child as per scenario)
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Verify chest X-ray summary
    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.verifyXrayNotTakenSummaryInfo({
      "Select X-ray status": "No",
      "Enter reason X-ray not taken": "Child",
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
        date: { day: "18", month: "02", year: "2025" },
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: { day: "19", month: "02", year: "2025" },
        collectionMethod: "Induced",
      },
      sample3: {
        date: { day: "20", month: "02", year: "2025" },
        collectionMethod: "Coughed up",
      },
    };

    sputumCollectionPage.fillAllSamples(sputumData);
    sputumCollectionPage.verifyFormFilledWith(sputumData);

    // Save and continue to results (direct path for this scenario)
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Enter sputum sample results page
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.verifyAllPageElements();

    // Fill sputum sample results as negative
    enterSputumSampleResultsPage.fillWithAllNegativeResults();

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
        dateTaken: "18/02/2025",
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample2: {
        dateTaken: "19/02/2025",
        collectionMethod: "Induced",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample3: {
        dateTaken: "20/02/2025",
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
    cy.contains("All sputum sample information confirmed").should("be.visible");
    sputumConfirmationPage.verifyConfirmationPanel();
    sputumConfirmationPage.verifyNextStepsSection();
    sputumConfirmationPage.verifyServiceName();
    sputumConfirmationPage.clickContinueButton();

    // Verify we're back at tracker with completed status
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.verifyTaskStatus("Sputum collection and results", "Completed");

    // Verify all task statuses before TB certificate
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
      declaringPhysicianName: "Dr. Rebecca Thompson",
      physicianComments:
        "Child applicant aged 6 years. No TB symptoms, history, or close contact. All sputum samples negative. Certificate issued with 6-month validity as no close contact with active TB.",
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
      Name: "Nana Quist",
      "Date of birth": "10 November 2018",
      "Passport number": passportNumber,
      Sex: "Female",
    });

    // Verify clinic and certificate information
    tbCertificateSummaryPage.verifyClinicCertificateSection();
    tbCertificateSummaryPage.verifyClinicCertificateInfo({
      "Clinic name": "Lakeside Medical & TB Screening Centre",
      "Declaring physician name": "Dr. Rebecca Thompson",
      "Physician's comments":
        "Child applicant aged 6 years. No TB symptoms, history, or close contact. All sputum samples negative. Certificate issued with 6-month validity as no close contact with active TB.",
    });

    // Verify screening information
    tbCertificateSummaryPage.verifyScreeningInfoSection();
    tbCertificateSummaryPage.verifyScreeningInfo({
      "Chest X-ray done": "No",
      "Chest X-ray outcome": "Not provided",
      "Sputum collected": "Yes",
      "Sputum outcome": "Negative",
      Pregnant: "N/A",
      "Child under 11 years": "Yes",
    });

    tbCertificateSummaryPage.verifyApplicantPhoto();
    tbCertificateSummaryPage.verifyDeclarationText();
    tbCertificateSummaryPage.verifyChangeLinksExist();
    tbCertificateSummaryPage.verifyBackLinkNavigation();
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
    tbCertificateConfirmationPage.verifyBackLinkNavigation();
    tbCertificateConfirmationPage.verifyServiceName();
  });
});
