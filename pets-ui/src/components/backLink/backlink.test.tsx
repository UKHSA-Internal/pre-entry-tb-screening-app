import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import BackLink from "./backLink";

describe("BackLink component", () => {
  it("renders text correctly", () => {
    renderWithProviders(<BackLink fallbackUrl="/test" />);
    expect(screen.getByText("Back")).toBeTruthy();
  });
  it("renders link correctly", () => {
    renderWithProviders(<BackLink fallbackUrl="/test" />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").getAttribute("href")).toEqual("/test");
  });
});
