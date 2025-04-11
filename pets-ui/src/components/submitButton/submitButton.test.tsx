import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonType } from "@/utils/enums";

import SubmitButton from "./submitButton";

describe("Button component", () => {
  it("renders correctly when button type is DEFAULT", () => {
    render(<SubmitButton id="test-id" text="test-text-default" type={ButtonType.DEFAULT} />);
    expect(screen.getByText("test-text-default")).toBeTruthy();

    const { container } = render(
      <SubmitButton id="test-id" text="test-text-default" type={ButtonType.DEFAULT} />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(0);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(0);
  });

  it("renders correctly when button type is SECONDARY", () => {
    render(<SubmitButton id="test-id" text="test-text-secondary" type={ButtonType.SECONDARY} />);
    expect(screen.getByText("test-text-secondary")).toBeTruthy();

    const { container } = render(
      <SubmitButton id="test-id" text="test-text-secondary" type={ButtonType.SECONDARY} />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(0);
  });

  it("renders correctly when button type is WARNING", () => {
    render(<SubmitButton id="test-id" text="test-text-warning" type={ButtonType.WARNING} />);
    expect(screen.getByText("test-text-warning")).toBeTruthy();

    const { container } = render(
      <SubmitButton id="test-id" text="test-text-warning" type={ButtonType.WARNING} />,
    );
    expect(container.getElementsByClassName("govuk-button")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-button--secondary")).toHaveLength(0);
    expect(container.getElementsByClassName("govuk-button--warning")).toHaveLength(1);
  });

  it("renders button with marginTop style", () => {
    render(<SubmitButton id="test-id" text="test-text-default" type={ButtonType.DEFAULT} />);

    const buttonElement = screen.getByText("test-text-default");
    expect(buttonElement).toHaveStyle("margin-top: 30px");
  });
});
