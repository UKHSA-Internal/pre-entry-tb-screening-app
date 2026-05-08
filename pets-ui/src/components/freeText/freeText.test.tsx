import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import FreeText from "./freeText";

const testRegex = {
  lettersAndNumbers: /^[A-Za-z0-9]+$/,
};

type FormValues = { testValue: string };

describe("FreeText component", () => {
  it("renders correctly when all attributes are specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            label="test-label"
            hint="test-hint"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
            suffixText="test-suffix"
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByText("test-label")).toBeTruthy();
    expect(screen.getByText("test-hint")).toBeTruthy();
    expect(screen.getByText("test-suffix")).toBeTruthy();
  });

  it("renders correctly when all optional attributes are omitted", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
  });

  it("renders correctly when in an errored state", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage="test error"
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
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

  it("input type is overridden when inputTypeOverride is specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
            inputTypeOverride="email"
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("input type is correct when inputTypeOverride is not specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("autocomplete is disabled when disableAutocomplete is specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
            disableAutocomplete
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toHaveAttribute("autocomplete", "off");
  });

  it("autocomplete is not set when disableAutocomplete is not specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("autocomplete");
  });

  it("spellcheck is disabled when disableSpellcheck is specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
            disableSpellcheck
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).toHaveAttribute("spellcheck", "false");
  });

  it("spellcheck is not set when disableSpellcheck is not specified", () => {
    const FreetextToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <FreeText
            id="test-id"
            errorMessage=""
            formValue="testValue"
            required="This is required."
            patternValue={testRegex.lettersAndNumbers}
            patternError="Pattern error"
          />
        </FormProvider>
      );
    };
    render(<FreetextToTest />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("spellcheck");
  });
});
