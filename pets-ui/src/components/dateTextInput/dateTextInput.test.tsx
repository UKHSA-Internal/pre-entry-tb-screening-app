import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Date from "./dateTextInput";

describe("Date Component", () => {
  it("renders correctly when all optional props are specified", () => {
    render(
      <Date
        id="passport-issue-date"
        label="Issue Date"
        hint="For example, 31 3 2019"
        autocomplete={false}
        errorMessage=""
        value={{ year: "2000", month: "12", day: "31" }}
        setDateValue={() => {}}
      />,
    );
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.getByText("Issue Date")).toBeTruthy();
    expect(screen.getByText("For example, 31 3 2019")).toBeTruthy();
  });

  it("renders correctly when all optional props are omitted", () => {
    render(
      <Date
        id="passport-issue-date"
        autocomplete={false}
        errorMessage=""
        value={{ year: "2000", month: "12", day: "31" }}
        setDateValue={() => {}}
      />,
    );
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.queryByText("Issue Date")).toBeNull();
    expect(screen.queryByText("tFor example, 31 3 2019")).toBeNull();
    expect(screen.queryByText("Test legend")).toBeNull();
  });

  it("renders correctly when in an errored state", () => {
    render(
      <Date
        id="passport-issue-date"
        autocomplete={false}
        errorMessage="test error"
        value={{ year: "2000", month: "12", day: "31" }}
        setDateValue={() => {}}
      />,
    );
    expect(screen.getAllByRole("textbox")).toBeTruthy();
    expect(screen.queryByText("Issue Date")).toBeNull();
    expect(screen.queryByText("tFor example, 31 3 2019")).toBeNull();
    expect(screen.queryByText("Test legend")).toBeNull();
    expect(screen.queryByText("test error")).toBeTruthy();
  });

  it("does not set bday autocomplete when autocomplete is false", () => {
    const { container } = render(
      <Date
        id="passport-issue-date"
        autocomplete={false}
        errorMessage=""
        value={{ year: "2000", month: "12", day: "31" }}
        setDateValue={() => {}}
      />,
    );
    const dateInputs = container.getElementsByClassName("govuk-input");
    expect(dateInputs.length).toBe(3);
    expect(dateInputs[0].getAttribute("autocomplete")).toBeNull();
    expect(dateInputs[1].getAttribute("autocomplete")).toBeNull();
    expect(dateInputs[2].getAttribute("autocomplete")).toBeNull();
  });

  it("sets bday autocomplete when autocomplete prop is true", () => {
    const { container } = render(
      <Date
        id="passport-issue-date"
        autocomplete={true}
        errorMessage=""
        value={{ year: "2000", month: "12", day: "31" }}
        setDateValue={() => {}}
      />,
    );
    expect(container.getElementsByClassName("govuk-input").length).toBe(3);
    const dayInput = container.querySelector('[autocomplete="bday-day"]');
    const monthInput = container.querySelector('[autocomplete="bday-month"]');
    const yearInput = container.querySelector('[autocomplete="bday-year"]');
    expect(dayInput).toHaveClass("govuk-input--width-2");
    expect(monthInput).toHaveClass("govuk-input--width-2");
    expect(yearInput).toHaveClass("govuk-input--width-4");
  });

  it("handles today and yesterday quickfill links", () => {
    const mockSetDateValue = vi.fn();
    render(
      <Date
        id="test-date"
        autocomplete={false}
        errorMessage=""
        value={{ year: "", month: "", day: "" }}
        setDateValue={mockSetDateValue}
        showTodayYesterdayLinks={true}
      />,
    );

    const today = new globalThis.Date();
    screen.getByTestId("test-date-quickfill-today").click();
    expect(mockSetDateValue).toHaveBeenCalledWith({
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
    });

    mockSetDateValue.mockClear();
    const yesterday = new globalThis.Date();
    yesterday.setDate(yesterday.getDate() - 1);
    screen.getByTestId("test-date-quickfill-yesterday").click();
    expect(mockSetDateValue).toHaveBeenCalledWith({
      day: yesterday.getDate().toString(),
      month: (yesterday.getMonth() + 1).toString(),
      year: yesterday.getFullYear().toString(),
    });
  });
});
