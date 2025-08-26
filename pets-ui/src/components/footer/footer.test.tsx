import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { selectNavigation } from "@/redux/store";
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

  it("renders the privacy notice link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Privacy" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/privacy-notice");
  });

  it("renders the accessibility statement link", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Accessibility statement" });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/accessibility-statement");
  });

  it("dispatches previous page into navigation state when clicking the accessibility link", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Footer />);
    const link = screen.getByRole("link", { name: "Accessibility statement" });
    await user.click(link);
    const nav = selectNavigation(store.getState());
    expect(nav.accessibilityStatementPreviousPage).toBe("/");
  });
});
