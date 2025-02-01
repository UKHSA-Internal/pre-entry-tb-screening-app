import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import Dropdown from "./dropdown";

const testOptions = [
  {
    label: "test1",
    value: "testval1",
  },
  {
    label: "test2",
    value: "testval2",
  },
];

type FormValues = { testValue: string };

describe("Dropdown component", () => {
  it("renders correctly when all optional props are specified", () => {
    const DropdownToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Dropdown
            id="test-id"
            label="Test label"
            hint="test hint"
            options={testOptions}
            errorMessage=""
            formValue="testValue"
            required="This is required"
          />
        </FormProvider>
      );
    };
    render(<DropdownToTest />);
    expect(screen.getAllByRole("option")).toBeTruthy();
    expect(screen.getByText("test1")).toBeTruthy();
    expect(screen.getByText("test2")).toBeTruthy();
    expect(screen.getByText("Test label")).toBeTruthy();
  });

  it("renders correctly when all optional props are omitted", () => {
    const DropdownToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Dropdown
            id="test-id"
            options={testOptions}
            errorMessage=""
            formValue="testValue"
            required="This is required"
          />
        </FormProvider>
      );
    };
    render(<DropdownToTest />);
    expect(screen.getAllByRole("option")).toBeTruthy();
    expect(screen.getByText("test1")).toBeTruthy();
    expect(screen.getByText("test2")).toBeTruthy();
  });

  it("renders correctly when in an errored state", () => {
    const DropdownToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Dropdown
            id="test-id"
            options={testOptions}
            errorMessage="test error"
            formValue="testValue"
            required="This is required"
          />
        </FormProvider>
      );
    };
    render(<DropdownToTest />);
    expect(screen.getAllByRole("option")).toBeTruthy();
    expect(screen.getByText("test1")).toBeTruthy();
    expect(screen.getByText("test2")).toBeTruthy();
    expect(screen.getByText("test error")).toBeTruthy();
  });

  it("renders with default value and only updates selected value on change event", () => {
    const DropdownToTest = () => {
      const methods = useForm<FormValues>();
      return (
        <FormProvider {...methods}>
          <Dropdown
            id="test-id"
            label="Test label"
            hint="test hint"
            options={testOptions}
            errorMessage="test error"
            formValue="testValue"
            required="This is required"
          />
        </FormProvider>
      );
    };
    const { container } = render(<DropdownToTest />);

    const select = screen.getAllByRole("combobox")[0];

    let selectedValue = (container.getElementsByClassName("govuk-select")[0] as HTMLSelectElement)
      .value;
    expect(selectedValue).toBe("");

    fireEvent.change(select, {
      target: { value: "testval1" },
    });
    selectedValue = (container.getElementsByClassName("govuk-select")[0] as HTMLSelectElement)
      .value;
    expect(selectedValue).toBe("testval1");

    fireEvent.change(select, {
      target: { value: "testval2" },
    });
    selectedValue = (container.getElementsByClassName("govuk-select")[0] as HTMLSelectElement)
      .value;
    expect(selectedValue).toBe("testval2");
  });
});
