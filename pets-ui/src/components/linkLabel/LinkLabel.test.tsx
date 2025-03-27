import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LinkLabel from "./LinkLabel";

describe("LinkLabel component", () => {
  it("renders correctly with the given title and URL", () => {
    const title = "Test Link";
    const to = "https://example.com";

    render(<LinkLabel title={title} to={to} />);

    const linkElement = screen.getByRole("link", { name: title });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass("govuk-link");
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveTextContent(title);
  });
});
