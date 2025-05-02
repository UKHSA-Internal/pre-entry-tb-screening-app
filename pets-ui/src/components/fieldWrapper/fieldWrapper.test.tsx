import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FieldWrapper from "./fieldWrapper";

const baseProps = {
  id: "test-id",
  errorMessage: "",
};

describe("FieldWrapper", () => {
  it("renders with fieldset when useFieldset is true (default)", () => {
    render(
      <FieldWrapper {...baseProps} heading="Test Heading">
        <div>Child content</div>
      </FieldWrapper>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument(); // fieldset gets group role
    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders without fieldset when useFieldset is false", () => {
    render(
      <FieldWrapper {...baseProps} useFieldset={false}>
        <div>Child content</div>
      </FieldWrapper>,
    );
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(
      <FieldWrapper {...baseProps} heading="Heading" label="Label text">
        <div />
      </FieldWrapper>,
    );
    expect(screen.getByText("Label text")).toBeInTheDocument();
  });

  it("renders hint and sets aria-describedby to hint id", () => {
    render(
      <FieldWrapper {...baseProps} heading="Heading" hint="Helpful hint">
        <div>Child content</div>
      </FieldWrapper>,
    );
    expect(screen.getByText("Helpful hint")).toBeInTheDocument();
    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("aria-describedby", "test-id-hint");
  });

  it("renders error message and adds error class", () => {
    render(
      <FieldWrapper {...baseProps} heading="Heading" errorMessage="This is an error">
        <div />
      </FieldWrapper>,
    );
    expect(screen.getByText("This is an error")).toBeInTheDocument();
    const wrapperDiv = screen.getByRole("group").parentElement;
    expect(wrapperDiv?.className).toContain("govuk-form-group--error");
  });

  it("does not duplicate error message inside fieldset and wrapper", () => {
    render(
      <FieldWrapper {...baseProps} useFieldset heading="Heading" errorMessage="Error test">
        <div />
      </FieldWrapper>,
    );
    const errorMessages = screen.getAllByText(/Error:/);
    expect(errorMessages).toHaveLength(1);
  });

  it("renders children correctly", () => {
    render(
      <FieldWrapper {...baseProps}>
        <button>Submit</button>
      </FieldWrapper>,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("uses label id when no hint is provided", () => {
    render(
      <FieldWrapper {...baseProps} heading="Heading" label="Some label">
        <div />
      </FieldWrapper>,
    );
    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("aria-describedby", "test-id-label");
  });

  it("does not render heading if not provided", () => {
    render(
      <FieldWrapper {...baseProps} label="Label">
        <div />
      </FieldWrapper>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Label")).toBeInTheDocument();
  });
});
