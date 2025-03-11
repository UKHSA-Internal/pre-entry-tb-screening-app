import { countryList } from "../../src/utils/countryList";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { MedicalSummaryPage } from "../support/page-objects/mdecialSummaryPage";
import { getRandomPassportNumber, randomElement } from "../support/test-utils";
import { ApplicantDetailsPage } from "./../support/page-objects/applicantDetailsPage";
import { MedicalScreeningPage } from "./../support/page-objects/medicalScreeningPage";
import { TravelConfirmationPage } from "./../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "./../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "./../support/page-objects/travelSummaryPage";

describe("Visa Application End-to-End Tests", () => {
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
  const visaType = "Students";

  // Define variables to store test data
  let countryName: string;
  let passportNumber: string;

  before(() => {
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.value;
    passportNumber = getRandomPassportNumber();

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
  });

  it("should complete the full application process with search and create new", () => {
    //Search for an applicant
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    applicantSearchPage.fillPassportNumber(passportNumber);
    applicantSearchPage.selectCountryOfIssue(countryName);
    applicantSearchPage.submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage();
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();
    applicantDetailsPage.interceptFormSubmission();

    // Passport number and country should already be prefilled
    applicantDetailsPage.fillFullName("Jane Smith");
    applicantDetailsPage.selectSex("Female");
    applicantDetailsPage.selectNationality(countryName);

    // Fill birth date
    applicantDetailsPage.fillBirthDate("15", "03", "1990");

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
    applicantSummaryPage.verifySummaryValue("Country of Issue", countryName);

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
    travelInformationPage.fillEmail("pets.tester@ukhsa.gov.uk");

    // Submit form
    travelInformationPage.submitForm();

    // Review Travel Summary
    travelSummaryPage.verifyPageLoaded();

    // Verify details by clicking change links and checking fields
    travelSummaryPage.clickChangeLink("Visa type");
    travelSummaryPage.verifyFieldValueOnChangePage("Visa type", visaType);

    travelSummaryPage.clickChangeLink("UK Address Line 1");
    travelSummaryPage.verifyFieldValueOnChangePage("UK Address Line 1", "456 Park Lane");

    travelSummaryPage.clickChangeLink("UK Town or City");
    travelSummaryPage.verifyFieldValueOnChangePage("UK Town or City", "Manchester");

    travelSummaryPage.clickChangeLink("UK Mobile Number");
    travelSummaryPage.verifyFieldValueOnChangePage("UK Mobile Number", "07700900123");

    // Submit the summary form
    travelSummaryPage.submitForm();

    // Travel Confirmation confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.submitForm();

    // Medical Screening Page
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage.fillAge("33");

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
      age: "33",
      tbSymptoms: "No",
      previousTb: "No",
      closeContactWithTb: "No",
      pregnant: "No",
      menstrualPeriods: "No",
      physicalExamNotes: "No abnormalities detected. Patient appears healthy.",
    });
  });
});
