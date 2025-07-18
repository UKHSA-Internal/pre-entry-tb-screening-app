import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Beta from "./phaseBanner";

describe("Beta Component", () => {
  it("renders the beta banner with default", () => {
    renderWithProviders(<Beta />);

    expect(screen.getByText("BETA")).toBeInTheDocument();

    expect(screen.getByText(/This is a new service – your/)).toBeInTheDocument();
    expect(screen.getByText(/will help us to improve it/)).toBeInTheDocument();

    const feedbackLink = screen.getByRole("link", { name: "feedback" });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute("href", "/feedback");
  });

  it("renders with custom feedback URL", () => {
    const customFeedbackUrl = "https://example.com/feedback";
    renderWithProviders(<Beta feedbackUrl={customFeedbackUrl} />);

    const feedbackLink = screen.getByRole("link", { name: "feedback" });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute("href", customFeedbackUrl);
  });
});
