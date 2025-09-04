// Scenario: Adult - No Symptoms, Yes History, No Contact, X-ray uploaded, No TB Finding, No Sputum required - TB Certificate Issued
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../support/page-objects/medicalConfirmationPage";
import { MedicalSummaryPage } from "../support/page-objects/medicalSummaryPage";
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

describe("Adult with TB History, X-ray Normal, Certificate Issued (6 months)", () => {
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
  let certificateIssueDate: string = "";

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

  it("should complete the full application process for adult with TB history and issue certificate with 6 month expiry", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to Applicant search page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Verify redirection to applicant details page
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details for adult
    applicantDetailsPage
      .fillFullName("John Tester")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate("15", "03", "1990")
      .fillPassportIssueDate("10", "05", "2018")
      .fillPassportExpiryDate("10", "05", "2028")
      .fillAddressLine1("123 High Street")
      .fillAddressLine2("Apartment 4B")
      .fillAddressLine3("Downtown")
      .fillTownOrCity("Testing City")
      .fillProvinceOrState("Greater Testers")
      .selectAddressCountry(countryName)
      .fillPostcode("AL12345")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/applicant-photo");
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
    cy.url().should("include", "/applicant-summary");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Name", "John Tester");
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
        ukAddressLine1: "456 Park Lane",
        ukAddressLine2: "Floor 2",
        ukTownOrCity: "Manchester",
        ukPostcode: "M1 1AA",
        mobileNumber: "07700900123",
        email: "pets.tester@hotmail.com",
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

    // Medical Screening Page - Adult with TB history, no symptoms, no close contact
    medicalScreeningPage.verifyPageLoaded();

    medicalScreeningPage
      .fillAge("34") // Adult age
      .selectTbSymptoms("No") // No symptoms
      .selectPreviousTb("Yes") // Yes to TB history
      .selectCloseContact("No") // No close contact
      .selectPregnancyStatus("No") // Not pregnant
      .selectMenstrualPeriods("No") // No menstrual periods (male)
      .fillPhysicalExamNotes(
        "Adult male with history of tuberculosis. No current symptoms. Physical examination normal.",
      )
      .submitForm();

    // Store the date when medical history is recorded for later verification
    const currentDate = new Date().toLocaleDateString("en-GB");
    certificateIssueDate = currentDate;
    cy.wrap(certificateIssueDate).as("medicalRecordDate");

    // Verify redirection to medical summary page
    medicalScreeningPage.verifyRedirectedToSummary();
    medicalSummaryPage.verifyPageLoaded();

    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: "34",
      tbSymptoms: "No",
      previousTb: "Yes",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes:
        "Adult male with history of tuberculosis. No current symptoms. Physical examination normal.",
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

    // Verify chest X-ray page - Select YES for X-ray taken
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenYes().clickContinue();

    // Upload chest X-ray
    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();

    //Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    chestXrayUploadPage.clickContinue();

    // Complete X-ray findings - For Normal chest X-ray
    chestXrayFindingsPage.verifyPageLoaded();
    chestXrayFindingsPage.selectXrayResultNormal().clickSaveAndContinue();

    // Sputum Question - Select NO (not required for normal X-ray)
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredNo().clickContinue();

    // Verify chest X-ray summary
    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.verifyXraySummaryInfo({
      "Select X-ray status": "Yes",
      "Enter radiological outcome": "Chest X-ray normal",
    });

    // Verify sputum field shows "No"
    chestXraySummaryPage.verifySummaryValue("Sputum required?", "No");
    chestXraySummaryPage.clickSaveAndContinue();

    // Verify chest X-ray confirmation
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.verifyConfirmationPanel();
    chestXrayConfirmationPage.verifyNextStepsSection();
    chestXrayConfirmationPage.clickContinueButton();

    // Verify we're back at the progress tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify task statuses - sputum should be "Not required"
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "Sputum collection and results": "Not required",
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
    // Capture Clinic Name for verification
    tbCertificateDeclarationPage.getClinicName().then((capturedClinicName: string) => {
      cy.log(`Captured clinic name: ${capturedClinicName}`);
      tbCertificateDeclarationPage.verifyClinicInformationSummary();
      tbCertificateDeclarationPage.verifyClinicInformationIsPresent();
      tbCertificateDeclarationPage.verifyAllFieldsEmpty();

      // Fill TB Certificate Declaration details
      const tbCertificateDeclarationData = {
        declaringPhysicianName: "Dr. Michael Johnson",
        physicianComments:
          "Adult applicant with history of tuberculosis. Current chest X-ray normal. All screening requirements completed. Certificate issued with 6-month validity as no close contact with active TB.",
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
        Name: "John Tester",
        "Date of birth": "15 March 1990",
        "Passport number": passportNumber,
        Sex: "Male",
      });

      // Verify clinic and certificate information
      tbCertificateSummaryPage.verifyClinicCertificateSection();
      tbCertificateSummaryPage.verifyClinicCertificateInfo({
        "Clinic name": capturedClinicName,
        "Declaring physician name": "Dr. Michael Johnson",
        "Physician's comments":
          "Adult applicant with history of tuberculosis. Current chest X-ray normal. All screening requirements completed. Certificate issued with 6-month validity as no close contact with active TB.",
      });

      // Verify screening information
      tbCertificateSummaryPage.verifyScreeningInfoSection();
      tbCertificateSummaryPage.verifyScreeningInfo({
        "Chest X-ray done": "Yes",
        "Chest X-ray outcome": "Chest X-ray normal",
        "Sputum collected": "No",
        "Sputum outcome": "Not provided",
        Pregnant: "No",
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
});
