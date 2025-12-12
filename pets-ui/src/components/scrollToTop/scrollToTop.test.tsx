import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ScrollToTop from "./scrollToTop";

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ScrollToTop />
    </MemoryRouter>,
  );
}

describe("ScrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls scrollTo when URL has no hash", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL("http://localhost/page1"),
    });

    renderWithRouter(["/page1"]);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does not call scrollTo when URL has a hash", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL("http://localhost/page2#section1"),
    });

    renderWithRouter(["/page2#section1"]);

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
