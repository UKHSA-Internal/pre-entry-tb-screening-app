// Sign Out Functionality Test
import { loginViaB2C } from "../../support/commands";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { SignOutConfirmationPage } from "../../support/page-objects/signOutConfirmationPage";
import { SignOutPage } from "../../support/page-objects/signOutPage";

describe("Sign Out Functionality Tests", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const signOutPage = new SignOutPage();
  const signOutConfirmationPage = new SignOutConfirmationPage();

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
  });

  it("should successfully sign out from the application", () => {
    // Accept cookies if banner appears
    cy.acceptCookies();

    // Verify we're on the applicant search page
    applicantSearchPage.verifyPageLoaded();
    applicantSearchPage.verifyPageHeader();

    // Click the sign out link in the header
    cy.get("#sign-out").should("be.visible").click();

    // Wait for navigation by checking URL has changed
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);

    // Check if we're on the dialog page or if we went straight to B2C
    cy.url({ timeout: 10000 }).then((url) => {
      if (url.includes("/are-you-sure-you-want-to-sign-out")) {
        // We're on the dialog page - verify and proceed normally
        cy.log("On sign-out dialog page");

        signOutPage.verifyPageLoaded();
        signOutPage.verifyNotificationBanner();
        signOutPage.verifyWarningMessage();
        signOutPage.verifyBothButtons();

        // Click the sign out button to confirm
        cy.get('button[type="submit"].govuk-button--warning')
          .should("be.visible")
          .should("contain", "Sign out")
          .click({ force: true });

        // Handle Azure B2C account picker
        cy.origin("https://petsb2cdev.ciamlogin.com", () => {
          cy.log("Inside B2C account picker page");
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(2000);

          cy.contains("Pick an account", { timeout: 15000 }).should("be.visible");
          cy.contains("Which account do you want to sign out of?", { timeout: 10000 }).should(
            "be.visible",
          );

          cy.get('div[data-test-id*="tile"], div.table-cell, div[role="link"]', {
            timeout: 10000,
          })
            .first()
            .should("be.visible")
            .click({ force: true });

          cy.log("Selected account to sign out");
        });

        //cy.wait(3000);
      } else if (url.includes("petsb2cdev.ciamlogin.com")) {
        // We went straight to B2C - handle it directly
        cy.log("Went straight to B2C account picker");

        cy.origin("https://petsb2cdev.ciamlogin.com", () => {
          cy.log("Inside B2C account picker page");
          //cy.wait(2000);

          cy.contains("Pick an account", { timeout: 15000 }).should("be.visible");
          cy.contains("Which account do you want to sign out of?", { timeout: 10000 }).should(
            "be.visible",
          );

          cy.get('div[data-test-id*="tile"], div.table-cell, div[role="link"]', {
            timeout: 10000,
          })
            .first()
            .should("be.visible")
            .click({ force: true });

          cy.log("Selected account to sign out");
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000);
      }
    });

    // Verify the URL is the sign out confirmation page
    cy.url({ timeout: 20000 }).should("include", "/you-have-signed-out");

    // Verify we're on the sign out confirmation page
    signOutConfirmationPage.verifyPageLoaded();
    signOutConfirmationPage.verifyMainHeading();
    signOutConfirmationPage.verifyPageTitle();
    signOutConfirmationPage.verifySignInLink();
    signOutConfirmationPage.verifyFeedbackSurveyLink();
  });
});
