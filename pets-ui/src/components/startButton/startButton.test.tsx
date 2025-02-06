import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StartButton from "./startButton";

const handleClick = () => {};

describe("Button component", () => {
  it("renders correctly", () => {
    render(
      <StartButton
        id="test-id"
        text="test-text-default"
        href="/test-href"
        handleClick={handleClick}
      />,
    );
    expect(screen.getByText("test-text-default")).toBeTruthy();

    const { container } = render(
      <StartButton
        id="test-id"
        text="test-text-default"
        href="/test-href"
        handleClick={handleClick}
      />,
    );
    expect(container.getElementsByClassName("govuk-button--start")).toHaveLength(1);
  });
});
