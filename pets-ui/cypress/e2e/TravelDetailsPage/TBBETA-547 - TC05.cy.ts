import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../../support/test-utils";

// Error message for missing postcode
const errorMessage = "Enter full UK postcode";

describe.skip("Validate the error message is displayed when postcode is NOT entered", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("Should display an error message for missing postcode", () => {
    travelInformationPage.selectVisaType(randomElement(visaType));

    // Enter VALID Address Information (skipping postcode)
    travelInformationPage.fillAddressLine1("Flat 2, 26 Monmouth St.");
    travelInformationPage.fillAddressLine2("Bath");
    travelInformationPage.fillTownOrCity("Somerset");

    travelInformationPage.fillMobileNumber("07123402876");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    travelInformationPage.submitForm();

    travelInformationPage.validateErrorSummaryVisible();
    travelInformationPage.validateErrorMessage(errorMessage);

    // Validate the postcode field error is displayed
    travelInformationPage.validatePostcodeError();
  });
});
