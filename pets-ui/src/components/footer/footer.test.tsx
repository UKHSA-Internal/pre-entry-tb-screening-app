import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "./footer";

describe("Footer component", () => {
  it("renders", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const text = screen.getByText("© Crown copyright");
    expect(footer).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
