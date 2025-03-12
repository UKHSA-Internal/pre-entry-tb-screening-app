import { countryList } from "../../../src/utils/countryList";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { randomElement } from "../../support/test-utils";

const applicantDetailsPage = new ApplicantDetailsPage();

// Random country selection
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

// Define Date Field error messages
const dateFieldErrorMessages: string[] = [
  "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month.",
  "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
  "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month.",
];

describe.skip("Validate error messages for Applicant Details Date Fields", () => {
  beforeEach(() => {
    applicantDetailsPage.visit();
    applicantDetailsPage.verifyPageLoaded();
  });

  it.skip("Fill out the application date fields with invalid characters", () => {
    // Fill out form with valid data except date fields
    applicantDetailsPage.fillFullName("John Doe");
    applicantDetailsPage.selectSex("Male");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);

    // Enter INVALID data for date fields
    cy.get("input#birth-date-day").type("4");
    cy.get("input#birth-date-month").type("JAN");
    cy.get("input#birth-date-year").type("19/8");

    applicantDetailsPage.fillPassportNumber("AA1235467");

    cy.get("input#passport-issue-date-day").type("2o");
    cy.get("input#passport-issue-date-month").type("10");
    cy.get("input#passport-issue-date-year").type("20&1");

    cy.get("input#passport-expiry-date-day").type("10");
    cy.get("input#passport-expiry-date-month").type("10");
    cy.get("input#passport-expiry-date-year").type("20$1");

    // Fill address details
    applicantDetailsPage.fillAddressLine1("1322");
    applicantDetailsPage.fillAddressLine2("100th St");
    applicantDetailsPage.fillAddressLine3("Apt 16");
    applicantDetailsPage.fillTownOrCity("North Battleford");
    applicantDetailsPage.fillProvinceOrState("Saskatchewan");
    applicantDetailsPage.selectAddressCountry("CAN");
    applicantDetailsPage.fillPostcode("S4R 0M6");

    // Submit form and validate errors
    applicantDetailsPage.submitForm();
    applicantDetailsPage.validateErrorSummary(dateFieldErrorMessages);
  });
});
