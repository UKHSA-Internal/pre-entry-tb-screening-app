import { fireEvent, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignOutPage from "@/pages/sign-out";
import { renderWithProvidersWithoutRouter } from "@/utils/test-utils";

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
  let replaceMock: (url?: string) => void;

  beforeEach(() => {
    replaceMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, replace: replaceMock },
      writable: true,
      configurable: true,
    });

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

  it("clears msal localStorage keys and redirects to /signed-out on confirm", () => {
    renderSignOut();
    const signOutBtn = screen.getByRole("button", { name: "Sign out" });
    fireEvent.click(signOutBtn);

    expect(localStorage.getItem("msal.test")).toBeNull();
    expect(replaceMock).toHaveBeenCalledWith("/signed-out");
  });

  it("navigates back to previous page when cancel clicked", () => {
    renderSignOut();
    const cancelBtn = screen.getByRole("button", { name: "Go back to screening" });
    fireEvent.click(cancelBtn);
    expect(screen.getByText("Previous Page")).toBeInTheDocument();
  });

  it("does not redirect to /signed-out if an error occurs", () => {
    vi.spyOn(Storage.prototype, "key").mockImplementation(() => {
      throw new Error("error");
    });
    renderSignOut();
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(localStorage.getItem("msal.test")).toBe("value");
    expect(replaceMock).not.toHaveBeenCalledWith("/signed-out");
  });
});
