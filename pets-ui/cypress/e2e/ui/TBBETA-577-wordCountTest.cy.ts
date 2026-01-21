//PETS Private Beta E2E Test with TB Certificate Not Issued
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckChestXrayImagesPage } from "../../support/page-objects/checkChestXrayImagesPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import { ChestXrayConfirmationPage } from "../../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
import { ChestXrayResultsPage } from "../../support/page-objects/chestXrayResultsPage";
import { ChestXrayUploadPage } from "../../support/page-objects/chestXrayUploadPage";
import { ContactInformationPage } from "../../support/page-objects/contactInformationPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import { RadiologicalOutcomeConfPage } from "../../support/page-objects/radiologicalOutcomeConfPage";
import { SputumDecisionConfirmationPage } from "../../support/page-objects/sputumDecisionConfirmationPage";
import { SputumDecisionInfoPage } from "../../support/page-objects/sputumDecisionInfoPage";
import { SputumQuestionPage } from "../../support/page-objects/sputumQuestionPage";
import { TbCertificateNotIssuedFormPage } from "../../support/page-objects/tbCertificateNotIssuedFormPage";
import { TbCertificateQuestionPage } from "../../support/page-objects/tbCertificateQuestionPage";
import { TbCertificateSummaryPage } from "../../support/page-objects/tbCertificateSummaryPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
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

describe("PETS Application End-to-End Tests with TB Certificate Not Issued", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();
  const contactInformationPage = new ContactInformationPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const radiologicalOutcomeConfPage = new RadiologicalOutcomeConfPage();
  const sputumQuestionPage = new SputumQuestionPage();
  const sputumDecisionConfirmationPage = new SputumDecisionConfirmationPage();
  const sputumDecisionInfoPage = new SputumDecisionInfoPage();
  const checkChestXrayImagesPage = new CheckChestXrayImagesPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const chestXrayResultsPage = new ChestXrayResultsPage();
  const tbCertificateNotIssuedFormPage = new TbCertificateNotIssuedFormPage();
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();
  const xRayResultsAndFindingsPage = new XRayResultsAndFindingsPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBFormatted: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDate: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample1Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample2Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample3Date: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();

    // Generate dynamic dates for adult applicant (30 years old)
    adultAge = 30;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    // Format with leading zeros, then normalize for UI comparison
    adultDOBFormatted = DateUtils.normalizeDateForComparison(
      DateUtils.formatDateDDMMYYYY(DateUtils.getAdultDateOfBirth(adultAge)),
    );

    // Generate passport dates (issued 2 years ago, expires in 8 years)
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // Generate screening date (1 month ago for realistic scenario)
    const screening = DateUtils.getDateInPast(0, 1, 0); // 1 month ago
    screeningDate = DateUtils.getDateComponents(screening);

    // Generate X-ray date (2 weeks ago, after screening)
    const xray = DateUtils.getDateInPast(0, 0, 14); // 2 weeks ago
    xrayDate = DateUtils.getDateComponents(xray);

    // Generate sputum collection dates (2-3 months ago for realistic scenario)
    const sample1 = DateUtils.getDateInPast(0, 3, 0); // 3 months ago
    const sample2 = DateUtils.getDateInPast(0, 3, -1); // 1 day after sample 1
    const sample3 = DateUtils.getDateInPast(0, 3, -2); // 1 day after sample 2

    sputumSample1Date = DateUtils.getDateComponents(sample1);
    sputumSample2Date = DateUtils.getDateComponents(sample2);
    sputumSample3Date = DateUtils.getDateComponents(sample3);

    // Log generated dates for debugging
    cy.log(`Adult Age: ${adultAge}`);
    cy.log(`Adult DOB: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(`DOB Formatted: ${adultDOBFormatted}`);
    cy.log(
      `Calculated Age: ${DateUtils.calculateAge(DateUtils.getAdultDateOfBirth(adultAge))} years`,
    );
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year}`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
    cy.log(`Screening Date: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);
    cy.log(`X-ray Date: ${xrayDate.day}/${xrayDate.month}/${xrayDate.year}`);
    cy.log(
      `Sputum Sample 1: ${sputumSample1Date.day}/${sputumSample1Date.month}/${sputumSample1Date.year}`,
    );
    cy.log(
      `Sputum Sample 2: ${sputumSample2Date.day}/${sputumSample2Date.month}/${sputumSample2Date.year}`,
    );
    cy.log(
      `Sputum Sample 3: ${sputumSample3Date.day}/${sputumSample3Date.month}/${sputumSample3Date.year}`,
    );
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

  it("should enforce word count limit on physician comments textarea", () => {
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

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details - Page 1: Personal Information
    applicantDetailsPage.verifyPageLoaded();
    applicantDetailsPage
      .fillFullName("Jane Tester-Doe")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .submitForm();

    // Fill Applicant Details - Page 2: Passport Information
    passportInformationPage.verifyPageLoaded();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .fillIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillExpiryDate(passportExpiryDate.day, passportExpiryDate.month, passportExpiryDate.year)
      .submitForm();

    // Fill Applicant Details - Page 3: Contact Information
    contactInformationPage.verifyPageLoaded();
    contactInformationPage
      .fillAddressLine1("456 Oak Tree Avenue")
      .fillTownOrCity("St. Peters")
      .fillProvinceOrState("Dreamland")
      .selectCountry(countryName)
      .fillPostcode("62409")
      .submitForm();

    // Upload photo and complete applicant summary
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    // Continue to Check Photo page
    applicantPhotoUploadPage.clickContinue();

    // Check photo page
    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();

    // Applicant Summary
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.confirmDetails();

    // Applicant Confirmation
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.clickContinue();

    // Complete travel information
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("UK travel information");

    // Select random visa category
    visaCategoryPage.selectRandomVisaCategory();
    visaCategoryPage.clickContinue();

    // Fill travel information
    travelInformationPage.verifyPageLoaded();
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "789 City Road",
      ukAddressLine2: "Flat 5",
      ukTownOrCity: "Edinburgh",
      ukPostcode: "EH1 1AA",
      mobileNumber: "07700900789",
      email: "pets.tester3@hotmail.com",
    });
    travelInformationPage.submitForm();

    // Submit travel summary
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.submitForm();

    // Travel Confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Medical screening
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillScreeningDate(screeningDate.day, screeningDate.month, screeningDate.year)
      .fillAge(adultAge.toString())
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Patient appears healthy.")
      .submitForm();

    // X-ray question
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenYes();
    chestXrayPage.submitForm();

    // Medical summary
    medicalSummaryPage.verifyPageLoaded();
    medicalSummaryPage.confirmDetails();

    // Medical confirmation
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.clickContinueButton();

    // Upload chest X-ray
    tbProgressTrackerPage.clickTaskLink("Upload chest X-ray images");
    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage.enterDateXrayTaken(xrayDate.day, xrayDate.month, xrayDate.year);
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();
    chestXrayUploadPage.clickContinue();

    // Check X-ray images
    checkChestXrayImagesPage.verifyPageLoaded();
    checkChestXrayImagesPage.clickSaveAndContinue();

    // X-ray confirmation
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.clickContinueAndVerifyRedirection();

    // Radiological outcome
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");
    chestXrayResultsPage.verifyPageLoaded();
    chestXrayResultsPage.selectChestXrayNormal();
    chestXrayResultsPage.clickContinueAndVerifyRedirection();

    // X-ray findings
    chestXrayFindingsPage.verifyPageLoaded();
    chestXrayFindingsPage.clickContinueButton();

    // X-ray results and findings
    xRayResultsAndFindingsPage.verifyPageLoaded();
    xRayResultsAndFindingsPage.clickSaveAndContinueButton();

    // Radiological outcome confirmation
    radiologicalOutcomeConfPage.verifyPageLoaded();
    radiologicalOutcomeConfPage.clickContinueButton();

    // Sputum decision
    tbProgressTrackerPage.clickTaskLink("Make a sputum decision");
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredNo().clickContinue();

    // Sputum decision info
    sputumDecisionInfoPage.verifyPageLoaded();
    sputumDecisionInfoPage.clickSaveAndContinueButton();

    // Sputum decision confirmation
    sputumDecisionConfirmationPage.verifyPageLoaded();
    sputumDecisionConfirmationPage.clickContinueButton();

    // TB certificate outcome
    tbProgressTrackerPage.clickTaskLink("TB certificate outcome");
    tbCertificateQuestionPage.verifyPageLoaded();
    tbCertificateQuestionPage.selectTbClearanceOption("No");
    tbCertificateQuestionPage.clickContinue();

    // ============================================================
    // WORD COUNT VALIDATION TEST - TB Certificate Not Issued Form
    // ============================================================

    // Verify TB Certificate Not Issued Form page is loaded
    cy.url().should("include", "/why-are-you-not-issuing-certificate");
    tbCertificateNotIssuedFormPage.verifyPageLoaded();
    tbCertificateNotIssuedFormPage.verifyAllPageElements();

    // Test word count functionality on physician comments textarea using POM method
    cy.log("Testing word count validation on physician comments field");
    tbCertificateNotIssuedFormPage.testWordCountValidation();

    // Verify the error state is displayed with "1 word too many" message
    tbCertificateNotIssuedFormPage.verifyWordCountMessage("You have 1 word too many");

    // Verify form cannot be submitted with too many words
    // Try to submit and verify we stay on the same page
    tbCertificateNotIssuedFormPage.clickContinue();

    // Should still be on the same page due to validation error
    cy.url().should("include", "/why-are-you-not-issuing-certificate");

    // Verify error message is still displayed
    tbCertificateNotIssuedFormPage.verifyWordCountMessage("You have 1 word too many");

    // Clear the field and verify word count resets
    tbCertificateNotIssuedFormPage.clearPhysicianComments();
    tbCertificateNotIssuedFormPage.verifyWordCountMessage("You have 150 words remaining");

    // Now fill with valid data to ensure form works with correct word count
    const validPhysicianComments =
      "Patient unable to complete screening today due to scheduling conflicts.";
    tbCertificateNotIssuedFormPage.fillPhysicianComments(validPhysicianComments);

    // Verify word count updates correctly (should show remaining words)
    cy.get('textarea[name="comments"]')
      .closest("div")
      .should("contain.text", "You have")
      .and("contain.text", "words remaining");

    // Complete the form with valid data
    tbCertificateNotIssuedFormPage.selectReasonNotIssued("Testing postponed");
    tbCertificateNotIssuedFormPage.fillDeclaringPhysicianName("Dr. Sarah Jones");

    // Submit the form with valid data
    tbCertificateNotIssuedFormPage.clickContinue();

    // Verify successful submission - should redirect to summary page
    cy.url().should("include", "/tb-certificate-summary");
    tbCertificateSummaryPage.verifyPageLoaded();

    // Log test completion
    cy.log("Word count validation test completed successfully");
  });
});
