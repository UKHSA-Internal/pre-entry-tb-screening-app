import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Beta from "./beta";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Beta Component", () => {
  it("renders the beta banner with default", () => {
    renderWithRouter(<Beta />);

    expect(screen.getByText("BETA")).toBeInTheDocument();

    expect(screen.getByText(/This is a new service – your/)).toBeInTheDocument();
    expect(screen.getByText(/will help us to improve it/)).toBeInTheDocument();

    const feedbackLink = screen.getByRole("link", { name: "feedback" });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute("href", "/feedback");
  });

  it("renders with custom feedback URL", () => {
    const customFeedbackUrl = "https://example.com/feedback";
    renderWithRouter(<Beta feedbackUrl={customFeedbackUrl} />);

    const feedbackLink = screen.getByRole("link", { name: "feedback" });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute("href", customFeedbackUrl);
  });
});
