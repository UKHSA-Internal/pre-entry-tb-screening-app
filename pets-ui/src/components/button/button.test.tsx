import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonClass, ButtonType } from "@/utils/enums";

import Button from "./button";

const handleClick = () => {};

describe("Button component", () => {
  it("renders correctly when button class is DEFAULT and no type provided", () => {
    render(
      <Button
        id="test-id"
        text="test-text-default"
        class={ButtonClass.DEFAULT}
        handleClick={handleClick}
      />,
    );
    expect(screen.getByText("test-text-default")).toBeTruthy();
    const button = screen.getByRole("button", { name: "test-text-default" });
    expect(button).toHaveAttribute("type", "submit");

    const { container } = render(
      <Button
        id="test-id"
        text="test-text-default"
        class={ButtonClass.DEFAULT}
        handleClick={handleClick}
      />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(0);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(0);
  });

  it("renders correctly when button class is SECONDARY and type is submit", () => {
    render(
      <Button
        id="test-id"
        text="test-text-secondary"
        class={ButtonClass.SECONDARY}
        type={ButtonType.SUBMIT}
        handleClick={handleClick}
      />,
    );
    expect(screen.getByText("test-text-secondary")).toBeTruthy();
    const button = screen.getByRole("button", { name: "test-text-secondary" });
    expect(button).toHaveAttribute("type", "submit");

    const { container } = render(
      <Button
        id="test-id"
        text="test-text-secondary"
        class={ButtonClass.SECONDARY}
        type={ButtonType.SUBMIT}
        handleClick={handleClick}
      />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(0);
  });

  it("renders correctly when button type is WARNING and type is button", () => {
    render(
      <Button
        id="test-id"
        text="test-text-warning"
        class={ButtonClass.WARNING}
        type={ButtonType.BUTTON}
        handleClick={handleClick}
      />,
    );
    expect(screen.getByText("test-text-warning")).toBeTruthy();
    const button = screen.getByRole("button", { name: "test-text-warning" });
    expect(button).toHaveAttribute("type", "button");

    const { container } = render(
      <Button
        id="test-id"
        text="test-text-warning"
        class={ButtonClass.WARNING}
        type={ButtonType.BUTTON}
        handleClick={handleClick}
      />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(0);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(1);
  });

  it("renders button with marginTop style", () => {
    render(
      <Button
        id="test-id"
        text="test-text-default"
        class={ButtonClass.DEFAULT}
        handleClick={handleClick}
      />,
    );

    const buttonElement = screen.getByText("test-text-default");
    expect(buttonElement).toHaveStyle("margin-top: 30px");
  });
});
