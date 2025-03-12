import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../../support/test-utils";

// Error message for missing town/city
const errorMessage = "Enter town or city.";

describe.skip("Validate the error message is displayed when town/city is not entered", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("Should display an error message when town/city is not entered", () => {
    travelInformationPage.selectVisaType(randomElement(visaType));

    // Enter Address Information (skipping town/city)
    travelInformationPage.fillAddressLine1("Flat 2, 26 Monmouth St.");
    travelInformationPage.fillAddressLine2("Bath");
    travelInformationPage.fillPostcode("BA1");
    travelInformationPage.fillMobileNumber("07123402876");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    travelInformationPage.submitForm();
    travelInformationPage.validateErrorSummaryVisible();
    travelInformationPage.validateErrorMessage(errorMessage);
    travelInformationPage.validateTownOrCityError();
  });
});
