import { render, screen } from "@testing-library/react";
import SkipLink from "./skipLink";

describe("SkipLink component", () => {
  it("renders correctly", () => {
    render(<SkipLink />);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#mainContent");
  });
});
