import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignOutPage from "@/pages/sign-out";
import { renderWithProvidersWithoutRouter } from "@/utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
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

const renderSignOut = () => {
  renderWithProvidersWithoutRouter(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/are-you-sure-you-want-to-sign-out"]}>
        <Routes>
          <Route path="/are-you-sure-you-want-to-sign-out" element={<SignOutPage />} />
          <Route path="/previous-page" element={<div>Previous Page</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
};

const renderSignOutWithSkipParam = () => {
  renderWithProvidersWithoutRouter(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/are-you-sure-you-want-to-sign-out?skipSignOutCheck=true"]}>
        <Routes>
          <Route path="/are-you-sure-you-want-to-sign-out" element={<SignOutPage />} />
          <Route path="/previous-page" element={<div>Previous Page</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
};

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

  it("calls msal logout redirect with /you-have-signed-out on confirm", async () => {
    renderSignOut();
    const signOutBtn = screen.getByRole("button", { name: "Sign out" });
    await user.click(signOutBtn);

    expect(mockLogoutRedirect).toHaveBeenCalledWith({
      postLogoutRedirectUri: "/you-have-signed-out",
    });
  });

  it("navigates back to previous page when cancel clicked", async () => {
    sessionStorage.setItem(
      "navigationHistory",
      JSON.stringify(["/previous-page", "/are-you-sure-you-want-to-sign-out"]),
    );
    renderSignOut();
    const cancelBtn = screen.getByRole("button", { name: "Go back to screening" });
    await user.click(cancelBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/previous-page");
  });

  it("redirects to /sorry-there-is-problem-with-service if MSAL logout fails", async () => {
    mockLogoutRedirect.mockRejectedValue(new Error("MSAL logout error"));
    renderSignOut();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(mockNavigate).toHaveBeenCalledWith("/sorry-there-is-problem-with-service");
  });

  it("logs user out immediately if skipSignOutCheck query param set to true", async () => {
    renderSignOutWithSkipParam();
    await waitFor(() => {
      expect(mockLogoutRedirect).toHaveBeenCalledWith({
        postLogoutRedirectUri: "/you-have-signed-out",
      });
    });
  });
});
