import { cleanup, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

let navigateMock: ReturnType<typeof vi.fn>;
let currentLocation = { pathname: "/page", search: "", hash: "" };

vi.mock("react-router-dom", () => ({
  useLocation: () => currentLocation,
  useNavigate: () => navigateMock,
}));

import { useNavigationHistory } from "./useNavigationHistory";

const HISTORY_KEY = "navigationHistory";

function HookConsumer({
  shouldClearHistory = false,
  onReady,
}: {
  shouldClearHistory?: boolean;
  onReady?: (api: ReturnType<typeof useNavigationHistory>) => void;
}) {
  const api = useNavigationHistory(shouldClearHistory);
  useEffect(() => {
    onReady?.(api);
  }, [api, onReady]);
  return null;
}

describe("useNavigationHistory", () => {
  beforeEach(() => {
    cleanup();
    navigateMock = vi.fn();
    currentLocation = { pathname: "/page", search: "", hash: "" };
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("logs an error when sessionStorage.setItem throws one", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const setSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("error");
    });

    render(<HookConsumer />);

    await waitFor(() => {
      expect(setSpy).toHaveBeenCalled();
      expect(errSpy).toHaveBeenCalled();
      const [message, error] = errSpy.mock.calls[0];
      expect(String(message)).toContain("Failed to set navigation history");
      expect(error).toBeInstanceOf(Error);
    });
  });

  it("trims history when exceeding MAX_HISTORY_SIZE", async () => {
    const prev: string[] = [];
    for (let i = 0; i < 50; i++) prev.push(`/p${i}`);
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(prev));
    currentLocation = { pathname: "/new", search: "", hash: "" };

    render(<HookConsumer />);

    await waitFor(() => {
      const stored = sessionStorage.getItem(HISTORY_KEY);
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored as string) as string[];
      expect(parsed.length).toBe(50);
      expect(parsed[0]).toBe("/p1");
      expect(parsed[parsed.length - 1]).toBe("/new");
    });
  });

  it("navigates to fallback when no previous path", async () => {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify([]));
    currentLocation = { pathname: "/only", search: "", hash: "" };

    let capturedApi: ReturnType<typeof useNavigationHistory> | undefined;
    render(
      <HookConsumer
        onReady={(api) => {
          capturedApi = api;
        }}
      />,
    );

    await waitFor(() => {
      expect(capturedApi).toBeTruthy();
    });

    capturedApi!.goBack("/fallback");
    expect(navigateMock).toHaveBeenCalledWith("/fallback");
  });
});
