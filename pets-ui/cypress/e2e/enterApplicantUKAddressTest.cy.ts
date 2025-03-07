import { TravelInformationPage } from "../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../support/test-utils";

const errorMessages = [
  "Town name must contain only letters, spaces and punctuation.",
  "Home address must contain only letters, numbers, spaces and punctuation.",
];
const urlFragment = ["#address-2", "#town-or-city"];

describe("Validate the error message for the Address Fields", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    travelInformationPage.visit();
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Fill out the applicant address field with INVALID characters", () => {
    // Select a Visa Type
    travelInformationPage.selectVisaType(randomElement(visaType));

    // Enter Address Information - some with invalid characters
    travelInformationPage.fillAddressLine1("17 Exmoor Rd.");
    travelInformationPage.fillAddressLine2("!Southampton!");
    travelInformationPage.fillTownOrCity("Hamp@shire");
    travelInformationPage.fillPostcode("SO14 0AR");
    travelInformationPage.fillMobileNumber("00447811123456");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Submit the form
    travelInformationPage.submitForm();

    travelInformationPage.validateErrorSummaryVisible();
    errorMessages.forEach((error) => {
      travelInformationPage.validateErrorMessage(error);
    });

    cy.get(".govuk-error-summary a").each((link, index) => {
      cy.wrap(link).click();
      cy.url().should("include", urlFragment[index]);
    });
  });
});
