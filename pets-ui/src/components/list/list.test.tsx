import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";

import List from "./list";

describe("List Component", () => {
  test("renders a list with given items", () => {
    const items = ["Item 1", "Item 2", "Item 3"];
    render(<List items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("applies custom styles when provided", () => {
    const items = ["Styled Item"];
    const customStyle = { color: "rgb(255, 0, 0)" };

    const { container } = render(<List items={items} style={customStyle} />);

    expect(container.firstChild).toHaveStyle(customStyle);
  });

  test("renders an empty list when no items are provided", () => {
    render(<List items={[]} />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("correctly renders links", () => {
    const linkText = "Test link";
    const items = [
      <a href="https://test.com" key="test-link">
        {linkText}
      </a>,
    ];
    render(<List items={items} />);

    const link = screen.getByText(linkText);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://test.com");
  });
});
