//This Holds all interactions with the cookie consent banner

export class CookieBannerPage {
  // Verify the cookie banner is visible
  verifyCookieBannerIsVisible(): void {
    cy.get(".govuk-cookie-banner")
      .should("be.visible")
      .and("have.attr", "data-nosnippet", "true")
      .and("have.attr", "aria-label", "Cookies on Complete UK pre-entry health screening");
  }

  // Verify the cookie banner heading

  verifyCookieBannerHeading(): void {
    cy.get(".govuk-cookie-banner__heading")
      .should("be.visible")
      .and("contain.text", "Cookies on Complete UK pre-entry health screening");
  }
  // Verify the cookie banner content
  verifyCookieBannerContent(): void {
    cy.get(".govuk-cookie-banner")
      .should("contain.text", "We use some essential cookies to make this service work.")
      .and(
        "contain.text",
        "We would also like to use analytics cookies so we can understand how you use the service and make improvements.",
      );
  }
  // Verify Accept and Reject buttons are visible

  verifyActionButtonsAreVisible(): void {
    cy.contains("button", "Accept analytics cookies").should("be.visible");
    cy.contains("button", "Reject analytics cookies").should("be.visible");
    cy.get('.govuk-cookie-banner a[href="/cookies"]')
      .should("be.visible")
      .and("have.text", "View cookies");
  }

  // Click Accept analytics cookies button
  clickAcceptButton(): void {
    cy.get(".govuk-cookie-banner .govuk-button-group button")
      .contains("Accept analytics cookies")
      .click({ force: true });
  }

  // Click Reject analytics cookies button
  clickRejectButton(): void {
    cy.get(".govuk-cookie-banner .govuk-button-group button")
      .contains("Reject analytics cookies")
      .click({ force: true });
  }

  // Click View cookies link
  clickViewCookiesLink(): void {
    cy.get('.govuk-cookie-banner a[href="/cookies"]').click();
  }

  // Verify acceptance confirmation message is displayed
  verifyAcceptanceMessage(): void {
    cy.get(".govuk-cookie-banner")
      .should("be.visible")
      .and(
        "contain.text",
        "You have accepted analytics cookies. You can change your cookie settings at any time.",
      );
  }

  // Verify rejection confirmation message is displayed
  verifyRejectionMessage(): void {
    cy.get(".govuk-cookie-banner")
      .should("be.visible")
      .and(
        "contain.text",
        "You have rejected analytics cookies. You can change your cookie settings at any time.",
      );
  }

  // Verify "Change your cookie settings" link is visible

  verifyChangeSettingsLinkIsVisible(): void {
    cy.get(".govuk-cookie-banner")
      .contains("a", "change your cookie settings")
      .should("be.visible");
  }

  // Click "Change your cookie settings" link

  clickChangeSettingsLink(): void {
    cy.get(".govuk-cookie-banner").contains("a", "change your cookie settings").click();
  }

  // Verify "Hide cookie message" button is visible and has correct styling
  verifyHideMessageButtonIsVisible(): void {
    cy.contains("button", "Hide cookie message")
      .should("be.visible")
      .and("have.class", "govuk-button");
  }

  // Click "Hide cookie message" button
  clickHideMessageButton(): void {
    cy.contains("button", "Hide cookie message").click({ force: true });
  }

  // Verify the cookie banner is not visible
  verifyCookieBannerIsNotVisible(): void {
    cy.get(".govuk-cookie-banner").should("not.exist");
  }

  /**
   * Verify the cookie banner persists across navigation
   * @param urls - Array of URLs to navigate to
   */
  verifyCookieBannerPersistsAcrossPages(urls: string[]): void {
    urls.forEach((url) => {
      cy.visit(url);
      this.verifyCookieBannerIsVisible();
    });
  }

  /**
   * Clear cookie consent from local storage
   * Useful for test setup to ensure clean state
   */
  clearCookieConsent(): void {
    cy.clearLocalStorage();
    cy.clearCookies();
  }

  /**
   * Check if user has accepted/rejected cookies in local storage
   * Matches the storage keys used in commands.ts: 'cookies-policy', 'cookieConsent', 'cookie-consent'
   * @param expectedValue - 'accepted' | 'rejected' | null
   */
  verifyCookieConsentInStorage(expectedValue: "accepted" | "rejected" | null): void {
    cy.window().then((win) => {
      const cookieConsent = win.localStorage.getItem("cookie-consent");
      const cookieConsentAlt = win.localStorage.getItem("cookieConsent");
      const cookiesPolicy = win.localStorage.getItem("cookies-policy");

      if (expectedValue === null) {
        // Verify no consent has been stored
        expect(cookieConsent).to.equal(null);
        expect(cookieConsentAlt).to.equal(null);
      } else {
        // Verify consent matches expected value (check any of the storage keys)
        const hasCorrectConsent =
          cookieConsent === expectedValue || cookieConsentAlt === expectedValue;

        expect(hasCorrectConsent, `Cookie consent should be ${expectedValue}`).to.equal(true);

        // Also verify cookies-policy if it exists
        if (cookiesPolicy !== null && cookiesPolicy !== undefined) {
          const policy = JSON.parse(cookiesPolicy) as { analytics: boolean; essential: boolean };
          const expectedAnalytics = expectedValue === "accepted";
          expect(policy.analytics).to.equal(expectedAnalytics);
          expect(policy.essential).to.equal(true);
        }
      }
    });
  }
}
