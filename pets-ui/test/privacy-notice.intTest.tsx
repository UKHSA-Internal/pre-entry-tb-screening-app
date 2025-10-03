import { screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";

import PrivacyNoticePage from "@/pages/privacy-notice";
import { selectNavigation } from "@/redux/store";
import { renderWithProviders } from "@/utils/test-utils";

describe("PrivacyNoticePage", () => {
  const renderPage = () =>
    renderWithProviders(
      <HelmetProvider>
        <PrivacyNoticePage />
      </HelmetProvider>,
    );

  it("renders the main h1 heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /Privacy notice for Complete UK pre-entry health screening/i,
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("shows contact emails", () => {
    renderPage();
    const emailLinks = [
      screen.getByRole("link", { name: /informationrights@ukhsa.gov.uk/i }),
      screen.getByRole("link", { name: /uktbscreeningsupport@ukhsa.gov.uk/i }),
      screen.getByRole("link", { name: /data_protection@dhsc.gov.uk/i }),
    ];
    expect(emailLinks[0]).toHaveAttribute("href", "mailto:informationrights@ukhsa.gov.uk");
    expect(emailLinks[1]).toHaveAttribute("href", "mailto:uktbscreeningsupport@ukhsa.gov.uk");
    expect(emailLinks[2]).toHaveAttribute("href", "mailto:data_protection@dhsc.gov.uk");
  });

  it("includes external reference links", () => {
    renderPage();
    expect(
      screen.getByRole("link", { name: "UKHSA strategic plan 2023 to 2026 (opens in new tab)" }),
    ).toHaveAttribute(
      "href",
      "https://www.gov.uk/government/publications/ukhsa-strategic-plan-2023-to-2026",
    );
    expect(
      screen.getByRole("link", {
        name: "UK pre-entry TB screening report is published on GOV.UK (opens in new tab)",
      }),
    ).toHaveAttribute(
      "href",
      "https://www.gov.uk/government/publications/tuberculosis-in-england-2024-report",
    );
    expect(
      screen.getByRole("link", {
        name: "Information Commissioner's Office (opens in new tab)",
      }),
    ).toHaveAttribute("href", "https://ico.org.uk/global/contact-us");
    expect(
      screen.getByRole("link", {
        name: "UKHSA privacy notice (opens in new tab)",
      }),
    ).toHaveAttribute(
      "href",
      "https://www.gov.uk/government/publications/ukhsa-privacy-notice/ukhsa-privacy-notice",
    );
  });

  it("uses the default '/' as back link when no previous page is stored", () => {
    const { store } = renderWithProviders(
      <HelmetProvider>
        <PrivacyNoticePage />
      </HelmetProvider>,
    );
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/");
    const nav = selectNavigation(store.getState());
    expect(nav.privacyNoticePreviousPage).toBe("");
  });

  it("uses stored previous page for the back link when set", () => {
    const preloadedState = {
      navigation: {
        checkSputumPreviousPage: "",
        accessibilityStatementPreviousPage: "",
        privacyNoticePreviousPage: "/search-for-visa-applicant",
        signOutPreviousPage: "",
      },
    };
    renderWithProviders(
      <HelmetProvider>
        <PrivacyNoticePage />
      </HelmetProvider>,
      { preloadedState },
    );
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/search-for-visa-applicant");
  });
});
