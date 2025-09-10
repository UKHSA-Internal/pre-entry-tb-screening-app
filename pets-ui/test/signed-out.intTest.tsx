import { screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";

import SignedOutPage from "@/pages/signed-out";
import { renderWithProviders } from "@/utils/test-utils";

describe("Signed out page", () => {
  const setup = () => {
    renderWithProviders(
      <HelmetProvider>
        <SignedOutPage />
      </HelmetProvider>,
    );
  };

  it("renders heading and explanatory text", () => {
    setup();
    expect(screen.getByRole("heading", { name: "You have signed out" })).toBeInTheDocument();
    expect(
      screen.getByText("You will need to sign in to continue or start a new screening."),
    ).toBeInTheDocument();
  });

  it("contains a sign in link back to root", () => {
    setup();
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    expect(signInLink).toHaveAttribute("href", "/");
  });

  it("contains feedback link with correct URL and text", () => {
    setup();
    const feedbackLink = screen.getByRole("link", {
      name: "What did you think of this service? (opens in new tab)",
    });
    expect(feedbackLink).toHaveAttribute(
      "href",
      "https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl",
    );
  });
});
