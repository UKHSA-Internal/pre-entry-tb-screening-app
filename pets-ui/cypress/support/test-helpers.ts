// Helper functions to help with tests

import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "./commands";
import { ApplicantConfirmationPage } from "./page-objects/applicantConfirmationPage";
import { ApplicantDetailsPage } from "./page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "./page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "./page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "./page-objects/applicantSummaryPage";
import { CheckSputumSampleInfoPage } from "./page-objects/checkSputumSampleInfoPage";
import { ChestXrayConfirmationPage } from "./page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "./page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "./page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "./page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "./page-objects/chestXrayUploadPage";
import { EnterSputumSampleResultsPage } from "./page-objects/enterSputumSampleResultsPage";
import { MedicalConfirmationPage } from "./page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "./page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "./page-objects/medicalSummaryPage";
import { SputumCollectionPage } from "./page-objects/sputumCollectionPage";
import { SputumConfirmationPage } from "./page-objects/sputumConfirmationPage";
import { SputumQuestionPage } from "./page-objects/sputumQuestionPage";
import { TbCertificateConfirmationPage } from "./page-objects/tbCertificateConfirmationPage";
import { TbCertificateDeclarationPage } from "./page-objects/tbCertificateDeclarationPage";
import { TbCertificateQuestionPage } from "./page-objects/tbCertificateQuestionPage";
import { TbCertificateSummaryPage } from "./page-objects/tbCertificateSummaryPage";
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
 * Helper function to generate standard sputum collection test data
 */
export function generateSputumCollectionData() {
  return {
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
}

// Type definitions for sputum results (matching the page object)
export type SputumResult = "Negative" | "Positive" | "Inconclusive";

export interface SampleResultData {
  smearResult: SputumResult;
  cultureResult: SputumResult;
}

export interface AllSampleResultsData {
  sample1: SampleResultData;
  sample2: SampleResultData;
  sample3: SampleResultData;
}

/**
 * Helper function to generate standard sputum results test data
 */
export function generateSputumResultsData(
  resultType: "allNegative" | "allPositive" | "mixed" | "allInconclusive" = "allNegative",
): AllSampleResultsData {
  // Import the type from the page object to ensure consistency
  type SputumResult = "Negative" | "Positive" | "Inconclusive";

  const negative: SputumResult = "Negative";
  const positive: SputumResult = "Positive";
  const inconclusive: SputumResult = "Inconclusive";

  switch (resultType) {
    case "allNegative":
      return {
        sample1: { smearResult: negative, cultureResult: negative },
        sample2: { smearResult: negative, cultureResult: negative },
        sample3: { smearResult: negative, cultureResult: negative },
      };
    case "allPositive":
      return {
        sample1: { smearResult: positive, cultureResult: positive },
        sample2: { smearResult: positive, cultureResult: positive },
        sample3: { smearResult: positive, cultureResult: positive },
      };
    case "mixed":
      return {
        sample1: { smearResult: negative, cultureResult: positive },
        sample2: { smearResult: positive, cultureResult: negative },
        sample3: { smearResult: inconclusive, cultureResult: inconclusive },
      };
    case "allInconclusive":
      return {
        sample1: { smearResult: inconclusive, cultureResult: inconclusive },
        sample2: { smearResult: inconclusive, cultureResult: inconclusive },
        sample3: { smearResult: inconclusive, cultureResult: inconclusive },
      };
    default:
      return generateSputumResultsData("allNegative");
  }
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
  const applicantConfirmationPage = new ApplicantConfirmationPage();

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
  applicantDetailsPage.fillCompleteForm({
    fullName: applicantData.fullName,
    sex: applicantData.sex,
    nationality: applicantData.countryName,
    birthDay: applicantData.birthDay,
    birthMonth: applicantData.birthMonth,
    birthYear: applicantData.birthYear,
    passportIssueDay: applicantData.passportIssueDay,
    passportIssueMonth: applicantData.passportIssueMonth,
    passportIssueYear: applicantData.passportIssueYear,
    passportExpiryDay: applicantData.passportExpiryDay,
    passportExpiryMonth: applicantData.passportExpiryMonth,
    passportExpiryYear: applicantData.passportExpiryYear,
    addressLine1: applicantData.addressLine1,
    addressLine2: applicantData.addressLine2,
    addressLine3: applicantData.addressLine3,
    townOrCity: applicantData.townOrCity,
    provinceOrState: applicantData.provinceOrState,
    addressCountry: applicantData.countryName,
    postcode: applicantData.postcode,
  });
  applicantDetailsPage.submitForm();

  // Verify redirection to the Applicant Photo page
  cy.url().should("include", "/applicant-photo");
  applicantPhotoUploadPage.verifyPageLoaded();

  // Upload Applicant Photo file
  applicantPhotoUploadPage
    .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
    .verifyUploadSuccess();

  // Continue to Applicant Summary page
  applicantPhotoUploadPage.clickContinue();

  // Verify and confirm applicant summary
  applicantSummaryPage.verifyPageLoaded();
  applicantSummaryPage.confirmDetails();

  // Complete applicant confirmation and go to tracker
  applicantConfirmationPage.verifyPageLoaded();
  applicantConfirmationPage.verifyNextStepsText();
  applicantConfirmationPage.clickContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the Travel Information page from the tracker
 * Returns the applicant data used
 */
export function navigateToTravelInfoPage() {
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Create a new applicant first
  const applicantData = createNewApplicant();

  // Navigate to travel information from the tracker
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("Travel information");

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
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // First navigate to the travel information page
  const applicantData = navigateToTravelInfoPage();

  // Complete the travel information section
  travelInformationPage.verifyPageLoaded();
  travelInformationPage.fillCompleteForm({
    ukAddressLine1: applicantData.ukAddressLine1,
    ukAddressLine2: applicantData.ukAddressLine2,
    ukTownOrCity: applicantData.ukTownOrCity,
    ukPostcode: applicantData.ukPostcode,
    mobileNumber: applicantData.mobileNumber,
    email: applicantData.email,
  });
  travelInformationPage.submitForm();

  // Complete travel summary
  travelSummaryPage.verifyPageLoaded();
  travelSummaryPage.submitForm();

  // Complete travel confirmation and return to tracker
  travelConfirmationPage.verifyPageLoaded();
  travelConfirmationPage.clickContinue();

  // Navigate to medical screening from the tracker
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

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
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Navigate to the medical screening page
  const applicantData = navigateToMedicalScreeningPage();

  // Complete the medical screening
  medicalScreeningPage.verifyPageLoaded();
  medicalScreeningPage
    .fillAge(applicantData.age)
    .selectTbSymptoms("No")
    .selectPreviousTb("No")
    .selectCloseContact("No")
    .selectPregnancyStatus("No")
    .selectMenstrualPeriods("No")
    .fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.")
    .submitForm();

  // Complete medical summary
  medicalSummaryPage.verifyPageLoaded();
  medicalSummaryPage.confirmDetails();

  // Navigate through confirmation to return to tracker
  medicalConfirmationPage.verifyPageLoaded();
  medicalConfirmationPage.clickContinueButton();

  // Navigate to chest X-ray from the tracker
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("Radiological outcome");

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
  chestXrayFindingsPage.selectMinorFindings(["1.1 Single fibrous streak or band or scar"]);
  chestXrayFindingsPage.clickSaveAndContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the Sputum Collection page
 * Returns the applicant data used
 */
export function navigateToSputumCollectionPage() {
  const sputumQuestionPage = new SputumQuestionPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();

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

  // From the progress tracker, click on sputum collection
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

  return applicantData;
}

/**
 * Helper function to navigate to the Enter Sputum Sample Results page
 * Returns the applicant data used
 */
export function navigateToEnterSputumSampleResultsPage() {
  const sputumCollectionPage = new SputumCollectionPage();

  // Navigate to the sputum collection page
  const applicantData = navigateToSputumCollectionPage();

  // Fill sputum collection data for all three samples
  const sputumData = generateSputumCollectionData();

  // Complete sputum collection
  sputumCollectionPage.verifyPageLoaded();
  sputumCollectionPage.fillAllSamples(sputumData);
  sputumCollectionPage.clickSaveAndContinueToResults();

  return applicantData;
}

/**
 * Helper function to complete the sputum collection and results flow
 * Returns the applicant data used
 */
export function completeSputumCollectionAndResults() {
  const enterSputumSampleResultsPage = new EnterSputumSampleResultsPage();
  const checkSputumSampleInfoPage = new CheckSputumSampleInfoPage();
  const sputumConfirmationPage = new SputumConfirmationPage();

  // Navigate to the enter sputum sample results page
  const applicantData = navigateToEnterSputumSampleResultsPage();

  // Use the page object's built-in method for filling negative results
  enterSputumSampleResultsPage.verifyPageLoaded();
  enterSputumSampleResultsPage.fillWithAllNegativeResults();
  enterSputumSampleResultsPage.clickSaveAndContinue();

  // Complete the sputum sample info check page
  checkSputumSampleInfoPage.verifyPageLoaded();
  checkSputumSampleInfoPage.clickSaveAndContinue();

  // Complete sputum confirmation
  sputumConfirmationPage.verifyPageLoaded();
  sputumConfirmationPage.clickContinueButton();

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
 * Helper function to navigate to the Progress Tracker with completed sputum collection
 * Returns the applicant data used
 */
export function navigateToProgressTrackerWithCompletedSputum() {
  // Complete the entire sputum collection and results flow
  const applicantData = completeSputumCollectionAndResults();

  // Should now be back at the progress tracker
  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate Question page via Progress Tracker
 * Returns the applicant data used
 */
export function navigateToTbCertificateQuestionPageViaTracker() {
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Navigate to the progress tracker first
  const applicantData = navigateToProgressTracker();

  // Click on TB certificate outcome from the tracker
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate Declaration page via Progress Tracker
 * Returns the applicant data used
 */
export function navigateToTbCertificateDeclarationPageViaTracker() {
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();

  // Navigate to the TB certificate question page first
  const applicantData = navigateToTbCertificateQuestionPageViaTracker();

  // Select "Yes" for TB clearance certificate issuance
  tbCertificateQuestionPage.verifyPageLoaded();
  tbCertificateQuestionPage.selectTbClearanceOption("Yes");
  tbCertificateQuestionPage.clickContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate Declaration page with completed sputum
 * Returns the applicant data used
 */
export function navigateToTbCertificateDeclarationPageViaTrackerWithSputum() {
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();

  // Navigate to the progress tracker with completed sputum
  const applicantData = navigateToProgressTrackerWithCompletedSputum();

  // Click on TB certificate outcome from the tracker
  tbProgressTrackerPage.verifyPageLoaded();
  tbProgressTrackerPage.clickTaskLink("TB certificate outcome");

  // Select "Yes" for TB clearance certificate issuance
  tbCertificateQuestionPage.verifyPageLoaded();
  tbCertificateQuestionPage.selectTbClearanceOption("Yes");
  tbCertificateQuestionPage.clickContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate Summary page
 * Returns the applicant data used
 */
export function navigateToTbCertificateSummaryPage() {
  const tbCertificateDeclarationPage = new TbCertificateDeclarationPage();

  // Navigate to TB certificate declaration page
  const applicantData = navigateToTbCertificateDeclarationPageViaTracker();

  // Fill TB Certificate Declaration details
  const tbCertificateDeclarationData = {
    declaringPhysicianName: "Dr. Sarah Johnson",
    physicianComments:
      "Applicant has completed full TB screening. All tests negative. Certificate issued in accordance with UKHSA guidelines.",
  };

  // Complete TB certificate declaration
  tbCertificateDeclarationPage.verifyPageLoaded();
  tbCertificateDeclarationPage.fillFormWithValidData(tbCertificateDeclarationData);
  tbCertificateDeclarationPage.clickContinue();

  return applicantData;
}

/**
 * Helper function to navigate to the TB Certificate Confirmation page
 * Returns the applicant data used
 */
export function navigateToTbCertificateConfirmationPage() {
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();

  // Navigate to TB certificate summary page
  const applicantData = navigateToTbCertificateSummaryPage();

  // Submit the certificate information
  tbCertificateSummaryPage.verifyPageLoaded();
  tbCertificateSummaryPage.clickSubmit();

  return applicantData;
}

/**
 * Helper function to complete the entire flow up to TB certificate completion
 * Returns the applicant data used
 */
export function completeFullFlowToTbCertificate() {
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();

  // Navigate to TB certificate confirmation page
  const applicantData = navigateToTbCertificateConfirmationPage();

  // Verify TB certificate confirmation page
  tbCertificateConfirmationPage.verifyPageLoaded();

  return applicantData;
}

/**
 * Helper function to complete the entire flow up to TB certificate completion with sputum
 * Returns the applicant data used
 */
export function completeFullFlowToTbCertificateWithSputum() {
  const tbCertificateDeclarationPage = new TbCertificateDeclarationPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbCertificateConfirmationPage = new TbCertificateConfirmationPage();

  // Navigate to TB certificate declaration page with completed sputum
  const applicantData = navigateToTbCertificateDeclarationPageViaTrackerWithSputum();

  // Fill TB Certificate Declaration details
  const tbCertificateDeclarationData = {
    declaringPhysicianName: "Dr. Sarah Johnson",
    physicianComments:
      "Applicant has completed full TB screening. All tests negative. Sputum samples negative. Certificate issued in accordance with UKHSA guidelines.",
  };

  // Complete TB certificate declaration
  tbCertificateDeclarationPage.verifyPageLoaded();
  tbCertificateDeclarationPage.fillFormWithValidData(tbCertificateDeclarationData);
  tbCertificateDeclarationPage.clickContinue();

  // Complete TB certificate summary
  tbCertificateSummaryPage.verifyPageLoaded();
  tbCertificateSummaryPage.clickSubmit();

  // Verify TB certificate confirmation
  tbCertificateConfirmationPage.verifyPageLoaded();

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

/**
 * Generate TB Certificate Declaration data for testing
 */
export function generateTbCertificateDeclarationData() {
  return {
    declaringPhysicianName: "Dr. Sarah Johnson",
    physicianComments:
      "Applicant has completed full TB screening. All tests negative. Certificate issued in accordance with UKHSA guidelines.",
  };
}

/**
 * Generate TB Certificate Declaration data with sputum for testing
 */
export function generateTbCertificateDeclarationDataWithSputum() {
  return {
    declaringPhysicianName: "Dr. Sarah Johnson",
    physicianComments:
      "Applicant has completed full TB screening. All tests negative. Sputum samples negative. Certificate issued in accordance with UKHSA guidelines.",
  };
}

/**
 * Helper function to generate expected sputum sample data for verification
 */
export function generateExpectedSputumSampleData() {
  const sputumData = generateSputumCollectionData();

  return {
    sample1: {
      dateTaken: `${sputumData.sample1.date.day}/${sputumData.sample1.date.month}/${sputumData.sample1.date.year}`,
      collectionMethod: sputumData.sample1.collectionMethod,
      smearResult: "Negative",
      cultureResult: "Negative",
    },
    sample2: {
      dateTaken: `${sputumData.sample2.date.day}/${sputumData.sample2.date.month}/${sputumData.sample2.date.year}`,
      collectionMethod: sputumData.sample2.collectionMethod,
      smearResult: "Negative",
      cultureResult: "Negative",
    },
    sample3: {
      dateTaken: `${sputumData.sample3.date.day}/${sputumData.sample3.date.month}/${sputumData.sample3.date.year}`,
      collectionMethod: sputumData.sample3.collectionMethod,
      smearResult: "Negative",
      cultureResult: "Negative",
    },
  };
}

/**
 * Helper function to verify task statuses on progress tracker
 */
export function verifyStandardTaskStatuses() {
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  tbProgressTrackerPage.verifyMultipleTaskStatuses({
    "Visa applicant details": "Completed",
    "UK travel information": "Completed",
    "Medical history and TB symptoms": "Completed",
    "Radiological outcome": "Completed",
    "Sputum collection and results": "Not yet started",
    "TB certificate outcome": "Not yet started",
  });
}
/**
 * Backward compatibility - redirects to new method names
 */
export function navigateToTbCertificatePage() {
  return navigateToTbCertificateQuestionPageViaTracker();
}

export function navigateToTbCertificatePageViaTracker() {
  return navigateToTbCertificateQuestionPageViaTracker();
}

export function navigateToTbCertificatePageViaTrackerWithSputum() {
  return navigateToTbCertificateDeclarationPageViaTrackerWithSputum();
}
// AGE CALCULATIONS

/**
 * Calculate age based on date of birth
 * @param day - Day of birth (1-31)
 * @param month - Month of birth (1-12)
 * @param year - Year of birth (e.g., 2000)
 * @returns Age as a number
 */
export function calculateAge(
  day: number | string,
  month: number | string,
  year: number | string,
): number {
  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // If birthday hasn't occurred this year yet, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculate age and return formatted string for validation
 * @param day - Day of birth (1-31)
 * @param month - Month of birth (1-12)
 * @param year - Year of birth (e.g., 2000)
 * @returns Formatted age string (e.g., "25 years old")
 */
export function calculateAgeString(
  day: number | string,
  month: number | string,
  year: number | string,
): string {
  const age = calculateAge(day, month, year);
  return `${age} years old`;
}

/**
 * Calculate date of birth needed to achieve a specific age
 * @param desiredAge - The age you want the applicant to be
 * @returns Object with day, month, year for a person of that age
 */
export function calculateDobForAge(desiredAge: number): {
  day: string;
  month: string;
  year: string;
} {
  const today = new Date();
  const year = today.getFullYear() - desiredAge;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return { day, month, year: String(year) };
}

/**
 * Calculate DOB for a child that will always be under 11 years old
 * Perfect for child-specific test scenarios
 * @param targetAge - Optional specific age (0-10). If not provided, defaults to 7 years old
 * @returns Object with day, month, year for a child under 11
 */
export function calculateDobForChildUnder11(targetAge?: number): {
  day: string;
  month: string;
  year: string;
} {
  // Validate target age if provided
  if (targetAge !== undefined) {
    if (targetAge < 0 || targetAge >= 11) {
      throw new Error("targetAge must be between 0 and 10 for a child under 11");
    }
  }

  // Use provided age or default to 7 years old for good test coverage
  const ageToUse = targetAge ?? 7;
  return calculateDobForAge(ageToUse);
}

/**
 * Calculate a random DOB for a child that will always be under 11
 * Useful for varied test data
 * @returns Object with day, month, year for a random child under 11 (age 0-10)
 */
export function calculateDobForRandomChildUnder11(): { day: string; month: string; year: string } {
  const randomAge = Math.floor(Math.random() * 11); // 0-10 inclusive
  return calculateDobForAge(randomAge);
}

/**
 * Verify that a date of birth represents a child under 11 years old
 * @param day - Day of birth
 * @param month - Month of birth
 * @param year - Year of birth
 * @returns true if applicant is under 11 years old
 */
export function isChildUnder11(
  day: number | string,
  month: number | string,
  year: number | string,
): boolean {
  const age = calculateAge(day, month, year);
  return age < 11;
}

/**
 * Verify that a date of birth represents a child (0-10 years old)
 * Alias for isChildUnder11 for semantic clarity
 * @param day - Day of birth
 * @param month - Month of birth
 * @param year - Year of birth
 * @returns true if the person is a child under 11
 */
export function isChild(
  day: number | string,
  month: number | string,
  year: number | string,
): boolean {
  return isChildUnder11(day, month, year);
}

/**
 * Verify that a date of birth represents an adult (11+ years old)
 * @param day - Day of birth
 * @param month - Month of birth
 * @param year - Year of birth
 * @returns true if the person is 11 or older
 */
export function isAdult(
  day: number | string,
  month: number | string,
  year: number | string,
): boolean {
  const age = calculateAge(day, month, year);
  return age >= 11;
}

/**
 * Get age category for an applicant
 * @param day - Day of birth
 * @param month - Month of birth
 * @param year - Year of birth
 * @returns One of: "infant" (0-5), "child" (6-10), "teen" (11-17), "adult" (18+)
 */
export function getAgeCategory(
  day: number | string,
  month: number | string,
  year: number | string,
): "infant" | "child" | "teen" | "adult" {
  const age = calculateAge(day, month, year);

  if (age < 6) return "infant";
  if (age < 11) return "child";
  if (age < 18) return "teen";
  return "adult";
}

/**
 * Get today's date formatted as day, month, year for form filling
 * @returns Object with day, month, year properties
 */
export function getTodayDate(): { day: string; month: string; year: string } {
  const today = new Date();
  return {
    day: String(today.getDate()).padStart(2, "0"),
    month: String(today.getMonth() + 1).padStart(2, "0"),
    year: String(today.getFullYear()),
  };
}

/**
 * Get yesterday's date formatted for form filling
 * @returns Object with day, month, year properties
 */
export function getYesterdayDate(): { day: string; month: string; year: string } {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    day: String(yesterday.getDate()).padStart(2, "0"),
    month: String(yesterday.getMonth() + 1).padStart(2, "0"),
    year: String(yesterday.getFullYear()),
  };
}

/**
 * Get date from N days ago
 * @param daysAgo - Number of days in the past
 * @returns Object with day, month, year properties
 */
export function getDateDaysAgo(daysAgo: number): { day: string; month: string; year: string } {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

/**
 * Format date string for display (e.g., "25 March 2025")
 * @param day - Day (1-31)
 * @param month - Month (1-12)
 * @param year - Year
 * @returns Formatted date string
 */
export function formatDateForDisplay(
  day: string | number,
  month: string | number,
  year: string | number,
): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = Number(month) - 1;
  return `${day} ${monthNames[monthIndex]} ${year}`;
}

/**
 * Parse date string in format "DD/MM/YYYY" and return components
 * @param dateString - Date in format "DD/MM/YYYY"
 * @returns Object with day, month, year properties
 */
export function parseDateString(dateString: string): { day: string; month: string; year: string } {
  const [day, month, year] = dateString.split("/");
  return { day, month, year };
}

/**
 * Check if a date of birth is valid
 * @param day - Day of birth
 * @param month - Month of birth
 * @param year - Year of birth
 * @returns true if date is valid
 */
export function isValidDate(
  day: number | string,
  month: number | string,
  year: number | string,
): boolean {
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date instanceof Date && !isNaN(date.getTime());
}
