import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import * as api from "@/api/api";
import ContactDetailsPage from "@/pages/contact-details";
import ApplicantForm from "@/sections/applicant-details-form";
import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

const preloadedState = {
  applicant: {
    status: ApplicationStatus.NOT_YET_STARTED,
    fullName: "",
    sex: "",
    dateOfBirth: {
      year: "",
      month: "",
      day: "",
    },
    countryOfNationality: "",
    passportNumber: "12345",
    countryOfIssue: "BRB",
    passportIssueDate: {
      year: "",
      month: "",
      day: "",
    },
    passportExpiryDate: {
      year: "",
      month: "",
      day: "",
    },
    applicantHomeAddress1: "",
    applicantHomeAddress2: "",
    applicantHomeAddress3: "",
    townOrCity: "",
    provinceOrState: "",
    country: "",
    postcode: "",
    applicantPhotoFileName: "",
  },
};

describe("ApplicantForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantForm is not filled then errors are displayed", async () => {
    renderWithProviders(<ApplicantForm />, { preloadedState });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));

    expect(screen.getAllByText("Enter the applicant's full name")).toHaveLength(2);
    expect(screen.getAllByText("Select the applicant's sex")).toHaveLength(2);
    expect(screen.getAllByText("Select the country of nationality")).toHaveLength(2);
    expect(screen.getAllByText("Date of birth must include a day, month and year")).toHaveLength(2);
    expect(
      screen.getAllByText("Passport issue date must include a day, month and year"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Passport expiry date must include a day, month and year"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Enter the first line of the applicant's home address"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Enter the town or city of the applicant's home address"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Enter the province or state of the applicant's home address"),
    ).toHaveLength(2);
    expect(screen.getAllByText("Enter the country of the applicant's home address")).toHaveLength(
      2,
    );
  });

  it("when ApplicantForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantForm />);

    await user.type(screen.getByTestId("name"), "Sigmund Sigmundson");
    await user.click(screen.getAllByTestId("sex")[1]);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "NOR" } });
    await user.type(screen.getByTestId("birth-date-day"), "1");
    await user.type(screen.getByTestId("birth-date-month"), "1");
    await user.type(screen.getByTestId("birth-date-year"), "1901");
    await user.type(screen.getByTestId("passport-number"), "1234");
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "FIN" } });
    await user.type(screen.getByTestId("passport-issue-date-day"), "2");
    await user.type(screen.getByTestId("passport-issue-date-month"), "2");
    await user.type(screen.getByTestId("passport-issue-date-year"), "1902");
    await user.type(screen.getByTestId("passport-expiry-date-day"), "3");
    await user.type(screen.getByTestId("passport-expiry-date-month"), "3");
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
    expect(screen.getByTestId("passport-issue-date-month")).toHaveValue("2");
    expect(screen.getByTestId("passport-issue-date-year")).toHaveValue("1902");
    expect(screen.getByTestId("passport-expiry-date-day")).toHaveValue("3");
    expect(screen.getByTestId("passport-expiry-date-month")).toHaveValue("3");
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
      status: "In progress",
      fullName: "Sigmund Sigmundson",
      sex: "Male",
      dateOfBirth: { day: "1", month: "1", year: "1901" },
      countryOfNationality: "NOR",
      passportNumber: "1234",
      countryOfIssue: "FIN",
      passportIssueDate: { day: "2", month: "2", year: "1902" },
      passportExpiryDate: { day: "3", month: "3", year: "2053" },
      applicantHomeAddress1: "The Bell Tower",
      applicantHomeAddress2: "Hallgrimskirkja",
      applicantHomeAddress3: "Hallgrimstorg 1",
      townOrCity: "Reykjavik",
      provinceOrState: "Reykjavik",
      country: "ISL",
      postcode: "101",
      applicantPhotoFileName: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/upload-visa-applicant-photo");
  });

  it("errors when applicant details are missing", async () => {
    renderWithProviders(<ApplicantForm />);

    const submitButton = screen.getByRole("button", { name: /Save and Continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Enter the applicant's full name",
      "Error: Select the applicant's sex",
      "Error: Select the country of nationality",
      "Error: Date of birth must include a day, month and year",
      "Error: Enter the applicant's passport number",
      "Error: Select the country of issue",
      "Error: Passport issue date must include a day, month and year",
      "Error: Passport expiry date must include a day, month and year",
      "Error: Enter the first line of the applicant's home address",
      "Error: Enter the town or city of the applicant's home address",
      "Error: Enter the province or state of the applicant's home address",
      "Error: Enter the country of the applicant's home address",
    ];

    await waitFor(() => {
      errorMessages.forEach((error) => {
        expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
        expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
      });
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<ApplicantForm />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to applicant results page", () => {
    renderWithProviders(<ContactDetailsPage />);
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "/do-you-have-visa-applicant-written-consent-for-tb-screening",
    );
    expect(link).toHaveClass("govuk-back-link");
  });

  it("back link points to TB summary when applicant status is COMPLETE", () => {
    const completeState = {
      ...preloadedState,
      applicant: {
        ...preloadedState.applicant,
        status: ApplicationStatus.COMPLETE,
      },
    };
    window.history.pushState({}, "", "/?from=tb-certificate-summary");
    renderWithProviders(<ContactDetailsPage />, { preloadedState: completeState });
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/tb-certificate-summary");
  });

  it("preserves applicantPhotoFileName when updating form data", async () => {
    const stateWithPhoto = {
      ...preloadedState,
      applicant: {
        ...preloadedState.applicant,
        applicantPhotoFileName: "test-photo.jpg",
      },
    };
    const { store } = renderWithProviders(<ApplicantForm />, { preloadedState: stateWithPhoto });

    await user.type(screen.getByTestId("name"), "John Smith");
    await user.click(screen.getAllByTestId("sex")[0]);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "GBR" } });
    await user.type(screen.getByTestId("birth-date-day"), "1");
    await user.type(screen.getByTestId("birth-date-month"), "1");
    await user.type(screen.getByTestId("birth-date-year"), "1970");
    await user.type(screen.getByTestId("passport-number"), "ABC123");
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "GBR" } });
    await user.type(screen.getByTestId("passport-issue-date-day"), "1");
    await user.type(screen.getByTestId("passport-issue-date-month"), "1");
    await user.type(screen.getByTestId("passport-issue-date-year"), "2020");
    await user.type(screen.getByTestId("passport-expiry-date-day"), "1");
    await user.type(screen.getByTestId("passport-expiry-date-month"), "1");
    await user.type(screen.getByTestId("passport-expiry-date-year"), "2030");
    await user.type(screen.getByTestId("address-1"), "1 Street");
    await user.type(screen.getByTestId("town-or-city"), "London");
    await user.type(screen.getByTestId("province-or-state"), "London");
    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "GBR" } });

    await user.click(screen.getByRole("button"));

    expect(store.getState().applicant.applicantPhotoFileName).toBe("test-photo.jpg");
  });

  it("updates slice and navigates to TB summary when editing in COMPLETE status", async () => {
    vi.spyOn(api, "putApplicantDetails").mockResolvedValue({
      status: 200,
      statusText: "OK",
    });
    const completeState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      applicant: {
        status: ApplicationStatus.COMPLETE,
        fullName: "John Smith",
        sex: "Male",
        dateOfBirth: { year: "1970", month: "1", day: "1" },
        countryOfNationality: "GBR",
        passportNumber: "12345",
        countryOfIssue: "GBR",
        passportIssueDate: { year: "2020", month: "1", day: "1" },
        passportExpiryDate: { year: "2030", month: "1", day: "1" },
        applicantHomeAddress1: "1 Street",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "London",
        provinceOrState: "London",
        country: "GBR",
        postcode: "0000 111",
        applicantPhotoFileName: "photo.jpg",
      },
    };
    window.history.pushState(
      {},
      "",
      "/visa-applicant-passport-information?from=tb-certificate-summary#name",
    );
    const { store } = renderWithProviders(<ApplicantForm />, { preloadedState: completeState });

    await user.clear(screen.getByTestId("name"));
    await user.type(screen.getByTestId("name"), "Jeff Smith");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(store.getState().applicant.fullName).toBe("Jeff Smith");
      expect(store.getState().applicant.status).toBe(ApplicationStatus.COMPLETE);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-certificate-summary");
    });
  });

  it("hides passport number and country of issue fields when status is COMPLETE and shows static summary", () => {
    const completeState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      applicant: {
        status: ApplicationStatus.COMPLETE,
        fullName: "John Smith",
        sex: "Male",
        dateOfBirth: { year: "1970", month: "1", day: "1" },
        countryOfNationality: "GBR",
        passportNumber: "1234",
        countryOfIssue: "GBR",
        passportIssueDate: { year: "2020", month: "1", day: "1" },
        passportExpiryDate: { year: "2030", month: "1", day: "1" },
        applicantHomeAddress1: "1 Street",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "London",
        provinceOrState: "London",
        country: "GBR",
        postcode: "0000 111",
        applicantPhotoFileName: "photo.jpg",
      },
    };

    renderWithProviders(<ApplicantForm />, { preloadedState: completeState });

    expect(screen.queryByTestId("passport-number")).not.toBeInTheDocument();
    expect(screen.getAllByRole("combobox").length).toBe(2);

    expect(screen.getByText("Passport number")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
    expect(screen.getByText("Country of issue")).toBeInTheDocument();
    const countryOfIssueRow = screen
      .getByText("Country of issue")
      .closest(".govuk-summary-list__row") as HTMLElement;
    expect(
      within(countryOfIssueRow).getByText(
        "United Kingdom of Great Britain and Northern Ireland (the)",
      ),
    ).toBeInTheDocument();
  });
});
