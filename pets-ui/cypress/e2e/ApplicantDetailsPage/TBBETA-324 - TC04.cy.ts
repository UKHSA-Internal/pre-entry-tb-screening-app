import { countryList } from "../../../src/utils/countryList";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { randomElement } from "../../support/test-utils";

const applicantDetailsPage = new ApplicantDetailsPage();

// Random country selection
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

// Define the expected error messages
const expectedErrorMessages = [
  "Full name must contain only letters and spaces.",
  "Passport number must contain only letters and numbers.",
  "Home address must contain only letters, numbers, spaces and punctuation.",
  "Town name must contain only letters, spaces and punctuation.",
  "Province/state name must contain only letters, spaces and punctuation",
];

// URL fragments for each field with errors
const urlFragments = [
  "#name",
  "#passport-number",
  "#address-1",
  "#address-2",
  "#address-3",
  "#town-or-city",
  "#province-or-state",
];

describe("Validate the error messages for the Free Text Boxes", () => {
  beforeEach(() => {
    applicantDetailsPage.visit();
    applicantDetailsPage.interceptFormSubmission();
    applicantDetailsPage.verifyPageLoaded();
  });

  it("Should change error messages when incorrect format is used", () => {
    applicantDetailsPage.fillFullName("J)hn D*e");
    applicantDetailsPage.selectSex("Male");
    applicantDetailsPage.fillBirthDate("4", "JAN", "1998");
    applicantDetailsPage.fillPassportNumber("AA123546+7");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);
    applicantDetailsPage.fillPassportIssueDate("20", "11", "2031");
    applicantDetailsPage.fillPassportExpiryDate("19", "11", "2011");
    applicantDetailsPage.fillAddressLine1("123 @ Main St");
    applicantDetailsPage.fillAddressLine2("Apt 4B!!");
    applicantDetailsPage.fillAddressLine3("West_Lane");
    applicantDetailsPage.fillTownOrCity("22 Springfield");
    applicantDetailsPage.fillProvinceOrState("IL67");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("S4R 0M6");

    // Submit the form
    applicantDetailsPage.submitForm();

    // Validate the error summary is visible and contains expected errors
    applicantDetailsPage.validateErrorSummary(expectedErrorMessages);

    // Check that clicking error links navigates to the correct fields
    cy.get(".govuk-error-summary a").each(($link, index) => {
      // Check links correspond to the respective error messages
      if (index < urlFragments.length) {
        cy.wrap($link).click();
        cy.url().should("include", urlFragments[index]);
      }
    });
  });
});
