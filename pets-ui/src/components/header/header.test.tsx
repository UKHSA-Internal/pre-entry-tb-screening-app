import { cleanup, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Header from "./header";

const mockAccounts: { username: string }[] = [{ username: "user@test.com" }];

vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({ accounts: mockAccounts }),
}));

const renderHeader = () => renderWithProviders(<Header />);

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("Header component", () => {
  it("renders", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header).toBeTruthy();
  });

  it("shows sign out link when user is signed in", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Sign out" })).toBeInTheDocument();
  });

  it("sign out link directs the user to the sign out page without the skipSignOutCheck query param by default", () => {
    window.history.pushState({}, "", "/some-page");
    renderHeader();
    expect(screen.getByRole("link", { name: "Sign out" })).toHaveAttribute(
      "href",
      "/are-you-sure-you-want-to-sign-out",
    );
  });

  it("sign out link on the applicant search page directs the user to the sign out page with the skipSignOutCheck query param set to true", () => {
    window.history.pushState({}, "", "/search-for-visa-applicant");
    renderHeader();
    expect(screen.getByRole("link", { name: "Sign out" })).toHaveAttribute(
      "href",
      "/are-you-sure-you-want-to-sign-out?skipSignOutCheck=true",
    );
  });

  it("sign out link on the tracker page directs the user to the sign out page with the skipSignOutCheck query param set to true", () => {
    window.history.pushState({}, "", "/tracker");
    renderHeader();
    expect(screen.getByRole("link", { name: "Sign out" })).toHaveAttribute(
      "href",
      "/are-you-sure-you-want-to-sign-out?skipSignOutCheck=true",
    );
  });

  it("sign out link on any confirmation page directs the user to the sign out page with the skipSignOutCheck query param set to true", () => {
    window.history.pushState({}, "", "/something-something-confirmed");
    renderHeader();
    expect(screen.getByRole("link", { name: "Sign out" })).toHaveAttribute(
      "href",
      "/are-you-sure-you-want-to-sign-out?skipSignOutCheck=true",
    );
  });

  it("does not show sign out link when no accounts", () => {
    mockAccounts.length = 0;
    renderHeader();
    expect(screen.queryByRole("link", { name: "Sign out" })).toBeNull();
  });
});
