import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import TextArea from "./textArea";

type FormValues = { testValue: string };

describe("TextArea component", () => {
  it("renders correctly when all attributes are specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <TextArea
            id="test-id"
            label="test-label"
            hint="test-hint"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            rows={10}
            maxWordCount={999}
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByText("test-label")).toBeTruthy();
    expect(screen.getByText("test-hint")).toBeTruthy();
    expect(screen.getByText("You can enter up to 999 words")).toHaveClass("govuk-visually-hidden");
    expect(screen.getByText("You have 999 words remaining")).toBeTruthy();
  });

  it("renders correctly when all optional attributes are omitted", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <TextArea
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            rows={10}
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
    expect(screen.getByText("You can enter up to 150 words")).toHaveClass("govuk-visually-hidden");
    expect(screen.getByText("You have 150 words remaining")).toBeTruthy();
  });

  it("renders correctly when in an errored state", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <TextArea
            id="test-id"
            errorMessage="test error"
            formValue="testValue"
            required="This is required."
            rows={10}
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
    expect(screen.queryByText("test error")).toBeTruthy();
  });

  it("renders correct word count text with different input lengths", async () => {
    const user = userEvent.setup();
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <TextArea
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            rows={10}
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByText("You have 150 words remaining")).toBeTruthy();

    const textArea = screen.getByRole("textbox");
    await user.type(textArea, " This is a test string ");

    expect(screen.getByText("You have 145 words remaining")).toBeInTheDocument();
  });

  it("renders correct word count text with custom max word count & different input lengths", async () => {
    const user = userEvent.setup();
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <TextArea
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            rows={10}
            maxWordCount={10}
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    const textArea = screen.getByRole("textbox");
    expect(screen.getByText("You have 10 words remaining")).toBeTruthy();

    await user.type(textArea, "This is a test string, ");
    expect(screen.getByText("You have 5 words remaining")).toBeInTheDocument();
    await user.type(textArea, "this is another string,");
    expect(screen.getByText("You have 1 word remaining")).toBeInTheDocument();
    await user.type(textArea, " and ");
    expect(screen.getByText("You have 0 words remaining")).toBeInTheDocument();
    await user.type(textArea, "another one.");
    expect(screen.getByText("You have 2 words too many")).toBeInTheDocument();
  });
});
