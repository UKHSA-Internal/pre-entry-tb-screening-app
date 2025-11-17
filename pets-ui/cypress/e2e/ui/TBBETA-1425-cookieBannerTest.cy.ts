/**
 * Cookie Banner Tests
 * Test suite covering all acceptance criteria for the cookie consent banner
 *
 * Requirements tested:
 * 1. Banner visibility on first visit (no consent recorded)
 * 2. Banner persistence across pages until action taken
 * 3. Accept analytics cookies functionality
 * 4. Reject analytics cookies functionality
 * 5. View cookies link navigation
 * 6. Change cookie settings link navigation
 * 7. Hide cookie message functionality
 * 8. Local storage consent verification
 */

import { CookieBannerPage } from "../../support/page-objects/cookieBannerPage";

describe("Cookie Banner - Acceptance Criteria Tests", () => {
  // Page object instance
  const cookieBannerPage = new CookieBannerPage();

  // Array of pages to test banner persistence
  const testPages = ["/", "/accessibility-statement", "/privacy-notice"];

  beforeEach(() => {
    // Ensure clean state before each test
    cookieBannerPage.clearCookieConsent();
  });

  describe("AC1: Banner Visibility on First Visit", () => {
    it('GIVEN I have signed into the Clinic application AND my user token shows I have not accepted or rejected the analytics cookies question THEN I see the "Cookies on Complete UK pre-entry health screening" banner at the top of the page', () => {
      // Arrange - Clear any existing consent
      cookieBannerPage.clearCookieConsent();

      // Act - Visit the application
      cy.visit("/");

      // Assert - Banner is visible with correct content
      cookieBannerPage.verifyCookieBannerIsVisible();
      cookieBannerPage.verifyCookieBannerHeading();
      cookieBannerPage.verifyCookieBannerContent();
      cookieBannerPage.verifyActionButtonsAreVisible();

      // Assert - No consent stored
      cookieBannerPage.verifyCookieConsentInStorage(null);
    });
  });

  describe("AC2: Banner Persistence Across Pages", () => {
    it("GIVEN I have not accepted or rejected cookies THEN the banner is visible at the top of every page I navigate to in the service", () => {
      // Arrange
      cookieBannerPage.clearCookieConsent();

      // Act & Assert - Banner persists across multiple pages
      testPages.forEach((page) => {
        cy.visit(page);
        cookieBannerPage.verifyCookieBannerIsVisible();
        cookieBannerPage.verifyCookieBannerHeading();
      });
    });

    it("should display banner on every page navigation until user takes action", () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.verifyCookieBannerIsVisible();

      // Act - Navigate to multiple pages
      cy.visit("/privacy-notice");

      // Assert - Banner still visible
      cookieBannerPage.verifyCookieBannerIsVisible();

      // Act - Navigate to another page
      cy.visit("/accessibility-statement");

      // Assert - Banner still visible
      cookieBannerPage.verifyCookieBannerIsVisible();
    });
  });

  describe("AC3: Accept Analytics Cookies", () => {
    it('GIVEN I see the "Cookies on Complete UK pre-entry health screening" banner WHEN I click Accept button THEN I see the acceptance message with correct elements', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.verifyCookieBannerIsVisible();

      // Act - Click Accept button
      cookieBannerPage.clickAcceptButton();

      // Assert - Confirmation message displayed
      cookieBannerPage.verifyAcceptanceMessage();

      // Assert - "Change your cookie settings" link is visible
      cookieBannerPage.verifyChangeSettingsLinkIsVisible();

      // Assert - "Hide cookie message" button is visible
      cookieBannerPage.verifyHideMessageButtonIsVisible();

      // Assert - Consent stored in local storage
      cookieBannerPage.verifyCookieConsentInStorage("accepted");
    });
  });

  describe("AC4: Reject Analytics Cookies", () => {
    it('GIVEN I see the "Cookies on Complete UK pre-entry health screening" banner WHEN I click Reject button THEN I see the rejection message with correct elements', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.verifyCookieBannerIsVisible();

      // Act - Click Reject button
      cookieBannerPage.clickRejectButton();

      // Assert - Confirmation message displayed
      cookieBannerPage.verifyRejectionMessage();

      // Assert - "Change your cookie settings" link is visible
      cookieBannerPage.verifyChangeSettingsLinkIsVisible();

      // Assert - "Hide cookie message" button is visible
      cookieBannerPage.verifyHideMessageButtonIsVisible();

      // Assert - Consent stored in local storage
      cookieBannerPage.verifyCookieConsentInStorage("rejected");
    });
  });

  describe("AC5: View Cookies Link Navigation", () => {
    it('GIVEN I see the "Cookies on Complete UK pre-entry health screening" banner WHEN I click the "View cookies" link THEN I am navigated to the cookies page', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.verifyCookieBannerIsVisible();

      // Act - Click View cookies link
      cookieBannerPage.clickViewCookiesLink();

      // Assert - Navigated to cookies page
      cy.url().should("include", "/cookies");
    });

    it("should maintain banner visibility after returning from cookies page without making a choice", () => {
      // Arrange
      cy.visit("/");

      // Act - Navigate to cookies page and back
      cookieBannerPage.clickViewCookiesLink();
      cy.url().should("include", "/cookies");
      cy.go("back");

      // Assert - Banner still visible
      cookieBannerPage.verifyCookieBannerIsVisible();
    });
  });

  describe("AC6: Change Cookie Settings Link", () => {
    it('GIVEN I see the acceptance message WHEN I click on the "Change your cookie settings" link THEN I am navigated to the cookies page', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickAcceptButton();
      cookieBannerPage.verifyAcceptanceMessage();

      // Act - Click Change settings link
      cookieBannerPage.clickChangeSettingsLink();

      // Assert - Navigated to cookies page
      cy.url().should("include", "/cookies");
    });

    it('GIVEN I see the rejection message WHEN I click on the "Change your cookie settings" link THEN I am navigated to the cookies page', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickRejectButton();
      cookieBannerPage.verifyRejectionMessage();

      // Act - Click Change settings link
      cookieBannerPage.clickChangeSettingsLink();

      // Assert - Navigated to cookies page
      cy.url().should("include", "/cookies");
    });
  });

  describe("AC7: Hide Cookie Message", () => {
    it('GIVEN I see the acceptance message WHEN I click the "Hide cookie message" button THEN the message no longer appears at the top of the page', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickAcceptButton();
      cookieBannerPage.verifyAcceptanceMessage();

      // Act - Click Hide message button
      cookieBannerPage.clickHideMessageButton();

      // Assert - Banner is no longer visible
      cookieBannerPage.verifyCookieBannerIsNotVisible();
    });

    it('GIVEN I see the rejection message WHEN I click the "Hide cookie message" button THEN the message no longer appears at the top of the page', () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickRejectButton();
      cookieBannerPage.verifyRejectionMessage();

      // Act - Click Hide message button
      cookieBannerPage.clickHideMessageButton();

      // Assert - Banner is no longer visible
      cookieBannerPage.verifyCookieBannerIsNotVisible();
    });

    it("should not show banner on page refresh after hiding acceptance message", () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickAcceptButton();
      cookieBannerPage.clickHideMessageButton();

      // Act - Refresh page
      cy.reload();

      // Assert - Banner should not appear
      cookieBannerPage.verifyCookieBannerIsNotVisible();
    });

    it("should not show banner on page refresh after hiding rejection message", () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickRejectButton();
      cookieBannerPage.clickHideMessageButton();

      // Act - Refresh page
      cy.reload();

      // Assert - Banner should not appear
      cookieBannerPage.verifyCookieBannerIsNotVisible();
    });
  });

  describe("Consent Persistence", () => {
    it("should remember accepted consent across page navigation", () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickAcceptButton();
      cookieBannerPage.clickHideMessageButton();

      // Act - Navigate to different pages
      testPages.forEach((page) => {
        cy.visit(page);
        // Assert - Banner should not appear
        cookieBannerPage.verifyCookieBannerIsNotVisible();
      });

      // Assert - Consent still stored
      cookieBannerPage.verifyCookieConsentInStorage("accepted");
    });

    it("should remember rejected consent across page navigation", () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickRejectButton();
      cookieBannerPage.clickHideMessageButton();

      // Act - Navigate to different pages
      testPages.forEach((page) => {
        cy.visit(page);
        // Assert - Banner should not appear
        cookieBannerPage.verifyCookieBannerIsNotVisible();
      });

      // Assert - Consent still stored
      cookieBannerPage.verifyCookieConsentInStorage("rejected");
    });

    it("should remember accepted consent after browser refresh", () => {
      // Arrange
      cy.visit("/");
      cookieBannerPage.clickAcceptButton();
      cookieBannerPage.clickHideMessageButton();

      // Act - Simulate browser refresh
      cy.reload();

      // Assert - Banner should not appear
      cookieBannerPage.verifyCookieBannerIsNotVisible();
      cookieBannerPage.verifyCookieConsentInStorage("accepted");
    });
  });

  describe("Edge Case and Additional Scenarios", () => {
    it("should display only one banner at a time", () => {
      // Arrange & Act
      cy.visit("/");

      // Assert - Only one banner exists
      cy.get(".govuk-cookie-banner").should("have.length", 1);
    });

    it("should not show action buttons after accepting cookies", () => {
      // Arrange
      cy.visit("/");

      // Act
      cookieBannerPage.clickAcceptButton();

      // Assert - Accept and Reject buttons should not be visible
      cy.get('button:contains("Accept analytics cookies")').should("not.exist");
      cy.get('button:contains("Reject analytics cookies")').should("not.exist");
    });

    it("should not show action buttons after rejecting cookies", () => {
      // Arrange
      cy.visit("/");

      // Act
      cookieBannerPage.clickRejectButton();

      // Assert - Accept and Reject buttons should not be visible
      cy.get('button:contains("Accept analytics cookies")').should("not.exist");
      cy.get('button:contains("Reject analytics cookies")').should("not.exist");
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper ARIA labels on cookie banner", () => {
      // Arrange & Act
      cy.visit("/");

      // Assert - Check aria-label
      cy.get(".govuk-cookie-banner").should(
        "have.attr",
        "aria-label",
        "Cookies on Complete UK pre-entry health screening",
      );
    });

    it("should have data-nosnippet attribute for search engines", () => {
      // Arrange & Act
      cy.visit("/");

      // Assert - Check data-nosnippet
      cy.get(".govuk-cookie-banner").should("have.attr", "data-nosnippet", "true");
    });

    it("should have properly styled GovUK buttons", () => {
      // Arrange & Act
      cy.visit("/");

      // Assert - Check button classes
      cy.get('button:contains("Accept analytics cookies")')
        .should("have.class", "govuk-button")
        .and("have.attr", "data-module", "govuk-button");

      cy.get('button:contains("Reject analytics cookies")')
        .should("have.class", "govuk-button")
        .and("have.attr", "data-module", "govuk-button");
    });

    it("should have accessible link styling", () => {
      // Arrange & Act
      cy.visit("/");

      // Assert - Check link classes
      cy.get('a[href="/cookies"]').should("have.class", "govuk-link");
    });
  });
});
