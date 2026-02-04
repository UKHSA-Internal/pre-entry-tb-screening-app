import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, Mock } from "vitest";

import CookiesPage from "@/pages/cookies";
import { renderWithProviders } from "@/utils/test-utils";

let emptyMockFn: Mock;

beforeEach(() => {
  vi.clearAllMocks();
  emptyMockFn = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = emptyMockFn;
  localStorage.clear();
});

const user = userEvent.setup();

describe("CookiesPage", () => {
  const renderPage = () => {
    renderWithProviders(
      <HelmetProvider>
        <CookiesPage />
      </HelmetProvider>,
    );
  };

  it("renders the main h1 heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /Cookies/i,
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("renders h2 headings", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: "Essential cookies",
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Analytics cookies (optional)",
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it("renders expected text", () => {
    const expectedTextList = [
      "Cookies are small files saved on your phone, tablet or computer when you visit a website.",
      "We use cookies to make this site work and collect information about how you use our service.",
      "Essential cookies keep your information secure while you use this service. We do not need to ask permission to use them.",
      "With your permission, we use Google Analytics to collect data about how you use Complete UK pre-entry health screening. This information helps us to improve our service.",
      "We use Google Analytics cookies to collect information about:",
      "how you got to our service",
      "the pages you visit on our service and how long you spend on them",
      "any errors you see while using our service",
    ];
    renderPage();
    for (const text of expectedTextList) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("renders the table headings", () => {
    renderPage();
    expect(screen.getByText("Essential cookies we use")).toBeInTheDocument();
    expect(screen.getByText("Essential cookies we use")).toHaveClass(
      "govuk-table__caption govuk-table__caption--m",
    );
    expect(screen.getByText("Google Analytics cookies we use")).toBeInTheDocument();
    expect(screen.getByText("Google Analytics cookies we use")).toHaveClass(
      "govuk-table__caption govuk-table__caption--m",
    );
  });

  it("uses the default '/' as back link when no previous page is stored", () => {
    renderPage();
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("uses '/' as fallback back link", () => {
    renderPage();
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("navigates back to stored previous page when Back is clicked", async () => {
    sessionStorage.setItem(
      "navigationHistory",
      JSON.stringify(["/search-for-visa-applicant", "/cookies"]),
    );
    window.history.pushState({}, "", "/cookies");
    renderPage();
    await user.click(screen.getByRole("link", { name: "Back" }));
    expect(window.location.pathname).toBe("/search-for-visa-applicant");
  });

  it("should handle YES consent correctly", async () => {
    renderPage();
    await waitFor(() => {
      expect(localStorage.getItem("cookie-consent")).toBe(null);
    });

    const radioYes = screen.getByRole("radio", { name: "Yes" });
    await user.click(radioYes);
    await user.click(screen.getByRole("button", { name: "Save cookie settings" }));

    await waitFor(() => {
      expect(localStorage.getItem("cookie-consent")).toBe("accepted");
    });
  });

  it("should handle NO consent correctly", async () => {
    renderPage();
    await waitFor(() => {
      expect(localStorage.getItem("cookie-consent")).toBe(null);
    });

    const radioNo = screen.getByRole("radio", { name: "No" });
    await user.click(radioNo);
    await user.click(screen.getByRole("button", { name: "Save cookie settings" }));

    await waitFor(() => {
      expect(localStorage.getItem("cookie-consent")).toBe("rejected");
    });
  });

  it("should not update anything if consent is neither YES nor NO", async () => {
    renderPage();
    await waitFor(() => {
      expect(localStorage.getItem("cookie-consent")).toBe(null);
    });

    await user.click(screen.getByRole("button", { name: "Save cookie settings" }));

    await waitFor(() => {
      expect(localStorage.getItem("cookie-consent")).toBe(null);
    });
  });
});
