import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../../support/test-utils";

// Error message for missing phone number
const errorMessage = "Enter UK mobile number.";

describe.skip("Validate the error message is displayed when Applicant's UK phone number field is empty", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("Should display an error message when telephone number field is empty", () => {
    travelInformationPage.selectVisaType(randomElement(visaType));
    travelInformationPage.fillAddressLine1("Flat 2, 26 Monmouth St.");
    travelInformationPage.fillAddressLine2("Bath");
    travelInformationPage.fillTownOrCity("Somerset");
    travelInformationPage.fillPostcode("BA1 0AP");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    travelInformationPage.submitForm();
    travelInformationPage.validateErrorSummaryVisible();
    travelInformationPage.validateErrorMessage(errorMessage);
  });
});
