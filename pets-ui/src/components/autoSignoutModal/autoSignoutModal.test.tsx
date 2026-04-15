import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import AutoSignoutModal from "./autoSignoutModal";

const mockAccounts: { username: string }[] = [{ username: "user@test.com" }];
const logoutRedirectMock = vi.hoisted(() => vi.fn(() => Promise.resolve()));
vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({
    accounts: mockAccounts,
    instance: { logoutRedirect: logoutRedirectMock },
  }),
}));

vi.mock("react-idle-timer", () => {
  type UseIdleTimerOptions = {
    timeout: number;
    onIdle: () => void;
  };
  return {
    useIdleTimer: ({ timeout, onIdle }: UseIdleTimerOptions) => {
      setTimeout(onIdle, timeout);
    },
  };
});

describe("AutoSignoutModal component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    logoutRedirectMock.mockClear();
  });

  it("renders modal, modal overlay & modal container only after 18 minutes have passed", () => {
    renderWithProviders(<AutoSignoutModal />);

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 17);
    });
    expect(screen.queryByTestId("signout-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-overlay")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-container")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 1);
    });
    expect(screen.queryByTestId("signout-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-overlay")).toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-container")).toBeInTheDocument();
  });

  it("modal components (heading, text, button, link) are all correctly displayed", () => {
    renderWithProviders(<AutoSignoutModal />);

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 17);
    });
    expect(screen.queryByText("You are about to be signed out")).not.toBeInTheDocument();
    expect(
      screen.queryByText("To protect the information, we will sign you out in 2 minutes."),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 1);
    });
    expect(screen.getByText("You are about to be signed out")).toBeInTheDocument();
    expect(
      screen.getByText(/to protect the information, we will sign you out in/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 minutes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stay signed in" })).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("hides the modal & resets timers when 'Stay signed in' button is clicked", () => {
    renderWithProviders(<AutoSignoutModal />);

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 18);
    });
    expect(screen.queryByTestId("signout-modal")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Stay signed in" });
    act(() => {
      button.click();
    });

    expect(screen.queryByTestId("signout-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-overlay")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-container")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 17);
    });
    expect(screen.queryByTestId("signout-modal")).not.toBeInTheDocument();
    expect(logoutRedirectMock).not.toHaveBeenCalled();
  });

  it("logout function is called after 20 minutes of inactivity", () => {
    renderWithProviders(<AutoSignoutModal />);

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 18);
    });
    expect(logoutRedirectMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 2);
    });
    expect(logoutRedirectMock).toHaveBeenCalled();
  });

  it("modal is not displayed if idle user is not logged in", () => {
    mockAccounts.length = 0;
    renderWithProviders(<AutoSignoutModal />);

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 18);
    });
    expect(screen.queryByTestId("signout-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-overlay")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signout-modal-container")).not.toBeInTheDocument();
  });
});
