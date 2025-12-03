import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Footer from "./footer";

describe("Footer component", () => {
  it("renders", () => {
    renderWithProviders(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const text = screen.getByText("© Crown copyright");
    expect(footer).toBeTruthy();
    expect(text).toBeTruthy();
  });

  it("renders the more information heading", () => {
    renderWithProviders(<Footer />);
    const heading = screen.getByRole("heading", { name: "More information" });
    expect(heading).toBeTruthy();
  });

  it("renders the UK tuberculosis technical instructions link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", {
      name: "UK tuberculosis technical instructions (opens in new tab)",
    });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe(
      "https://www.gov.uk/government/publications/uk-tuberculosis-technical-instructions",
    );
  });

  it("renders the privacy notice link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Privacy" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/privacy-notice");
  });

  it("renders the cookies link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Cookies" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/cookies");
  });

  it("renders the accessibility statement link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Accessibility statement" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/accessibility-statement");
  });

  it("renders the built by UK Health Security Agency link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "UK Health Security Agency" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe(
      "https://www.gov.uk/government/organisations/uk-health-security-agency",
    );
  });

  it("renders the open government licence link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Open Government Licence v3.0" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe(
      "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    );
  });
});
