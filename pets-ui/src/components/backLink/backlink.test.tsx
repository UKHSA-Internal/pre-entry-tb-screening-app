import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import BackLink from "./backLink";

describe("BackLink component", () => {
  it("renders text correctly", () => {
    render(
      <Router>
        <BackLink href="/test" />
      </Router>,
    );
    expect(screen.getByText("Back")).toBeTruthy();
  });
  it("renders link correctly", () => {
    render(
      <Router>
        <BackLink href="/test" />
      </Router>,
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").getAttribute("href")).toEqual("/test");
  });
});
