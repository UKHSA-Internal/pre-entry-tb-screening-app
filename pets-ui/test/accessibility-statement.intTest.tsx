import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import AccessibilityStatementPage from "../src/pages/accessibility-statement";

describe("AccessibilityStatementPage", () => {
  const renderPage = () =>
    renderWithProviders(
      <HelmetProvider>
        <AccessibilityStatementPage />
      </HelmetProvider>,
    );

  it("renders the main h1 heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /Accessibility statement for Complete UK pre-entry health screening/i,
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("shows feedback contact email", () => {
    renderPage();
    const emailLink = screen.getByRole("link", { name: /uktbscreeningsupport@ukhsa.gov.uk/i });
    expect(emailLink).toHaveAttribute("href", "mailto:uktbscreeningsupport@ukhsa.gov.uk");
  });

  it("includes external reference links", () => {
    renderPage();
    expect(screen.getByRole("link", { name: "AbilityNet (opens in new tab)" })).toHaveAttribute(
      "href",
      "https://mcmw.abilitynet.org.uk/",
    );
    expect(
      screen.getByRole("link", {
        name: "contact the Equality Advisory and Support Service (EASS) (opens in new tab)",
      }),
    ).toHaveAttribute("href", "https://www.equalityadvisoryservice.com/");
    expect(
      screen.getByRole("link", {
        name: "Web Content Accessibility Guidelines version 2.2 (opens in new tab)",
      }),
    ).toHaveAttribute("href", "https://www.w3.org/TR/WCAG22/");
  });

  it("uses the default '/' as back link when no previous page is stored", () => {
    renderWithProviders(
      <HelmetProvider>
        <AccessibilityStatementPage />
      </HelmetProvider>,
    );
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("uses '/' as fallback back link", () => {
    renderWithProviders(
      <HelmetProvider>
        <AccessibilityStatementPage />
      </HelmetProvider>,
    );
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("navigates back to stored previous page when Back is clicked", async () => {
    sessionStorage.setItem(
      "navigationHistory",
      JSON.stringify(["/search-for-visa-applicant", "/accessibility-statement"]),
    );
    window.history.pushState({}, "", "/accessibility-statement");
    const user = userEvent.setup();
    renderWithProviders(
      <HelmetProvider>
        <AccessibilityStatementPage />
      </HelmetProvider>,
    );
    await user.click(screen.getByRole("link", { name: "Back" }));
    expect(window.location.pathname).toBe("/search-for-visa-applicant");
  });
});
