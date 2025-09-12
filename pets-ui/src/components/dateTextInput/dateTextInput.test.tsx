import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";

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

  it("sanitises and clamps day & month inputs correctly", async () => {
    const user = userEvent.setup();
    const Wrapper = () => {
      const [value, setValue] = React.useState({ day: "", month: "", year: "" });
      return (
        <Date
          id="test-date"
          autocomplete={false}
          errorMessage=""
          value={value}
          setDateValue={setValue}
        />
      );
    };
    render(<Wrapper />);

    const dayInput = screen.getByTestId("test-date-day");
    const monthInput = screen.getByTestId("test-date-month");

    await user.type(dayInput, "a");
    expect(dayInput).toHaveValue("");
    await user.type(dayInput, "0");
    expect(dayInput).toHaveValue("1");
    await user.type(dayInput, "9");
    expect(dayInput).toHaveValue("19");

    await user.clear(dayInput);
    await user.paste("a09");
    expect(dayInput).toHaveValue("9");

    await user.clear(dayInput);
    await user.type(dayInput, "32");
    expect(dayInput).toHaveValue("31");

    await user.clear(dayInput);
    await user.paste("00");
    expect(dayInput).toHaveValue("1");

    await user.type(monthInput, "15");
    expect(monthInput).toHaveValue("12");

    await user.clear(monthInput);
    await user.paste("00");
    expect(monthInput).toHaveValue("1");
  });

  it("sanitises year input (digits only, max length 4)", async () => {
    const user = userEvent.setup();
    const Wrapper = () => {
      const [value, setValue] = React.useState({ day: "", month: "", year: "" });
      return (
        <Date
          id="test-year"
          autocomplete={false}
          errorMessage=""
          value={value}
          setDateValue={setValue}
        />
      );
    };
    render(<Wrapper />);

    const yearInput = screen.getByTestId("test-year-year");

    await user.type(yearInput, "20a2b5");
    expect(yearInput).toHaveValue("2025");

    await user.clear(yearInput);
    await user.type(yearInput, "20256");
    expect(yearInput).toHaveValue("2025");

    await user.clear(yearInput);
    await user.type(yearInput, "abcd");
    expect(yearInput).toHaveValue("");
  });

  it("renders quickfill links only when showTodayYesterdayLinks is true", () => {
    const { rerender } = render(
      <Date
        id="quickfill"
        autocomplete={false}
        errorMessage=""
        value={{ day: "", month: "", year: "" }}
        setDateValue={() => {}}
      />,
    );
    expect(screen.queryByTestId("quickfill-quickfill-today")).not.toBeInTheDocument();
    expect(screen.queryByTestId("quickfill-quickfill-yesterday")).not.toBeInTheDocument();

    rerender(
      <Date
        id="quickfill"
        autocomplete={false}
        errorMessage=""
        value={{ day: "", month: "", year: "" }}
        setDateValue={() => {}}
        showTodayYesterdayLinks
      />,
    );
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
  });

  it("quickfill links set date to today and yesterday", async () => {
    const user = userEvent.setup();
    const now = new globalThis.Date();
    const todayDay = now.getDate().toString();
    const todayMonth = (now.getMonth() + 1).toString();
    const todayYear = now.getFullYear().toString();
    const yesterday = new globalThis.Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yDay = yesterday.getDate().toString();
    const yMonth = (yesterday.getMonth() + 1).toString();
    const yYear = yesterday.getFullYear().toString();

    const Wrapper = () => {
      const [value, setValue] = React.useState({ day: "", month: "", year: "" });
      return (
        <Date
          id="refdate"
          autocomplete={false}
          errorMessage=""
          value={value}
          setDateValue={setValue}
          showTodayYesterdayLinks
        />
      );
    };
    render(<Wrapper />);

    const todayLink = screen.getByTestId("refdate-quickfill-today");
    const yesterdayLink = screen.getByTestId("refdate-quickfill-yesterday");
    const dayInput = screen.getByTestId("refdate-day");
    const monthInput = screen.getByTestId("refdate-month");
    const yearInput = screen.getByTestId("refdate-year");

    await user.click(todayLink);
    expect(dayInput).toHaveValue(todayDay);
    expect(monthInput).toHaveValue(todayMonth);
    expect(yearInput).toHaveValue(todayYear);

    await user.click(yesterdayLink);
    expect(dayInput).toHaveValue(yDay);
    expect(monthInput).toHaveValue(yMonth);
    expect(yearInput).toHaveValue(yYear);
  });
});
