import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../../support/test-utils";

const errorMessage = "Enter address line 1, typically the building and street.";

describe("Validate the error message is displayed when address field does not have a value", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    travelInformationPage.visit();
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display an error message when the address line 1 field is empty", () => {
    travelInformationPage.selectVisaType(randomElement(visaType));

    // Skip Address Line 1 (leaving it empty)

    // Enter other address information
    travelInformationPage.fillAddressLine2("Anlaby");
    travelInformationPage.fillTownOrCity("Hull");
    travelInformationPage.fillPostcode("HU10 6UH");
    travelInformationPage.fillMobileNumber("07923402876");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    travelInformationPage.submitForm();
    travelInformationPage.validateErrorSummaryVisible();
    travelInformationPage.validateErrorMessage(errorMessage);

    // Validate the address line 1 error message
    travelInformationPage.validateAddressLine1Error();
  });
});
