// Helper functions to help with tests

import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "./commands";
import { ApplicantConfirmationPage } from "./page-objects/applicantConfirmationPage";
import { ApplicantDetailsPage } from "./page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "./page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "./page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "./page-objects/applicantSummaryPage";
import { ChestXrayConfirmationPage } from "./page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "./page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "./page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "./page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "./page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "./page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "./page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "./page-objects/medicalSummaryPage";
import { SputumQuestionPage } from "./page-objects/sputumQuestionPage";
import { TbCertificateConfirmationPage } from "./page-objects/tbCertificateConfirmationPage";
import { TbClearanceCertificateSummaryPage } from "./page-objects/tbCertificateSummaryPage";
import { TbClearanceCertificatePage } from "./page-objects/tbClearanceCertificatePage";
import { TBProgressTrackerPage } from "./page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "./page-objects/travelConfirmationPage";
import { TravelInformationPage } from "./page-objects/travelInformationPage";
import { TravelSummaryPage } from "./page-objects/travelSummaryPage";
import { testData } from "./test-data";
import { errorMessages, randomElement, visaType } from "./test-utils";

// Export utility functions from existing files so they're available in tests
export { errorMessages, randomElement, visaType };

/**
 * Generate a random passport number
 * Format: 2 letters followed by 7 digits
 */
export function getRandomPassportNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix =
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length));

  // Generate 7 random digits
  const digits = Math.floor(1000000 + Math.random() * 9000000);

  return prefix + digits;
}

export { testData };

/**
 * Generate a random TB certificate number
 */
export function getRandomTbCertificateNumber(): string {
  return "TB" + Math.floor(10000000 + Math.random() * 90000000);
}

/**
 * Generate test applicant data
 */
export function generateApplicantData() {
  const randomCountry = randomElement(countryList);
  const countryName = randomCountry?.value;
  const passportNumber = getRandomPassportNumber();
  const tbCertificateNumber = getRandomTbCertificateNumber();
  const selectedVisaType = randomElement(visaType);

  // Log what we're using for debugging
  cy.log(`Using passport number: ${passportNumber}`);
  cy.log(`Using country: ${countryName}`);
  cy.log(`Using TB certificate number: ${tbCertificateNumber}`);

  return {
    countryName,
    passportNumber,
    tbCertificateNumber,
    fullName: testData.fullName,
    sex: testData.sex === "male" ? "Male" : "Female",
    birthDay: testData.birthDate.day,
    birthMonth: testData.birthDate.month,
    birthYear: testData.birthDate.year,
    passportIssueDay: testData.passport.issueDate.day,
    passportIssueMonth: testData.passport.issueDate.month,
    passportIssueYear: testData.passport.issueDate.year,
    passportExpiryDay: testData.passport.expiryDate.day,
    passportExpiryMonth: testData.passport.expiryDate.month,
    passportExpiryYear: testData.passport.expiryDate.year,
    addressLine1: testData.address.line1,
    addressLine2: testData.address.line2,
    addressLine3: testData.address.line3,
    townOrCity: testData.address.town,
    provinceOrState: testData.address.province,
    postcode: testData.address.postcode,
    ukAddressLine1: "456 Park Lane",
    ukAddressLine2: "Floor 2",
    ukTownOrCity: "Manchester",
    ukPostcode: "M1 1AA",
    mobileNumber: "07700900123",
    email: "pets.tester@hotmail.com",
    visaType: selectedVisaType,
    age: "25",
  };
}

/**
 * Create a new applicant and go through the initial application process
 * Returns the applicant data used
 */
export function createNewApplicant() {
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantSummaryPage = new ApplicantSummaryPage();

  // Generate random test data
  const applicantData = generateApplicantData();

  // Start the applicant creation process
  applicantSearchPage.visit();
  applicantSearchPage.verifyPageLoaded();
  applicantSearchPage.fillPassportNumber(applicantData.passportNumber);
  applicantSearchPage.selectCountryOfIssue(applicantData.countryName);
  applicantSearchPage.submitSearch();

  // Create new applicant (with retry for when search takes longer)
  cy.get("body").then(($body) => {
    // Check if we need to wait longer for no matching record message
    if ($body.find(".govuk-error-summary").length === 0) {
      applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    }
  });

  applicantSearchPage.verifyCreateNewApplicantExists();
  applicantSearchPage.clickCreateNewApplicant();
  applicantSearchPage.verifyRedirectionToCreateApplicantPage();

  // Fill Applicant Details
  applicantDetailsPage.verifyPageLoaded();
  applicantDetailsPage.fillFullName(applicantData.fullName);
  applicantDetailsPage.selectSex(applicantData.sex);
  applicantDetailsPage.selectNationality(applicantData.countryName);
  applicantDetailsPage.fillBirthDate(
    applicantData.birthDay,
    applicantData.birthMonth,
    applicantData.birthYear,
  );
  applicantDetailsPage.fillPassportIssueDate(
    applicantData.passportIssueDay,
    applicantData.passportIssueMonth,
    applicantData.passportIssueYear,
  );
  applicantDetailsPage.fillPassportExpiryDate(
    applicantData.passportExpiryDay,
    applicantData.passportExpiryMonth,
    applicantData.passportExpiryYear,
  );
  applicantDetailsPage.fillAddressLine1(applicantData.addressLine1);
  applicantDetailsPage.fillAddressLine2(applicantData.addressLine2);
  applicantDetailsPage.fillAddressLine3(applicantData.addressLine3);
  applicantDetailsPage.fillTownOrCity(applicantData.townOrCity);
  applicantDetailsPage.fillProvinceOrState(applicantData.provinceOrState);
  applicantDetailsPage.selectAddressCountry(applicantData.countryName);
  applicantDetailsPage.fillPostcode(applicantData.postcode);
  applicantDetailsPage.submitForm();

  // Verify redirection to the Applicant Photo page
  cy.url().should("include", "/applicant-photo");
  applicantPhotoUploadPage.verifyPageLoaded();

  // Check applicant information is displayed correctly
  applicantPhotoUploadPage.verifyApplicantInfo({
    Name: applicantData.fullName,
    "Date of birth": `${applicantData.birthDay}/${applicantData.birthMonth}/${applicantData.birthYear}`,
    "Passport number": applicantData.passportNumber,
  });

  // Upload Applicant Photo file
  applicantPhotoUploadPage
    .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
    .verifyUploadSuccess();

  // Continue to Applicant Summary page
  applicantPhotoUploadPage.clickContinue();

  // Verify and confirm applicant summary
  applicantSummaryPage.verifyPageLoaded();
  applicantSummaryPage.confirmDetails();

  return applicantData;
}

/**
 * Helper function to navigate to the Travel Information page
 * Returns the applicant data used
 */
export function navigateToTravelInfoPage() {
  const applicantConfirmationPage = new ApplicantConfirmationPage();

  // Create a new applicant first
  const applicantData = createNewApplicant();

  // Proceed to travel information page
  applicantConfirmationPage.verifyPageLoaded();
  applicantConfirmationPage.clickContinueToTravelInformation();

  return applicantData;
}

/**
 * Helper function to complete the Travel Information section
 * and navigate to the Medical Screening page
 * Returns the applicant data used
 */
export function navigateToMedicalScreeningPage() {
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();

  // First navigate to the travel information page
  const applicantData = navigateToTravelInfoPage();

  // Complete the travel information section
  travelInformationPage.verifyPageLoaded();
  travelInformationPage.selectVisaType(applicantData.visaType);
  travelInformationPage.fillAddressLine1(applicantData.ukAddressLine1);
  travelInformationPage.fillAddressLine2(applicantData.ukAddressLine2);
  travelInformationPage.fillTownOrCity(applicantData.ukTownOrCity);
  travelInformationPage.fillPostcode(applicantData.ukPostcode);
  travelInformationPage.fillMobileNumber(applicantData.mobileNumber);
  travelInformationPage.fillEmail(applicantData.email);
  travelInformationPage.submitForm();

  // Complete travel summary
  travelSummaryPage.verifyPageLoaded();
  travelSummaryPage.submitForm();

  // Complete travel confirmation and continue to medical screening
  travelConfirmationPage.verifyPageLoaded();
  travelConfirmationPage.submitForm();

  return applicantData;
}

/**
 * Helper function to complete the Medical Screening section
 * and navigate to the Chest X-ray page
 * Returns the applicant data used
 */
export function navigateToChestXrayPage() {
  const medicalScreeningPage = new MedicalScreeningPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();

  // Navigate to the medical screening page
  const applicantData = navigateToMedicalScreeningPage();

  // Complete the medical screening
  medicalScreeningPage.verifyPageLoaded();
  medicalScreeningPage.fillAge(applicantData.age);
  medicalScreeningPage.selectTbSymptoms("No");
  medicalScreeningPage.selectPreviousTb("No");
  medicalScreeningPage.selectCloseContact("No");
  medicalScreeningPage.selectPregnancyStatus("No");
  medicalScreeningPage.selectMenstrualPeriods("No");
  medicalScreeningPage.fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.");
  medicalScreeningPage.submitForm();

  // Complete medical summary
  medicalSummaryPage.verifyPageLoaded();
  medicalSummaryPage.confirmDetails();

  // Navigate through confirmation to chest X-ray page
  medicalConfirmationPage.verifyPageLoaded();
  medicalConfirmationPage.clickContinueButton();

  return applicantData;
}

/**
 * Helper function to navigate to the Chest X-ray Upload page
 * Returns the applicant data used
 */
export function navigateToChestXrayUploadPage() {
  const chestXrayPage = new ChestXrayPage();

  // Navigate to the chest X-ray page
  const applicantData = navigateToChestXrayPage();

  // Select X-ray taken and continue to upload page
  chestXrayPage.verifyPageLoaded();
  chestXrayPage.selectXrayTakenYes();
  chestXrayPage.clickContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the Chest X-ray Findings page
 * Returns the applicant data used
 */
export function navigateToChestXrayFindingsPage() {
  const chestXrayUploadPage = new ChestXrayUploadPage();

  // Navigate to the chest X-ray upload page
  const applicantData = navigateToChestXrayUploadPage();

  // Upload an X-ray file
  chestXrayUploadPage.verifyPageLoaded();
  chestXrayUploadPage.uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm");
  chestXrayUploadPage.verifyUploadSuccess();
  chestXrayUploadPage.clickContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the Sputum Question page
 * Returns the applicant data used
 */
export function navigateToSputumQuestionPage() {
  const chestXrayFindingsPage = new ChestXrayFindingsPage();

  // Navigate to the chest X-ray findings page
  const applicantData = navigateToChestXrayFindingsPage();

  // Complete the X-ray findings page
  chestXrayFindingsPage.verifyPageLoaded();
  chestXrayFindingsPage.selectXrayResultNormal();
  chestXrayFindingsPage.selectMinorFindings(["1.1 Single fibrous streak or band or scar"]);
  chestXrayFindingsPage.clickSaveAndContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the Progress Tracker
 * Returns the applicant data used
 */
export function navigateToProgressTracker() {
  const sputumQuestionPage = new SputumQuestionPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();

  // Navigate to the sputum question page
  const applicantData = navigateToSputumQuestionPage();

  // Select "No" for sputum collection
  sputumQuestionPage.verifyPageLoaded();
  sputumQuestionPage.selectSputumRequiredNo();
  sputumQuestionPage.clickContinue();

  // Continue through chest X-ray summary
  chestXraySummaryPage.verifyPageLoaded();
  chestXraySummaryPage.clickSaveAndContinue();

  // Continue through chest X-ray confirmation to get to progress tracker
  chestXrayConfirmationPage.verifyPageLoaded();
  chestXrayConfirmationPage.clickContinueButton();

  return applicantData;
}

/**
 * Helper function to navigate to the Progress Tracker with sputum "Yes" selected
 * Returns the applicant data used
 */
export function navigateToProgressTrackerWithSputumYes() {
  const sputumQuestionPage = new SputumQuestionPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();

  // Navigate to the sputum question page
  const applicantData = navigateToSputumQuestionPage();

  // Select "Yes" for sputum collection
  sputumQuestionPage.verifyPageLoaded();
  sputumQuestionPage.selectSputumRequiredYes();
  sputumQuestionPage.clickContinue();

  // Continue through chest X-ray summary
  chestXraySummaryPage.verifyPageLoaded();
  chestXraySummaryPage.clickSaveAndContinue();

  // Continue through chest X-ray confirmation to get to progress tracker
  chestXrayConfirmationPage.verifyPageLoaded();
  chestXrayConfirmationPage.clickContinueButton();

  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate page via Progress Tracker
 * This enforces the business rule that TB certificate declaration can only be accessed
 * after all prerequisite tasks are completed (JIRA TBBETA-550)
 * Returns the applicant data used
 */
export function navigateToTbCertificatePageViaTracker() {
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Navigate to the progress tracker first
  const applicantData = navigateToProgressTracker();

  // Click on TB certificate declaration from the tracker
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("TB certificate declaration");

  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate page (UPDATED)
 * This maintains backward compatibility by using the new flow
 * Returns the applicant data used
 */
export function navigateToTbCertificatePage() {
  return navigateToTbCertificatePageViaTracker();
}

/**
 * Helper function to complete the entire flow up to TB certificate completion
 * Returns the applicant data used
 */
export function completeFullFlowToTbCertificate() {
  const tbClearanceCertificatePage = new TbClearanceCertificatePage();
  const tbClearanceCertificateSummaryPage = new TbClearanceCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();

  // Navigate to TB certificate page via the tracker
  const applicantData = navigateToTbCertificatePageViaTracker();

  // Complete TB certificate
  tbClearanceCertificatePage.verifyPageLoaded();
  tbClearanceCertificatePage.fillFormWithValidData({
    clearanceIssued: "Yes",
    physicianComments: "No signs of active tuberculosis. Chest X-ray clear.",
    certificateDay: "19",
    certificateMonth: "03",
    certificateYear: "2025",
    certificateNumber: applicantData.tbCertificateNumber,
  });

  // Complete TB certificate summary
  tbClearanceCertificateSummaryPage.verifyPageLoaded();
  tbClearanceCertificateSummaryPage.clickSaveAndContinue();

  // Complete TB certificate confirmation
  tbCertificateConfirmationPage.verifyPageLoaded();
  tbCertificateConfirmationPage.clickFinishButton();

  return applicantData;
}

/**
 * Create test fixtures needed for the application tests
 */
export function createTestFixtures() {
  // Create a simple PNG image for X-ray upload tests
  const simpleImageData =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  cy.writeFile("cypress/fixtures/test-image.png", simpleImageData, "base64");

  // Create an invalid text file for file format tests
  cy.writeFile("cypress/fixtures/invalid-file.txt", "This is not an image file");
}

/**
 * Helper function to verify validation error message
 * Uses the error messages from the test-utils.ts file
 */
export function verifyValidationError(errorKey: string) {
  const errorMessage = errorMessages.find((msg) => msg.includes(errorKey));

  if (!errorMessage) {
    throw new Error(`Error message with key "${errorKey}" not found in errorMessages array`);
  }

  cy.get(".govuk-error-summary").should("be.visible");
  cy.get(".govuk-error-summary__list").should("contain.text", errorMessage);
}

/**
 * Helper function to verify multiple validation errors
 */
export function verifyMultipleValidationErrors(errorKeys: string[]) {
  cy.get(".govuk-error-summary").should("be.visible");

  errorKeys.forEach((key) => {
    const errorMessage = errorMessages.find((msg) => msg.includes(key));
    if (errorMessage) {
      cy.get(".govuk-error-summary__list").should("contain.text", errorMessage);
    } else {
      cy.log(`Warning: Error message with key "${key}" not found in errorMessages array`);
    }
  });
}

/**
 * Helper function to handle server-side timeouts gracefully
 * Can be used with cy.get() commands to add a longer timeout
 * for elements that may take longer to appear
 */
export function withLongTimeout(selector: string, timeout = 30000) {
  return cy.get(selector, { timeout });
}

/**
 * This is a wrapper around the existing loginViaB2C command
 */
export function loginToApplication() {
  loginViaB2C();
}
