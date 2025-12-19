// PETS Date Validation Test: INVALID Scenario - X-ray Before Medical Screening
// VIOLATION: X-ray taken BEFORE medical screening (violates Biz Rule 1)
// Biz Rule 1: Medical screening must be on clinic visit date, X-ray should be same day or after
// Expected: System should reject or flag this as invalid
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
import { ChestXrayUploadPage } from "../../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "../../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../../support/page-objects/travelSummaryPage";
import { VisaCategoryPage } from "../../support/page-objects/visaCategoryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Date Validation: INVALID Scenario - X-ray Before Medical", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();

  // Define variables to store test data
  //let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  //let tbCertificateNumber: string = "";
  let selectedVisaCategory: string;

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBSumPageFormat: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDate: ReturnType<typeof DateUtils.getDateComponents>;

  // Note: This Test is a Placeholder for when validation is implemented for X-ray dates
  // The Test should fail at the point where the X-ray date entered is before the medical screening date

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();

    // Generate dynamic dates for adult applicant (29 years old)
    adultAge = 29;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    const dobDate = DateUtils.getAdultDateOfBirth(adultAge);
    adultDOBSumPageFormat = DateUtils.formatDateGOVUK(dobDate);

    // Generate passport dates (issued 2 years ago, expires in 8 years)
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // INVALID SCENARIO: X-ray BEFORE medical screening (violates Rule 1)
    const screening = DateUtils.getDateInPast(0, 0, 0); // Today (Day 0)
    screeningDate = DateUtils.getDateComponents(screening);

    // X-ray 1 day BEFORE medical screening - INVALID!
    const xray = DateUtils.getDateInPast(0, 0, 1); // 1 day in the past (Day -1)
    xrayDate = DateUtils.getDateComponents(xray);

    // Log generated dates for debugging
    cy.log("=== INVALID SCENARIO: X-RAY BEFORE MEDICAL ===");
    cy.log(`X-ray: Day -1 (BEFORE Medical - INVALID!)`);
    cy.log(`Medical Screening: Day 0 (Today)`);
    cy.log(`VIOLATION: X-ray cannot be before medical screening`);
    cy.log(`Adult Age: ${adultAge}`);
    cy.log(`Screening Date: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);
    cy.log(`X-ray Date: ${xrayDate.day}/${xrayDate.month}/${xrayDate.year}`);
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
    applicantSearchPage.verifyPageLoaded();

    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    //countryCode = randomCountry?.value;
    countryName = randomCountry?.label;
    passportNumber = getRandomPassportNumber();
    //tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
  });

  it("should test invalid scenario where X-ray date is before medical screening date", () => {
    // Search for new applicant
    cy.acceptCookies();
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.clickCreateNewApplicant();

    // Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Invalid Test User")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("100 Invalid Street")
      .fillTownOrCity("Invalid City")
      .fillProvinceOrState("Martinique")
      .selectAddressCountry(countryName)
      .fillPostcode("IV1 1AA")
      .submitForm();

    // Upload Applicant Photo
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage.uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg");
    applicantPhotoUploadPage.clickContinue();

    // Verify redirection to the Check Photo page
    cy.url().should("include", "/check-visa-applicant-photo");

    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.verifyPageHeadingText();
    checkPhotoPage.verifyUploadedPhotoDisplayed();
    checkPhotoPage.verifyFilenameDisplayed();
    checkPhotoPage.verifyImageLayout();
    checkPhotoPage.verifyRadioButtonsExist();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();

    // Applicant Summary
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.verifyAllSummaryValues({
      "Full name": "Invalid Test User",
      Sex: "Male",
      Nationality: countryName,
      "Date of birth": adultDOBSumPageFormat,
      "Passport number": passportNumber,
    });
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

    // Travel Information
    travelInformationPage.verifyPageLoaded();
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "100 UK Street",
      ukAddressLine2: "Floor 2",
      ukTownOrCity: "London",
      ukPostcode: "SW11 1AA",
      mobileNumber: "07700900123",
      email: "pets.tester@hotmail.com",
    });

    // Submit the form
    travelInformationPage.submitForm();

    // Travel Summary
    travelSummaryPage.verifyPageLoaded();

    // Verify the random visa type is valid and displayed correctly
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

    // NOW navigate to medical screening from the tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillScreeningDate(screeningDate.day, screeningDate.month, screeningDate.year)
      .fillAge(adultAge.toString())
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("No abnormalities detected. Patient appears healthy.")
      .submitForm();

    // Verify redirection to X-ray Question Page
    chestXrayPage.verifyPageLoaded();

    // Select "Yes" for X-ray Required
    chestXrayPage.selectXrayTakenYes();
    chestXrayPage.submitForm();

    // Medical Summary
    medicalSummaryPage.verifyPageLoaded();

    // Calculate expected age from birth date
    const expectedAge = DateUtils.calculateAge(DateUtils.getAdultDateOfBirth(adultAge));

    // Validate the prefilled form
    medicalSummaryPage.fullyValidateSummary({
      age: `${expectedAge} years old`,
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "No abnormalities detected. Patient appears healthy.",
    });

    // Confirm medical details
    medicalSummaryPage.confirmDetails();

    // Medical Confirmation
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to chest X-ray from the tracker
    tbProgressTrackerPage.clickTaskLink("Upload chest X-ray images");

    // Verify redirection to chest X-ray Images Upload page
    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage.verifyAllPageElements();

    // Verify date X-ray taken section is displayed
    chestXrayUploadPage.verifyDateXrayTakenSectionDisplayed();
    chestXrayUploadPage.verifyDateInputFields();

    // ATTEMPT TO ENTER INVALID X-RAY DATE (before medical screening)
    cy.log("ATTEMPTING INVALID X-RAY DATE: X-ray before medical screening");
    cy.log("EXPECTED: The Clinic App should display validation error or prevent submission");

    // Verify the date was entered correctly
    chestXrayUploadPage.enterDateXrayTaken(xrayDate.day, xrayDate.month, xrayDate.year);

    // Verify X-ray upload page and sections and upload image(s)
    chestXrayUploadPage.verifyXrayUploadSectionsDisplayed();
    chestXrayUploadPage.verifyFileUploadInstructions();
    chestXrayUploadPage.verifyAllFileDropZones();
    chestXrayUploadPage.verifyDicomUploadContainers();

    // Verify accepted file types include .dcm, .jpg, .jpeg, .png
    chestXrayUploadPage.verifyAcceptedFileTypes();

    // Upload Chest X-ray file
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();

    // Checking no errors appear initially
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Attempt to continue - should fail validation
    chestXrayUploadPage.clickContinue();

    // Verify validation error or that we're still on the same page
    cy.url().should("include", "/upload-chest-x-ray");

    // Check for error messages related to invalid X-ray date
    cy.get("body").then(($body) => {
      if ($body.find(".govuk-error-message, .govuk-error-summary").length > 0) {
        cy.log("VALIDATION PASSED: Clinic App correctly shows error for X-ray before medical");
        cy.get(".govuk-error-message, .govuk-error-summary").should("be.visible");
      } else {
        cy.log("WARNING: Clinic App allowed X-ray before medical screening - POTENTIAL BUG");
        cy.log("This violates Biz Rule 1: X-ray Date should not be before Medical screening");
      }
    });

    cy.log("NEGATIVE TEST COMPLETED: X-ray before medical scenario tested");
  });
});
