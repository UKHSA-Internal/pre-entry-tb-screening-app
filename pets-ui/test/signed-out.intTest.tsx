import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignedOutPage from "@/pages/signed-out";
import { renderWithProviders } from "@/utils/test-utils";

const mockLoginRedirect = vi.fn();
vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({
    instance: {
      loginRedirect: mockLoginRedirect,
    },
    accounts: [],
  }),
}));

describe("Signed out page", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockLoginRedirect.mockClear();
    mockLoginRedirect.mockResolvedValue(undefined);
  });

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

  it("contains a sign in link", () => {
    setup();
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    expect(signInLink).toBeInTheDocument();
  });

  it("calls MSAL loginRedirect when sign in link is clicked", async () => {
    setup();
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    await user.click(signInLink);

    expect(mockLoginRedirect).toHaveBeenCalledWith({
      scopes: [],
      storeInCache: {
        accessToken: true,
        idToken: true,
        refreshToken: true,
      },
    });
  });

  it("handles MSAL loginRedirect errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockLoginRedirect.mockRejectedValue(new Error("MSAL login error"));
    setup();
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    await user.click(signInLink);

    expect(mockLoginRedirect).toHaveBeenCalled();
    consoleSpy.mockRestore();
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
