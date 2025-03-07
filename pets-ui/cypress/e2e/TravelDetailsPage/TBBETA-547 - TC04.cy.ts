import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../../support/test-utils";

const emailErrorMessage = "Email must be in correct format.";

describe("Validate the error message is displayed when incorrect data is entered in Applicant's UK email field", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    // Visit the travel information page
    travelInformationPage.visit();

    // Intercept form submission
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display an error message", () => {
    // Select a Visa Type
    travelInformationPage.selectVisaType(randomElement(visaType));

    // Enter VALID Address Information
    travelInformationPage.fillAddressLine1("Flat 2, 26 Monmouth St.");
    travelInformationPage.fillAddressLine2("Bath");
    travelInformationPage.fillTownOrCity("Somerset");
    travelInformationPage.fillPostcode("BA1 0AP");
    travelInformationPage.fillMobileNumber("00447123402876");

    // Enter INVALID email
    travelInformationPage.fillEmail("@aiq.ukhsa.gov.uk");

    // Submit the form
    travelInformationPage.submitForm();

    // Validate the error summary
    travelInformationPage.validateErrorSummaryVisible();

    // Validate email error message
    travelInformationPage.validateErrorMessage(emailErrorMessage);
  });
});
