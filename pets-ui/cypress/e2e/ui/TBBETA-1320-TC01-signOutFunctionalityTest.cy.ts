// Sign Out Functionality Test
import { loginViaB2C } from "../../support/commands";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { SignOutPage } from "../../support/page-objects/signOutPage";

describe("Sign Out Functionality Tests", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const signOutPage = new SignOutPage();

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
  });

  it("should successfully sign out from the application", () => {
    // Verify we're on the applicant search page
    cy.acceptCookies();
    applicantSearchPage.verifyPageLoaded();
    applicantSearchPage.verifyPageHeader();

    // Click the sign out link in the header
    cy.get("#sign-out").should("be.visible").click();

    // Verify we're redirected to the sign out page
    signOutPage.verifyPageLoaded();

    // Verify all page elements are present
    signOutPage.verifyNotificationBanner();

    // Verify the warning message is displayed
    signOutPage.verifyWarningMessage();

    // Click the sign out button to confirm sign out
    signOutPage.clickSignOutButton();
  });
});
