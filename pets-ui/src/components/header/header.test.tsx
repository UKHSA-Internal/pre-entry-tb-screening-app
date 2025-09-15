import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Header from "./header";

const mockAccounts: { username: string }[] = [{ username: "user@test.com" }];

vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({ accounts: mockAccounts }),
}));

const renderHeader = () => renderWithProviders(<Header />);

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

  it("does not show sign out link when no accounts", () => {
    mockAccounts.length = 0;
    renderHeader();
    expect(screen.queryByRole("link", { name: "Sign out" })).toBeNull();
  });
});
