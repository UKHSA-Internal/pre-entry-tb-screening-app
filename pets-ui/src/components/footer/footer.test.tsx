import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "./footer";

describe("Footer component", () => {
  it("renders", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const text = screen.getByText("© Crown copyright");
    expect(footer).toBeTruthy();
    expect(text).toBeTruthy();
  });

  it("renders the accessibility statement link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "Accessibility statement" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("https://www.gov.uk/help/accessibility-statement");
  });
});
