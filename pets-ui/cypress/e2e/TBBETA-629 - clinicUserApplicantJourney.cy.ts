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
  const visaType = "Students";

  // Define variables to store test data
  let countryName: string;
  let passportNumber: string;

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.value;
    passportNumber = getRandomPassportNumber();

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
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

    cy.contains("button", "Continue").should("be.enabled").click();
    // Continue to X-ray findings page
    chestXrayUploadPage.clickContinue();
    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

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

    // Verify X-ray summary information - this is yet to be implemented hence commenting out
    /* chestXraySummaryPage.verifyXraySummaryInfo({
      "Select x-ray status": "Yes",
      "Enter radiological outcome": "Chest X-ray normal",
      "Enter radiographic findings": "1.1 Single fibrous streak or band or scar",
    }); */

    // Verify change links exist
    chestXraySummaryPage.verifyChangeLinksExist();

    // Save and continue to the next page
    chestXraySummaryPage.clickSaveAndContinue();

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
  });
});
