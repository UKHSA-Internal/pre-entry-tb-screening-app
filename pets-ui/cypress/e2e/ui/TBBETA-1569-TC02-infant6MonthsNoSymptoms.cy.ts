//PETS Scenario: Infant (6 months) - No Symptoms, No History, No Contact, No X-ray uploaded, Yes Sputum Required - TB Certificate Issued (6 months)
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckSputumSampleInfoPage } from "../../support/page-objects/checkSputumSampleInfoPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import { ChestXrayNotTakenPage } from "../../support/page-objects/chestXrayNotTakenPage";
import { ChestXrayPage } from "../../support/page-objects/chestXrayQuestionPage";
import { ClinicCertificateInfoPage } from "../../support/page-objects/clinicCertificateInfoPage";
import { EnterSputumSampleResultsPage } from "../../support/page-objects/enterSputumSampleResultsPage";
import { MedicalConfirmationPage } from "../../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../../support/page-objects/medicalSummaryPage";
import { SputumCollectionPage } from "../../support/page-objects/sputumCollectionPage";
import { SputumConfirmationPage } from "../../support/page-objects/sputumConfirmationPage";
import { SputumDecisionConfirmationPage } from "../../support/page-objects/sputumDecisionConfirmationPage";
import { SputumDecisionInfoPage } from "../../support/page-objects/sputumDecisionInfoPage";
import { SputumQuestionPage } from "../../support/page-objects/sputumQuestionPage";
import { TbCertificateQuestionPage } from "../../support/page-objects/tbCertificateQuestionPage";
import { TbCertificateSummaryPage } from "../../support/page-objects/tbCertificateSummaryPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { TbScreeningCompletePage } from "../../support/page-objects/tbScreeningCompletePage";
import { TravelConfirmationPage } from "../../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../../support/page-objects/travelSummaryPage";
import { VisaCategoryPage } from "../../support/page-objects/visaCategoryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Scenario: Newborn Infant (1 month old) with No Symptoms, No X-ray, Sputum Required, Certificate Issued (6 months)", () => {
  // Page object instances
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
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
  const sputumDecisionConfirmationPage = new SputumDecisionConfirmationPage();
  const sputumDecisionInfoPage = new SputumDecisionInfoPage();
  const sputumQuestionPage = new SputumQuestionPage();
  const sputumCollectionPage = new SputumCollectionPage();
  const sputumConfirmationPage = new SputumConfirmationPage();
  const checkSputumSampleInfoPage = new CheckSputumSampleInfoPage();
  const enterSputumSampleResultsPage = new EnterSputumSampleResultsPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayNotTakenPage = new ChestXrayNotTakenPage();
  const clinicCertificateInfoPage = new ClinicCertificateInfoPage();
  const tbCertificateQuestionPage = new TbCertificateQuestionPage();
  const tbCertificateSummaryPage = new TbCertificateSummaryPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const tbScreeningCompletePage = new TbScreeningCompletePage();
  const visaCategoryPage = new VisaCategoryPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";
  let selectedVisaCategory: string;

  // Date-related variables for NEWBORN INFANT
  let infantAgeInMonths: number;
  let infantDOB: { day: string; month: string; year: string };
  let infantDOBFormatted: string;
  let passportIssueDate: { day: string; month: string; year: string };
  let passportExpiryDate: { day: string; month: string; year: string };
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample1Date: { day: string; month: string; year: string };
  let sputumSample1DateFormatted: string;
  let sputumSample2Date: { day: string; month: string; year: string };
  let sputumSample2DateFormatted: string;
  let sputumSample3Date: { day: string; month: string; year: string };
  let sputumSample3DateFormatted: string;

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
    countryCode = randomCountry?.value;
    countryName = randomCountry?.label;
    passportNumber = getRandomPassportNumber();
    tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
    cy.log(`Using TB certificate number: ${tbCertificateNumber}`);

    // Generate ALL test-friendly dates for 1-month-old newborn
    const testDates = DateUtils.getInfantApplicantTestDates(1);

    infantAgeInMonths = testDates.infantAgeInMonths;
    infantDOB = testDates.birthDate;
    infantDOBFormatted = testDates.birthDateFormatted;
    passportIssueDate = testDates.passportIssueDate;
    passportExpiryDate = testDates.passportExpiryDate;
    screeningDate = testDates.screeningDate;
    sputumSample1Date = testDates.sputumSample1Date;
    sputumSample1DateFormatted = testDates.sputumSample1DateFormatted;
    sputumSample2Date = testDates.sputumSample2Date;
    sputumSample2DateFormatted = testDates.sputumSample2DateFormatted;
    sputumSample3Date = testDates.sputumSample3Date;
    sputumSample3DateFormatted = testDates.sputumSample3DateFormatted;

    // Log generated dates for debugging
    cy.log(`Newborn Age: ${infantAgeInMonths} month`);
    cy.log(`Newborn DOB: ${infantDOB.day}/${infantDOB.month}/${infantDOB.year}`);
    cy.log(`DOB Formatted: ${infantDOBFormatted}`);
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year}`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
    cy.log(`Screening Date: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);
  });

  it("should complete the full application process for 6-month-old infant with no symptoms, no X-ray, sputum required, and issue certificate with 6 month expiry", () => {
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

    // Verify redirection to applicant search page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details for Newborn Infant (6 month old)
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details for 6-month-old baby
    applicantDetailsPage
      .fillFullName("Baby Emma Johnson")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate(infantDOB.day, infantDOB.month, infantDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("123 Infant Care Lane")
      .fillAddressLine2("Maternity Ward B")
      .fillAddressLine3("New Born Baby")
      .fillTownOrCity("Libraville")
      .fillProvinceOrState("Dahoume")
      .selectAddressCountry(countryName)
      .fillPostcode("56109");

    // Submit form
    applicantDetailsPage.submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url({ timeout: 15000 }).should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file (newborn photo)
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/child-passport-photo.jpg")
      .verifyUploadSuccess();

    //Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Continue to Applicant Summary page
    applicantPhotoUploadPage.clickContinue();
    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });
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
    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/check-visa-applicant-details");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Full name", "Baby Emma Johnson");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);
    applicantSummaryPage.verifySummaryValue("Nationality", countryName);
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

    // Fill in travel information
    travelInformationPage.verifyPageLoaded();
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "789 Family Road",
      ukAddressLine2: "Apartment 2C",
      ukTownOrCity: "Bristol",
      ukPostcode: "BS1 4CC",
      mobileNumber: "07700900789",
      email: "pets.tester2@hotmail.com",
    });

    // Submit the form
    travelInformationPage.submitForm();

    // Verify redirection to Travel Summary page
    travelSummaryPage.verifyPageLoaded();
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

    // Verify travel confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.verifyConfirmationPanel();
    travelConfirmationPage.clickContinue();

    // Verify we're back on tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Navigate to medical screening from the tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Verify medical screening page loaded
    medicalScreeningPage.verifyPageLoaded();

    // Fill medical screening form for newborn (no symptoms)
    medicalScreeningPage
      .fillScreeningDate(screeningDate.day, screeningDate.month, screeningDate.year)
      .fillAge(infantAgeInMonths.toString())
      .selectTbSymptoms("No") // No symptoms
      .selectChildTbHistory("None of these") // None of these for child TB history
      .selectPreviousTb("No") // No TB history
      .selectCloseContact("No") // No close contact
      .selectPregnancyStatus("No") // No for infant
      .selectMenstrualPeriods("No") // No for infant
      .fillPhysicalExamNotes(
        "Infant applicant 6 month old. No TB symptoms or history. No close contact with TB. Physical examination normal for age.",
      )
      .submitForm();

    // Verify redirection to X-ray Question Page
    chestXrayPage.verifyPageLoaded();

    // Select "No" for X-ray Required
    chestXrayPage.selectXrayTakenNo();
    chestXrayPage.submitForm();

    // Verify redirection to X-ray reason Page
    chestXrayNotTakenPage.selectReasonXrayNotTaken("Child");
    chestXrayNotTakenPage.submitForm();

    // Verify medical summary page
    medicalSummaryPage.verifyPageLoaded();

    // Calculate expected age from birth date
    const expectedAge = DateUtils.calculateAge(DateUtils.getChildDateOfBirth(infantAgeInMonths));

    // Get the screening date in GOV.UK format for validation
    const screening = DateUtils.getDateInPast(0, 1, 0); // Same as entered on line 305
    const expectedScreeningDate = DateUtils.formatDateGOVUK(screening);

    medicalSummaryPage.fullyValidateSummary({
      age: `${expectedAge} month old`,
      dateOfMedicalScreening: expectedScreeningDate,
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes:
        "Infant applicant 6 month old. No TB symptoms or history. No close contact with TB. Physical examination normal for age.",
      xrayRequired: "No",
      reasonXrayNotRequired: "Child (under 11 years)",
    });
    // Confirm medical details
    medicalSummaryPage.verifySubmissionConfirmationMessage();
    medicalSummaryPage.confirmDetails();

    // Verify medical confirmation page and continue to chest X-ray
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.verifyConfirmationPanel();
    medicalConfirmationPage.verifyNextStepsSection();
    medicalConfirmationPage.clickContinueButton();

    // Verify we're back at tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "Baby Emma Johnson",
      "Date of birth": infantDOBFormatted,
      "Passport number": passportNumber,
      "TB screening": "In progress",
    });

    tbProgressTrackerPage.verifyMultipleTaskStatuses({
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Not required",
      "Radiological outcome": "Not required",
      "Make a sputum decision": "Not yet started",
      "Sputum collection and results": "Cannot start yet",
      "TB certificate outcome": "Cannot start yet",
    });

    // Navigate to "Make a sputum decision" Page from the tracker
    tbProgressTrackerPage.clickTaskLink("Make a sputum decision");

    // Verify redirection to Sputum Collection Question Page
    sputumQuestionPage.verifyPageLoaded();
    //Select "Yes" for Sputum Collection
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();

    // Verify redirection to Sputum decision Info Page
    sputumDecisionInfoPage.verifyPageLoaded();
    sputumDecisionInfoPage.verifyAllPageElements();
    sputumDecisionInfoPage.clickSaveAndContinue();

    // Verify redirection to Sputum Decision Confirmation Page
    sputumDecisionConfirmationPage
      .verifyAllPageElements()
      .verifyConfirmationMessageContent()
      .clickContinueButton();

    // Verify applicant info on TB Progress Tracker Page
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.verifySectionHeadings();
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "Baby Emma Johnson",
      "Date of birth": infantDOBFormatted,
      "Passport number": passportNumber,
      "TB screening": "In progress",
    });

    // Navigate to "Sputum collection and results" Page from the tracker
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");

    // Verify sputum collection page is prefilled with data
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Fill sputum collection data for all three samples
    const sputumData = {
      sample1: {
        date: sputumSample1Date,
        collectionMethod: "Coughed up",
      },
      sample2: {
        date: sputumSample2Date,
        collectionMethod: "Induced",
      },
      sample3: {
        date: sputumSample3Date,
        collectionMethod: "Coughed up",
      },
    };

    sputumCollectionPage.fillAllSamples(sputumData);
    sputumCollectionPage.verifyFormFilledWith(sputumData);

    // Save and continue to results
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify redirection to Enter Sputum Sample Results page
    cy.url().should("include", "/sputum-results");

    // Enter sputum sample results page
    enterSputumSampleResultsPage.verifyPageLoaded();
    enterSputumSampleResultsPage.verifyAllPageElements();

    // Fill sputum sample results as negative
    enterSputumSampleResultsPage.fillWithAllNegativeResults();

    // Verify the form is filled correctly
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
        dateCollected: sputumSample1DateFormatted,
        collectionMethod: "Coughed up",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample2: {
        dateCollected: sputumSample2DateFormatted,
        collectionMethod: "Induced",
        smearResult: "Negative",
        cultureResult: "Negative",
      },
      sample3: {
        dateCollected: sputumSample3DateFormatted,
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
    sputumConfirmationPage.verifyConfirmationPanel();
    sputumConfirmationPage.verifyNextStepsSection();
    sputumConfirmationPage.verifyServiceName();
    sputumConfirmationPage.clickContinueButton();

    // Verify we're back at tracker with completed status
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.verifyMultipleTaskStatuses({
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Not required",
      "Radiological outcome": "Not required",
      "Make a sputum decision": "Completed",
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

    // Verify redirection to "Enter clinic and cert information" Page
    clinicCertificateInfoPage
      .verifyPageLoaded()
      .verifyCertificateExpiryDateCalculation()
      .verifyCertificateExpiryIs6MonthsFromIssueDate()
      .saveCertificateReferenceNumber()
      .completeForm(
        "Dr. Sarah Pediatrics",
        "Infant applicant aged 6 months. No TB symptoms, history, or close contact. All sputum samples negative. Certificate issued with 6-month validity as no close contact with active TB.",
      );

    // Verify redirection to TB Summary Page
    tbCertificateSummaryPage.verifyPageLoaded();

    // Verify all information
    tbCertificateSummaryPage
      .verifyAllVisaApplicantInformation()
      .verifyAllCurrentResidentialAddressFields()
      .verifyAllProposedUKAddressFields()
      .verifyAllClinicCertificateInfo()
      .verifyAllScreeningInformation();

    // Click the "Submit" button to submit the application
    tbCertificateSummaryPage.clickSubmitButton();

    // Verify redirection to TB Screening Completion Page
    tbScreeningCompletePage.verifyPageLoaded();

    // Verify TB Screening completion message and Cert Number
    tbScreeningCompletePage.completeWithRefValidation();

    // Verify all page elements with saved certificate reference validation
    tbScreeningCompletePage.verifyAllWithSavedRef();
  });
});
