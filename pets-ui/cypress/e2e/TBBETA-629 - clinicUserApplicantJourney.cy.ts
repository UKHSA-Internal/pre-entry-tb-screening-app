import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../support/page-objects/medicalConfirmationPage";
import { MedicalSummaryPage } from "../support/page-objects/medicalSummaryPage";
import { TbCertificateConfirmationPage } from "../support/page-objects/tbCertificateConfirmationPage";
import { TbClearanceCertificateSummaryPage } from "../support/page-objects/tbCertificateSummaryPage";
import { TbClearanceCertificatePage } from "../support/page-objects/tbClearanceCertificatePage";
import { TBProgressTrackerPage } from "../support/page-objects/tbProgressTrackerPage";
import { getRandomPassportNumber, randomElement } from "../support/test-utils";
import { ApplicantDetailsPage } from "./../support/page-objects/applicantDetailsPage";
import { MedicalScreeningPage } from "./../support/page-objects/medicalScreeningPage";
import { TravelConfirmationPage } from "./../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "./../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "./../support/page-objects/travelSummaryPage";

describe("PETS Application End-to-End Tests", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const tbClearanceCertificatePage = new TbClearanceCertificatePage();
  const tbClearanceCertificateSummaryPage = new TbClearanceCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaType = "Students";

  // Define variables to store test data
  let countryName: string;
  let passportNumber: string;
  let tbCertificateNumber: string;

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.value;
    passportNumber = getRandomPassportNumber();
    tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
    cy.log(`Using TB certificate number: ${tbCertificateNumber}`);
  });

  it("should complete the full application process with search and create new", () => {
    applicantSearchPage.fillPassportNumber(passportNumber);
    applicantSearchPage.selectCountryOfIssue(countryName);
    applicantSearchPage.submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();

    // Passport number and country should already be prefilled
    applicantDetailsPage.fillFullName("Jane Smith");
    applicantDetailsPage.selectSex("Female");
    applicantDetailsPage.selectNationality(countryName);

    // Fill birth date
    applicantDetailsPage.fillBirthDate("15", "03", "2000");

    // Fill passport dates
    applicantDetailsPage.fillPassportIssueDate("10", "05", "2018");
    applicantDetailsPage.fillPassportExpiryDate("10", "05", "2028");

    // Fill address
    applicantDetailsPage.fillAddressLine1("123 High Street");
    applicantDetailsPage.fillAddressLine2("Apartment 4B");
    applicantDetailsPage.fillAddressLine3("Downtown");
    applicantDetailsPage.fillTownOrCity("London");
    applicantDetailsPage.fillProvinceOrState("Greater London");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("SW1A 1AA");

    // Submit form
    applicantDetailsPage.submitForm();

    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/applicant-summary");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Name", "Jane Smith");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);

    // Then confirm the details to proceed to the next step
    applicantSummaryPage.confirmDetails();

    // Verify redirection to applicant confirmation page
    cy.url().should("include", "/applicant-confirmation");

    //Verify applicant confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();

    // Continue to travel information
    applicantConfirmationPage.clickContinueToTravelInformation();
    travelInformationPage.verifyPageLoaded();

    travelInformationPage.selectVisaType(visaType);

    // Fill UK address
    travelInformationPage.fillAddressLine1("456 Park Lane");
    travelInformationPage.fillAddressLine2("Floor 2");
    travelInformationPage.fillTownOrCity("Manchester");
    travelInformationPage.fillPostcode("M1 1AA");

    // Fill contact details
    travelInformationPage.fillMobileNumber("07700900123");
    travelInformationPage.fillEmail("pets.tester@hotmail.com");

    // Submit form
    travelInformationPage.submitForm();

    // Review Travel Summary
    travelSummaryPage.verifyPageLoaded();

    // Verify details by clicking change links and checking fields
    travelSummaryPage.clickChangeLink("Visa type");
    travelSummaryPage.verifyFieldValueOnChangePage("Visa type", visaType);

    travelSummaryPage.clickChangeLink("UK address line 1");
    travelSummaryPage.verifyFieldValueOnChangePage("UK address line 1", "456 Park Lane");

    travelSummaryPage.clickChangeLink("UK town or city");
    travelSummaryPage.verifyFieldValueOnChangePage("UK town or city", "Manchester");

    travelSummaryPage.clickChangeLink("UK mobile number");
    travelSummaryPage.verifyFieldValueOnChangePage("UK mobile number", "07700900123");

    // Submit the summary form
    travelSummaryPage.submitForm();

    // Verify redirection to Travel Confirmation confirmation
    cy.url().should("include", "/travel-confirmation");

    // Travel Confirmation confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.submitForm();

    // Medical Screening Page
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage.fillAge("25");

    // TB symptoms
    medicalScreeningPage.selectTbSymptoms("No");

    // Previous TB
    medicalScreeningPage.selectPreviousTb("No");

    // Close contact with TB
    medicalScreeningPage.selectCloseContact("No");

    // Pregnancy status
    medicalScreeningPage.selectPregnancyStatus("No");

    // Menstrual periods
    medicalScreeningPage.selectMenstrualPeriods("No");

    // Physical exam notes
    medicalScreeningPage.fillPhysicalExamNotes(
      "No abnormalities detected. Patient appears healthy.",
    );

    // Submit the medical screening form
    medicalScreeningPage.submitForm();

    // Verify redirection to medical summary
    medicalScreeningPage.verifyRedirectedToSummary();
    // Verify page loaded
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

    // Verify redirection to chest X-ray page
    cy.url().should("include", "/medical-confirmation");

    // Verify medical confirmation page and continue to chest X-ray
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify chest X-ray page
    chestXrayPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    chestXrayPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Select "Yes" for X-ray taken and continue
    chestXrayPage.selectXrayTakenYes();
    chestXrayPage.clickContinue();

    // Verify X-ray upload page
    chestXrayUploadPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    chestXrayUploadPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Upload an X-ray file
    chestXrayUploadPage.uploadPosteroAnteriorXray("cypress/fixtures/test-image.png");

    // Validate that the upload was successful
    chestXrayUploadPage.verifyUploadSuccess();

    // Continue to X-ray findings page
    chestXrayUploadPage.clickContinue();

    cy.url().should("include", "/chest-xray-findings");

    // Verify X-ray findings page
    chestXrayFindingsPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    chestXrayFindingsPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Complete X-ray findings
    chestXrayFindingsPage.selectXrayResultNormal();
    chestXrayFindingsPage.selectMinorFindings(["1.1 Single fibrous streak or band or scar"]);

    // Save and continue
    chestXrayFindingsPage.clickSaveAndContinue();

    // Verify redirection to chest X-ray summary page
    cy.url().should("include", "/chest-xray-summary");

    // Verify chest X-ray summary page
    chestXraySummaryPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    chestXraySummaryPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Verify X-ray summary information - only validating these 2 fields as the others donot populate on the summary page
    chestXraySummaryPage.verifyXraySummaryInfo({
      "Select X-ray status": "Yes",
      "Enter radiological outcome": "Chest X-ray normal",
    });

    // Verify change links exist
    chestXraySummaryPage.verifyChangeLinksExist();

    // Save and continue to the next page
    chestXraySummaryPage.clickSaveAndContinue();

    // Verify redirection to chest X-ray confirmation page
    cy.url().should("include", "/chest-xray-confirmation");

    // Verify chest X-ray confirmation page
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.verifyConfirmationPanel();
    chestXrayConfirmationPage.verifyNextStepsSection();
    chestXrayConfirmationPage.verifyContinueText();
    chestXrayConfirmationPage.verifyTrackerLink();
    chestXrayConfirmationPage.verifyBreadcrumbNavigation();
    chestXrayConfirmationPage.verifyServiceName();

    // Click continue to navigate to the next page
    chestXrayConfirmationPage.clickContinueButton();

    // TB Clearance Certificate Page
    tbClearanceCertificatePage.verifyPageLoaded();

    // Verify the applicant details are displayed correctly
    tbClearanceCertificatePage.verifySummaryDetails({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Fill TB Clearance Certificate details
    tbClearanceCertificatePage.fillFormWithValidData({
      clearanceIssued: "Yes",
      physicianComments: "No signs of active tuberculosis. Chest X-ray clear.",
      certificateDay: "19",
      certificateMonth: "03",
      certificateYear: "2025",
      certificateNumber: tbCertificateNumber,
    });

    // Verify redirection to TB Clearance Certificate Summary Page
    cy.url().should("include", "/tb-certificate-summary");

    // Verify TB Clearance Certificate Summary Page
    tbClearanceCertificateSummaryPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    tbClearanceCertificateSummaryPage.verifyApplicantInfo({
      Name: "Jane Smith",
      "Date of birth": "15/03/2000",
      "Passport number": passportNumber,
    });

    // Verify TB certificate summary information
    tbClearanceCertificateSummaryPage.verifyTbCertificateSummaryInfo({
      "TB clearance certificate issued?": "Yes",
      "Physician comments": "No signs of active tuberculosis. Chest X-ray clear.",
      "Date of TB clearance certificate": "19/03/2025",
      "TB clearance certificate number": tbCertificateNumber,
    });

    // Verify change links exist
    tbClearanceCertificateSummaryPage.verifyChangeLinksExist();

    // Verify service name and breadcrumb navigation
    tbClearanceCertificateSummaryPage.verifyServiceName();
    tbClearanceCertificateSummaryPage.verifyBreadcrumbNavigation();

    // Save and continue to the next page
    tbClearanceCertificateSummaryPage.clickSaveAndContinue();

    // Verify redirection to TB Certificate Confirmation page
    cy.url().should("include", "/tb-certificate-confirmation");

    // Verify TB Certificate Confirmation page
    tbCertificateConfirmationPage.verifyPageLoaded();
    tbCertificateConfirmationPage.verifyConfirmationPanel();
    tbCertificateConfirmationPage.verifyConfirmationMessage();
    tbCertificateConfirmationPage.verifyBreadcrumbNavigation();
    tbCertificateConfirmationPage.verifyServiceName();

    // Click finish button to complete the process
    tbCertificateConfirmationPage.clickFinishButton();

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

    // Verify complete all sections text
    tbProgressTrackerPage.verifyCompleteAllSectionsText();

    // Verify task links exist
    tbProgressTrackerPage.verifyTaskLinksExist();

    // Verify sputum test information text
    tbProgressTrackerPage.verifySputumTestInformationText();

    // Verify service name
    tbProgressTrackerPage.verifyServiceName();

    // Verify task statuses
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Radiological outcome": "Completed",
      "TB certificate declaration": "Completed",
    });
  });
});
