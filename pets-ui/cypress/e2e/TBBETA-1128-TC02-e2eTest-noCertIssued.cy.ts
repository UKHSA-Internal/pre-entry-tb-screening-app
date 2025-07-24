//PETS Private Beta E2E Test with TB Certificate Not Issued
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
import { TbCertificateNotIssuedFormPage } from "../support/page-objects/tbCertificateNotIssuedFormPage";
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

describe("PETS Application End-to-End Tests with TB Certificate Not Issued", () => {
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
  const tbCertificateNotIssuedFormPage = new TbCertificateNotIssuedFormPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
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

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
  });
  it("should complete the full application process with TB certificate not issued due to testing postponed", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryCode)
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Fill basic applicant details
    applicantDetailsPage.verifyPageLoaded();
    applicantDetailsPage
      .fillFullName("Jane Tester-Doe")
      .selectSex("Female")
      .selectNationality(countryCode)
      .fillBirthDate("12", "11", "1990")
      .fillPassportIssueDate("20", "01", "2020")
      .fillPassportExpiryDate("20", "01", "2030")
      .fillAddressLine1("456 Oak Tree Avenue")
      .fillTownOrCity("St. Peters")
      .fillProvinceOrState("Dreamland")
      .selectAddressCountry(countryCode)
      .fillPostcode("62409")
      .submitForm();

    // Upload photo and complete applicant summary
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();
    applicantPhotoUploadPage.clickContinue();

    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.verifySummaryValue("Name", "Jane Tester-Doe");
    applicantSummaryPage.confirmDetails();

    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.clickContinue();

    // Complete travel information
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("Travel information");

    travelInformationPage.verifyPageLoaded();
    travelInformationPage
      .fillCompleteFormWithRandomVisa({
        ukAddressLine1: "789 City Road",
        ukAddressLine2: "Flat 5",
        ukTownOrCity: "Edinburgh",
        ukPostcode: "EH1 1AA",
        mobileNumber: "07700900789",
        email: "pets.tester3@hotmail.com",
      })
      .then((randomVisa) => {
        selectedVisaType = randomVisa;
        cy.log(`Selected random visa type: ${selectedVisaType}`);
      });

    travelInformationPage.submitForm();
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.submitForm();
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Complete medical screening (abbreviated)
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillAge("34")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes(
        "Patient appears healthy but unable to complete full screening today due to scheduling conflicts.",
      )
      .submitForm();

    medicalSummaryPage.verifyPageLoaded();
    medicalSummaryPage.confirmDetails();
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.clickContinueButton();

    // Complete chest X-ray with normal results
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenYes().clickContinue();

    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();
    chestXrayUploadPage.clickContinue();

    chestXrayFindingsPage.verifyPageLoaded();
    chestXrayFindingsPage
      .selectXrayResultNormal() // Use normal X-ray testing postponed scenario
      .selectMinorFindings(["1.2 Bony islets"])
      .clickSaveAndContinue();

    // Skip sputum collection for this scenario
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredNo().clickContinue();

    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.verifySummaryValue("Sputum required?", "No");
    chestXraySummaryPage.clickSaveAndContinue();

    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.clickContinueButton();

    // Navigate to TB certificate outcome
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

    // Select "No" for TB clearance certificate issuance
    tbCertificateQuestionPage.verifyPageLoaded();
    tbCertificateQuestionPage.selectTbClearanceOption("No");
    tbCertificateQuestionPage.clickContinue();

    // Fill TB Certificate Not Issued Form with "Testing postponed" reason
    tbCertificateNotIssuedFormPage.verifyPageLoaded();
    tbCertificateNotIssuedFormPage.verifyAllPageElements();

    const testingPostponedData = {
      reasonNotIssued: "Testing postponed" as const,
      declaringPhysicianName: "Dr. Sarah Jane Adams",
      physicianComments:
        "Due to scheduling conflicts and patient availability, additional testing required for complete TB screening could not be completed today.",
    };

    tbCertificateNotIssuedFormPage.fillFormWithValidData(testingPostponedData);
    tbCertificateNotIssuedFormPage.verifyFormFilledWith(testingPostponedData);
    tbCertificateNotIssuedFormPage.clickContinue();

    // Verify TB Certificate Summary page (not issued scenario)
    tbCertificateSummaryPage.verifyPageLoaded();
    tbCertificateSummaryPage.verifyCertificateNotIssuedMode();

    // Verify applicant information
    tbCertificateSummaryPage.verifyApplicantInfo({
      Name: "Jane Tester-Doe",
      "Date of birth": "12 November 1990",
      "Passport number": passportNumber,
      Sex: "Female",
    });

    // Verify certificate not issued information
    tbCertificateSummaryPage.verifyCertificateNotIssuedInfo({
      "Reason for not issuing certificate": "Testing postponed",
      "Declaring Physician's name": "Dr. Sarah Jane Adams",
      "Physician's comments":
        "Due to scheduling conflicts and patient availability, additional testing required for complete TB screening could not be completed today.",
    });

    // Verify screening information for testing postponed scenario
    tbCertificateSummaryPage.verifyScreeningInfo({
      "Chest X-ray done": "Yes",
      "Chest X-ray outcome": "Chest X-ray normal", // Normal X-ray for testing postponed
      "Sputum collected": "No",
      Pregnant: "No",
      "Child under 11 years": "No",
    });

    tbCertificateSummaryPage.verifyChangeLinksForNotIssued();
    tbCertificateSummaryPage.clickSubmit();

    // Verify TB Certificate Confirmation page (not issued scenario)
    tbCertificateConfirmationPage.verifyPageLoaded();
    tbCertificateConfirmationPage.verifyConfirmationPanelNotIssued();
    tbCertificateConfirmationPage.verifyWarningPanelStyling();
    tbCertificateConfirmationPage.verifyCompletionMessage();

    // In this "not issued" scenario, there should be NO "View or print certificate" button
    // The button should not exist since no certificate was issued
    cy.contains("View or print certificate").should("not.exist");
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

    // Navigate back to tracker to verify task status updates
    tbCertificateConfirmationPage.clickViewSummaryLink();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify TB certificate outcome status is now "Certificate not issued"
    tbProgressTrackerPage.verifyTaskStatus("TB certificate outcome", "Certificate not issued");

    // Verify overall TB screening status is now "Certificate not issued"
    tbProgressTrackerPage.verifyTBScreeningStatus("Certificate not issued");

    // Verify all task statuses in final state
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "Sputum collection and results": "Not required",
      "TB certificate outcome": "Certificate not issued",
    });
    // Log test completion
    cy.log("TB Certificate Not Issued E2E Test completed successfully");
  });
});
