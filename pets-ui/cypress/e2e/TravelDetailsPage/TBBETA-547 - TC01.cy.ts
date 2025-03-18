import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";

const visaTypeErrorMessage = "Select a visa type";

describe.skip("Validate the error message is displayed when Visa type is NOT selected", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    // Visit the travel information page
    travelInformationPage.visit();
  });

  it.skip("Should display an error message when visa type is not selected", () => {
    travelInformationPage.fillAddressLine1("61 Legard Drive");
    travelInformationPage.fillAddressLine2("Anlaby");
    travelInformationPage.fillTownOrCity("Hull");
    travelInformationPage.fillPostcode("HU10 6UH");
    travelInformationPage.fillMobileNumber("07123402876");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    travelInformationPage.submitForm();
    travelInformationPage.validateErrorSummaryVisible();
    travelInformationPage.validateErrorMessage(visaTypeErrorMessage);
    travelInformationPage.validateVisaTypeError();
  });
});
