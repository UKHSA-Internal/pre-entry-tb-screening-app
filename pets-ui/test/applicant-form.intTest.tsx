import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ApplicantForm from "@/sections/applicant-details-form";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("ApplicantForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  test("when ApplicantForm is not filled then errors are displayed", async () => {
    renderWithProviders(
      <Router>
        <ApplicantForm />
      </Router>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));

    expect(screen.getAllByText("Enter the applicant's full name.")).toHaveLength(2);
    expect(screen.getAllByText("Select the applicant's sex.")).toHaveLength(2);
    expect(screen.getAllByText("Select the country of nationality.")).toHaveLength(2);
    expect(screen.getAllByText("Date of birth must include a day, month and year")).toHaveLength(2);
    expect(screen.getAllByText("Enter the applicant's passport number.")).toHaveLength(2);
    expect(screen.getAllByText("Select the country of issue.")).toHaveLength(2);
    expect(
      screen.getAllByText("Passport issue date must include a day, month and year"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Passport expiry date must include a day, month and year"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Enter the first line of the applicant's home address."),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Enter the town or city of the applicant's home address."),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Enter the province or state of the applicant's home address."),
    ).toHaveLength(2);
    expect(screen.getAllByText("Enter the country of the applicant's home address.")).toHaveLength(
      2,
    );
  });

  test("when ApplicantForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantForm />
      </Router>,
    );

    const user = userEvent.setup();

    await user.type(screen.getByTestId("name"), "Sigmund Sigmundson");
    await user.click(screen.getAllByTestId("sex")[1]);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "NOR" } });
    await user.type(screen.getByTestId("birth-date-day"), "1");
    await user.type(screen.getByTestId("birth-date-month"), "1");
    await user.type(screen.getByTestId("birth-date-year"), "1901");
    await user.type(screen.getByTestId("passport-number"), "1234");
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "FIN" } });
    await user.type(screen.getByTestId("passport-issue-date-day"), "2");
    await user.type(screen.getByTestId("passport-issue-date-month"), "feb");
    await user.type(screen.getByTestId("passport-issue-date-year"), "1902");
    await user.type(screen.getByTestId("passport-expiry-date-day"), "3");
    await user.type(screen.getByTestId("passport-expiry-date-month"), "march");
    await user.type(screen.getByTestId("passport-expiry-date-year"), "2053");
    await user.type(screen.getByTestId("address-1"), "The Bell Tower");
    await user.type(screen.getByTestId("address-2"), "Hallgrimskirkja");
    await user.type(screen.getByTestId("address-3"), "Hallgrimstorg 1");
    await user.type(screen.getByTestId("town-or-city"), "Reykjavik");
    await user.type(screen.getByTestId("province-or-state"), "Reykjavik");
    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "ISL" } });
    await user.type(screen.getByTestId("postcode"), "101");

    expect(screen.getByTestId("name")).toHaveValue("Sigmund Sigmundson");
    expect(screen.getAllByTestId("sex")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("sex")[1]).toBeChecked();
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("NOR");
    expect(screen.getByTestId("birth-date-day")).toHaveValue("1");
    expect(screen.getByTestId("birth-date-month")).toHaveValue("1");
    expect(screen.getByTestId("birth-date-year")).toHaveValue("1901");
    expect(screen.getByTestId("passport-number")).toHaveValue("1234");
    expect(screen.getAllByRole("combobox")[1]).toHaveValue("FIN");
    expect(screen.getByTestId("passport-issue-date-day")).toHaveValue("2");
    expect(screen.getByTestId("passport-issue-date-month")).toHaveValue("feb");
    expect(screen.getByTestId("passport-issue-date-year")).toHaveValue("1902");
    expect(screen.getByTestId("passport-expiry-date-day")).toHaveValue("3");
    expect(screen.getByTestId("passport-expiry-date-month")).toHaveValue("march");
    expect(screen.getByTestId("passport-expiry-date-year")).toHaveValue("2053");
    expect(screen.getByTestId("address-1")).toHaveValue("The Bell Tower");
    expect(screen.getByTestId("address-2")).toHaveValue("Hallgrimskirkja");
    expect(screen.getByTestId("address-3")).toHaveValue("Hallgrimstorg 1");
    expect(screen.getByTestId("town-or-city")).toHaveValue("Reykjavik");
    expect(screen.getByTestId("province-or-state")).toHaveValue("Reykjavik");
    expect(screen.getAllByRole("combobox")[2]).toHaveValue("ISL");
    expect(screen.getByTestId("postcode")).toHaveValue("101");

    await user.click(screen.getByRole("button"));

    expect(store.getState().applicant).toEqual({
      status: "Incomplete",
      fullName: "Sigmund Sigmundson",
      sex: "Male",
      dateOfBirth: { day: "1", month: "1", year: "1901" },
      countryOfNationality: "NOR",
      passportNumber: "1234",
      countryOfIssue: "FIN",
      passportIssueDate: { day: "2", month: "feb", year: "1902" },
      passportExpiryDate: { day: "3", month: "march", year: "2053" },
      applicantHomeAddress1: "The Bell Tower",
      applicantHomeAddress2: "Hallgrimskirkja",
      applicantHomeAddress3: "Hallgrimstorg 1",
      townOrCity: "Reykjavik",
      provinceOrState: "Reykjavik",
      country: "ISL",
      postcode: "101",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/applicant-summary");
  });
});
