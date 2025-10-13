import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import PhaseBanner from "./phaseBanner";

describe("Beta Component", () => {
  it("renders the beta banner with default", () => {
    renderWithProviders(<PhaseBanner />);

    expect(screen.getByText("BETA")).toBeInTheDocument();

    expect(screen.getByText(/This is a new service. Help us improve it and/)).toBeInTheDocument();

    const feedbackLink = screen.getByRole("link", {
      name: "give your feedback (opens in new tab)",
    });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute(
      "href",
      "https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl",
    );
  });
});
