import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonClass } from "@/utils/enums";

import SubmitButton from "./submitButton";

describe("Button component", () => {
  it("renders correctly when button type is DEFAULT", () => {
    render(<SubmitButton id="test-id" text="test-text-default" class={ButtonClass.DEFAULT} />);
    expect(screen.getByText("test-text-default")).toBeTruthy();

    const { container } = render(
      <SubmitButton id="test-id" text="test-text-default" class={ButtonClass.DEFAULT} />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(0);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(0);
  });

  it("renders correctly when button type is SECONDARY", () => {
    render(<SubmitButton id="test-id" text="test-text-secondary" class={ButtonClass.SECONDARY} />);
    expect(screen.getByText("test-text-secondary")).toBeTruthy();

    const { container } = render(
      <SubmitButton id="test-id" text="test-text-secondary" class={ButtonClass.SECONDARY} />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(0);
  });

  it("renders correctly when button type is WARNING", () => {
    render(<SubmitButton id="test-id" text="test-text-warning" class={ButtonClass.WARNING} />);
    expect(screen.getByText("test-text-warning")).toBeTruthy();

    const { container } = render(
      <SubmitButton id="test-id" text="test-text-warning" class={ButtonClass.WARNING} />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(0);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(1);
  });

  it("renders button with marginTop style", () => {
    render(<SubmitButton id="test-id" text="test-text-default" class={ButtonClass.DEFAULT} />);

    const buttonElement = screen.getByText("test-text-default");
    expect(buttonElement).toHaveStyle("margin-top: 30px");
  });
});
