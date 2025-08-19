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

  it("renders the accessibility statement link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Accessibility statement" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/accessibility-statement");
  });
});
