import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignOutPage from "@/pages/sign-out";
import { renderWithProvidersWithoutRouter } from "@/utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogoutRedirect = vi.fn();
vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({
    instance: {
      logoutRedirect: mockLogoutRedirect,
    },
    accounts: [],
  }),
}));

const renderSignOut = () =>
  renderWithProvidersWithoutRouter(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/sign-out"]}>
        <Routes>
          <Route path="/sign-out" element={<SignOutPage />} />
          <Route path="/previous-page" element={<div>Previous Page</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
    {
      preloadedState: {
        navigation: {
          signOutPreviousPage: "/previous-page",
          checkSputumPreviousPage: "",
          accessibilityStatementPreviousPage: "",
          privacyNoticePreviousPage: "",
        },
      },
    },
  );

describe("Sign out page", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockNavigate.mockClear();
    mockLogoutRedirect.mockClear();
    mockLogoutRedirect.mockResolvedValue(undefined);

    localStorage.clear();
    localStorage.setItem("msal.test", "value");
  });

  it("shows confirmation content", () => {
    renderSignOut();
    expect(
      screen.getByRole("heading", { name: "Are you sure you want to sign out?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back to screening" })).toBeInTheDocument();
  });

  it("calls msal logout redirect with /signed-out on confirm", async () => {
    renderSignOut();
    const signOutBtn = screen.getByRole("button", { name: "Sign out" });
    await user.click(signOutBtn);

    expect(mockLogoutRedirect).toHaveBeenCalledWith({
      postLogoutRedirectUri: "/signed-out",
    });
  });

  it("navigates back to previous page when cancel clicked", async () => {
    renderSignOut();
    const cancelBtn = screen.getByRole("button", { name: "Go back to screening" });
    await user.click(cancelBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/previous-page");
  });

  it("redirects to /error if MSAL logout fails", async () => {
    mockLogoutRedirect.mockRejectedValue(new Error("MSAL logout error"));
    renderSignOut();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(mockNavigate).toHaveBeenCalledWith("/error");
  });
});
