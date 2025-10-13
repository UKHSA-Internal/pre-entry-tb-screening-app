import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { RadioIsInline } from "@/utils/enums";

import Radio from "./radio";

type FormValues = { testValue: string };

const DefaultRadioToTest = () => {
  const methods = useForm<FormValues>();
  return (
    <FormProvider {...methods}>
      <Radio
        id="test-id"
        isInline={RadioIsInline.FALSE}
        answerOptions={["zzz Answer One", "aaa Answer Two"]}
        sortAnswersAlphabetically={false}
        errorMessage=""
        formValue="testValue"
        required="This is required."
      />
    </FormProvider>
  );
};

describe("Radio component", () => {
  it("renders correctly when all optional props are specified", () => {
    const RadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Radio
            id="test-id"
            heading="test-heading"
            label="test-label"
            hint="test-hint"
            isInline={RadioIsInline.FALSE}
            answerOptions={["zzz Answer One", "aaa Answer Two"]}
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    render(<RadioToTest />);
    expect(screen.getAllByRole("radio")).toBeTruthy();
    expect(screen.getByText("test-label")).toBeTruthy();
    expect(screen.getByText("test-heading")).toBeTruthy();
    expect(screen.getByText("test-hint")).toBeTruthy();
    expect(screen.getByText("zzz Answer One")).toBeTruthy();
    expect(screen.getByText("aaa Answer Two")).toBeTruthy();
  });

  it("renders correctly when all optional props are omitted", () => {
    render(<DefaultRadioToTest />);
    expect(screen.getAllByRole("radio")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
    expect(screen.getByText("zzz Answer One")).toBeTruthy();
    expect(screen.getByText("aaa Answer Two")).toBeTruthy();
  });

  it("renders correctly when in an errored state", () => {
    const RadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Radio
            id="test-id"
            isInline={RadioIsInline.FALSE}
            answerOptions={["zzz Answer One", "aaa Answer Two"]}
            sortAnswersAlphabetically={false}
            errorMessage="test error"
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    render(<RadioToTest />);
    expect(screen.getAllByRole("radio")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
    expect(screen.queryByText("test error")).toBeTruthy();
    expect(screen.getByText("zzz Answer One")).toBeTruthy();
    expect(screen.getByText("aaa Answer Two")).toBeTruthy();
  });

  it("is not inline when props.isInline is FALSE", () => {
    const { container } = render(<DefaultRadioToTest />);
    expect(container.getElementsByClassName("govuk-radios")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-radios--inline")).toHaveLength(0);
  });

  it("is inline when props.isInline is TRUE", () => {
    const RadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Radio
            id="test-id"
            isInline={RadioIsInline.TRUE}
            answerOptions={["zzz Answer One", "aaa Answer Two"]}
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    const { container } = render(<RadioToTest />);
    expect(container.getElementsByClassName("govuk-radios")).toHaveLength(1);
    expect(container.getElementsByClassName("govuk-radios--inline")).toHaveLength(1);
  });

  it("orders answers in the order specified when props.sortAnswersAlphabetically is false", () => {
    render(<DefaultRadioToTest />);
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("value", "zzz Answer One");
    expect(screen.getAllByRole("radio")[1]).toHaveAttribute("value", "aaa Answer Two");
  });

  it("orders answers alphabetically when props.sortAnswersAlphabetically is true", () => {
    const RadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Radio
            id="test-id"
            isInline={RadioIsInline.FALSE}
            answerOptions={["zzz Answer One", "aaa Answer Two"]}
            sortAnswersAlphabetically={true}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    render(<RadioToTest />);
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("value", "aaa Answer Two");
    expect(screen.getAllByRole("radio")[1]).toHaveAttribute("value", "zzz Answer One");
  });

  it("renders with no answer selected and only selects a single answer at a time", () => {
    render(<DefaultRadioToTest />);
    const radioOne = screen.getAllByRole("radio")[0];
    const radioTwo = screen.getAllByRole("radio")[1];

    expect(radioOne).not.toBeChecked();
    expect(radioTwo).not.toBeChecked();

    fireEvent.click(radioOne);
    expect(radioOne).toBeChecked();
    expect(radioTwo).not.toBeChecked();

    fireEvent.click(radioTwo);
    expect(radioOne).not.toBeChecked();
    expect(radioTwo).toBeChecked();

    fireEvent.click(radioOne);
    expect(radioOne).toBeChecked();
    expect(radioTwo).not.toBeChecked();
  });

  it("renders exclusive answer options with divider", () => {
    const RadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Radio
            id="test-id"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Answer One", "Answer Two"]}
            exclusiveAnswerOptions={["None of the above"]}
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    const { container } = render(<RadioToTest />);

    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByText("Answer One")).toBeTruthy();
    expect(screen.getByText("Answer Two")).toBeTruthy();
    expect(screen.getByText("None of the above")).toBeTruthy();
    expect(container.getElementsByClassName("govuk-radios__divider")).toHaveLength(1);
    expect(screen.getByText("or")).toBeTruthy();
  });
});
