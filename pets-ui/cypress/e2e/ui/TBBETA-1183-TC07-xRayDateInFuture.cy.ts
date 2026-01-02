// PETS Date Validation Test: INVALID - X-ray Date in the Future
// VALIDATION: X-ray date cannot be in the future
// Expected Error: "The date the X-ray was taken must be the same as or after the medical screening"
// (or appropriate future date error message)
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

describe("PETS Date Validation: INVALID - X-ray Date in Future", () => {
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const chestXrayPage = new ChestXrayPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();

  let countryName: string = "";
  let passportNumber: string = "";
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let futureXrayDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    createTestFixtures();
    adultAge = 37;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);

    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    const screening = DateUtils.getDateInPast(0, 0, 3); // 3 days ago
    screeningDate = DateUtils.getDateComponents(screening);

    // INVALID: X-ray in the future
    const futureXray = DateUtils.getDateInFuture(0, 0, 2); // 2 days in future
    futureXrayDate = DateUtils.getDateComponents(futureXray);

    cy.log("=== INVALID SCENARIO: X-RAY DATE IN FUTURE ===");
    cy.log(`Medical Screening: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);
    cy.log(
      `X-ray: ${futureXrayDate.day}/${futureXrayDate.month}/${futureXrayDate.year} (IN FUTURE - INVALID!)`,
    );
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.label;
    passportNumber = getRandomPassportNumber();
  });

  it("should reject X-ray date that is in the future", () => {
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.clickCreateNewApplicant();
    applicantConsentPage.continueWithConsent("Yes");
    cy.acceptCookies();

    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Tricia Future Xray")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("555 Future Xray Street")
      .fillTownOrCity("Future City")
      .fillProvinceOrState("Future Province")
      .selectAddressCountry(countryName)
      .fillPostcode("FUT XR1")
      .submitForm();

    applicantPhotoUploadPage.uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg");
    applicantPhotoUploadPage.clickContinue();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();
    applicantSummaryPage.confirmDetails();
    applicantConfirmationPage.clickContinue();

    tbProgressTrackerPage.clickTaskLink("UK travel information");
    visaCategoryPage.selectRandomVisaCategory();
    visaCategoryPage.clickContinue();

    // NOW verify the travel information page
    travelInformationPage.verifyPageLoaded();

    /// Fill travel information (NO visa type parameter needed)
    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "Flat 5, Future Xray Building",
      ukAddressLine2: "Future Xray Street",
      ukTownOrCity: "London",
      ukPostcode: "W1J 0AX",
      mobileNumber: "07700900123",
      email: "pets.tester@hotmail.com",
    });

    // Submit the form
    travelInformationPage.submitForm();

    // Review Travel Summary with random visa type
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
    medicalScreeningPage.fillMedicalScreeningDate(
      screeningDate.day,
      screeningDate.month,
      screeningDate.year,
    );
    medicalScreeningPage
      .selectTBSymptoms("No")
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

    // Verify redirection to Medical Screening Summary Page
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

    // Verify medical confirmation page and continue to TB Progress Tracker
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
    chestXrayUploadPage.verifyPageLoaded();

    // Enter INVALID future X-ray date
    cy.log("ATTEMPTING INVALID X-RAY DATE: Future date");
    chestXrayUploadPage.enterDateXrayTaken(
      futureXrayDate.day,
      futureXrayDate.month,
      futureXrayDate.year,
    );
    chestXrayUploadPage.uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm");
    chestXrayUploadPage.clickContinue();

    // Verify validation error
    cy.url().should("include", "/upload-chest-x-ray-images");
    cy.get(".govuk-error-summary")
      .should("be.visible")
      .and("contain.text", "The date the X-ray was taken must be today or in the past");
    cy.get(".govuk-error-message")
      .should("be.visible")
      .and("contain.text", "The date the X-ray was taken must be today or in the past");
  });
});
