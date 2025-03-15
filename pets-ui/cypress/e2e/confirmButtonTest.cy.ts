import { TravelInformationPage } from "../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../support/page-objects/travelSummaryPage";
import { randomElement, visaType } from "../support/test-utils";

describe.skip("Validate that the confirm button on the travel information page redirects to the Enter Travel Information Page", () => {
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();

  before(() => {
    void cy.clearAllSessions();
  });

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("should redirect user to travel confirmation url", () => {
    // Select a Visa Type
    travelInformationPage.selectVisaType(randomElement(visaType));

    // Enter VALID Address Information
    travelInformationPage.fillAddressLine1("17 Exmoor Rd.");
    travelInformationPage.fillAddressLine2("Southampton");
    travelInformationPage.fillTownOrCity("Hampshire");
    travelInformationPage.fillPostcode("SO14 0AR");
    travelInformationPage.fillMobileNumber("00447811123456");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    travelInformationPage.submitForm();
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.submitForm();
    travelSummaryPage.verifyRedirectionToConfirmationPage();
  });
});
