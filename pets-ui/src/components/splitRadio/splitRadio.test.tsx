import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { RadioIsInline } from "@/utils/enums";

import SplitRadio from "./splitRadio";

type FormValues = { testValue: string };

const DefaultSplitRadioToTest = () => {
  const methods = useForm<FormValues>();
  return (
    <FormProvider {...methods}>
      <SplitRadio
        id="test-id"
        isInline={RadioIsInline.FALSE}
        answerOptionsOne={["zzz Answer One", "aaa Answer Two"]}
        answerOptionsTwo={["zzz Answer Three", "aaa Answer Four"]}
        sortAnswersAlphabetically={false}
        errorMessage=""
        formValue="testValue"
        required="This is required."
      />
    </FormProvider>
  );
};

describe("SplitRadio component", () => {
  it("renders correctly when all optional props are specified", () => {
    const SplitRadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <SplitRadio
            id="test-id"
            heading="test-heading"
            label="test-label"
            hintOne="test-hint-one"
            hintTwo="test-hint-two"
            isInline={RadioIsInline.FALSE}
            answerOptionsOne={["zzz Answer One", "aaa Answer Two"]}
            answerOptionsTwo={["zzz Answer Three", "aaa Answer Four"]}
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    render(<SplitRadioToTest />);
    expect(screen.getAllByRole("radio")).toBeTruthy();
    expect(screen.getByText("test-label")).toBeTruthy();
    expect(screen.getByText("test-heading")).toBeTruthy();
    expect(screen.getByText("test-hint-one")).toBeTruthy();
    expect(screen.getByText("test-hint-two")).toBeTruthy();
    expect(screen.getByText("zzz Answer Three")).toBeTruthy();
    expect(screen.getByText("aaa Answer Four")).toBeTruthy();
  });

  it("renders correctly when all optional props are omitted", () => {
    render(<DefaultSplitRadioToTest />);
    expect(screen.getAllByRole("radio")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
    expect(screen.getByText("zzz Answer One")).toBeTruthy();
    expect(screen.getByText("aaa Answer Two")).toBeTruthy();
  });

  it("renders correctly when in an errored state", () => {
    const SplitRadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <SplitRadio
            id="test-id"
            isInline={RadioIsInline.FALSE}
            answerOptionsOne={["zzz Answer One", "aaa Answer Two"]}
            answerOptionsTwo={["zzz Answer Three", "aaa Answer Four"]}
            sortAnswersAlphabetically={false}
            errorMessage="test error"
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    render(<SplitRadioToTest />);
    expect(screen.getAllByRole("radio")).toBeTruthy();
    expect(screen.queryByText("test-label")).toBeNull();
    expect(screen.queryByText("test-hint")).toBeNull();
    expect(screen.queryByText("test error")).toBeTruthy();
    expect(screen.getByText("zzz Answer One")).toBeTruthy();
    expect(screen.getByText("aaa Answer Two")).toBeTruthy();
    expect(screen.getByText("zzz Answer Three")).toBeTruthy();
    expect(screen.getByText("aaa Answer Four")).toBeTruthy();
  });

  it("is not inline when props.isInline is FALSE", () => {
    const { container } = render(<DefaultSplitRadioToTest />);
    expect(container.getElementsByClassName("govuk-radios")).toHaveLength(2);
    expect(container.getElementsByClassName("govuk-radios--inline")).toHaveLength(0);
  });

  it("is inline when props.isInline is TRUE", () => {
    const SplitRadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <SplitRadio
            id="test-id"
            isInline={RadioIsInline.TRUE}
            answerOptionsOne={["zzz Answer One", "aaa Answer Two"]}
            answerOptionsTwo={["zzz Answer Three", "aaa Answer Four"]}
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    const { container } = render(<SplitRadioToTest />);
    expect(container.getElementsByClassName("govuk-radios")).toHaveLength(2);
    expect(container.getElementsByClassName("govuk-radios--inline")).toHaveLength(2);
  });

  it("orders answers in the order specified when props.sortAnswersAlphabetically is false", () => {
    render(<DefaultSplitRadioToTest />);
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("value", "zzz Answer One");
    expect(screen.getAllByRole("radio")[1]).toHaveAttribute("value", "aaa Answer Two");
    expect(screen.getAllByRole("radio")[2]).toHaveAttribute("value", "zzz Answer Three");
    expect(screen.getAllByRole("radio")[3]).toHaveAttribute("value", "aaa Answer Four");
  });

  it("orders answers alphabetically when props.sortAnswersAlphabetically is true", () => {
    const SplitRadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <SplitRadio
            id="test-id"
            isInline={RadioIsInline.FALSE}
            answerOptionsOne={["zzz Answer One", "aaa Answer Two"]}
            answerOptionsTwo={["zzz Answer Three", "aaa Answer Four"]}
            sortAnswersAlphabetically={true}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    render(<SplitRadioToTest />);
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("value", "aaa Answer Two");
    expect(screen.getAllByRole("radio")[1]).toHaveAttribute("value", "zzz Answer One");
    expect(screen.getAllByRole("radio")[2]).toHaveAttribute("value", "aaa Answer Four");
    expect(screen.getAllByRole("radio")[3]).toHaveAttribute("value", "zzz Answer Three");
  });

  it("renders with no answer selected and only selects a single answer at a time", () => {
    render(<DefaultSplitRadioToTest />);
    const radioOne = screen.getAllByRole("radio")[0];
    const radioTwo = screen.getAllByRole("radio")[1];
    const radioThree = screen.getAllByRole("radio")[2];
    const radioFour = screen.getAllByRole("radio")[3];

    expect(radioOne).not.toBeChecked();
    expect(radioTwo).not.toBeChecked();
    expect(radioThree).not.toBeChecked();
    expect(radioFour).not.toBeChecked();

    fireEvent.click(radioOne);
    expect(radioOne).toBeChecked();
    expect(radioTwo).not.toBeChecked();
    expect(radioThree).not.toBeChecked();
    expect(radioFour).not.toBeChecked();

    fireEvent.click(radioTwo);
    expect(radioOne).not.toBeChecked();
    expect(radioTwo).toBeChecked();
    expect(radioThree).not.toBeChecked();
    expect(radioFour).not.toBeChecked();

    fireEvent.click(radioThree);
    expect(radioOne).not.toBeChecked();
    expect(radioTwo).not.toBeChecked();
    expect(radioThree).toBeChecked();
    expect(radioFour).not.toBeChecked();

    fireEvent.click(radioFour);
    expect(radioOne).not.toBeChecked();
    expect(radioTwo).not.toBeChecked();
    expect(radioThree).not.toBeChecked();
    expect(radioFour).toBeChecked();

    fireEvent.click(radioOne);
    expect(radioOne).toBeChecked();
    expect(radioTwo).not.toBeChecked();
    expect(radioThree).not.toBeChecked();
    expect(radioFour).not.toBeChecked();
  });

  it("renders exclusive answer options with divider", () => {
    const SplitRadioToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <SplitRadio
            id="test-id"
            isInline={RadioIsInline.FALSE}
            answerOptionsOne={["zzz Answer One", "aaa Answer Two"]}
            answerOptionsTwo={["zzz Answer Three", "aaa Answer Four"]}
            exclusiveAnswerOptionsOne={["None of the above (one)"]}
            exclusiveAnswerOptionsTwo={["None of the above (two)"]}
            sortAnswersAlphabetically={false}
            errorMessage=""
            formValue="testValue"
            required="This is required."
          />
        </FormProvider>
      );
    };
    const { container } = render(<SplitRadioToTest />);

    expect(screen.getAllByRole("radio")).toHaveLength(6);
    expect(screen.getByText("zzz Answer One")).toBeTruthy();
    expect(screen.getByText("aaa Answer Two")).toBeTruthy();
    expect(screen.getByText("zzz Answer Three")).toBeTruthy();
    expect(screen.getByText("aaa Answer Four")).toBeTruthy();
    expect(screen.getByText("None of the above (one)")).toBeTruthy();
    expect(screen.getByText("None of the above (two)")).toBeTruthy();
    expect(container.getElementsByClassName("govuk-radios__divider")).toHaveLength(2);
    expect(screen.getAllByText("or")).toHaveLength(2);
  });
});
