import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import * as api from "@/api/api";
import ApplicantPassportDetailsPage from "@/pages/applicant-passport-details";
import ApplicantPassportDetailsForm from "@/sections/applicant-passport-details-form";
import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
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
    status: ApplicationStatus.IN_PROGRESS,
    fullName: "Sigmund Sigmundson",
    sex: "Male",
    dateOfBirth: {
      year: "1901",
      month: "1",
      day: "1",
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

describe("ApplicantPassportDetailsForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantPassportDetailsForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantPassportDetailsForm />, { preloadedState });

    await user.type(screen.getByTestId("passport-issue-date-day"), "2");
    await user.type(screen.getByTestId("passport-issue-date-month"), "2");
    await user.type(screen.getByTestId("passport-issue-date-year"), "1902");
    await user.type(screen.getByTestId("passport-expiry-date-day"), "3");
    await user.type(screen.getByTestId("passport-expiry-date-month"), "3");
    await user.type(screen.getByTestId("passport-expiry-date-year"), "2053");

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getByRole("combobox")).toHaveValue("BRB");
    expect(screen.getByTestId("passport-issue-date-day")).toHaveValue("2");
    expect(screen.getByTestId("passport-issue-date-month")).toHaveValue("2");
    expect(screen.getByTestId("passport-issue-date-year")).toHaveValue("1902");
    expect(screen.getByTestId("passport-expiry-date-day")).toHaveValue("3");
    expect(screen.getByTestId("passport-expiry-date-month")).toHaveValue("3");
    expect(screen.getByTestId("passport-expiry-date-year")).toHaveValue("2053");

    await user.click(screen.getByRole("button"));

    expect(store.getState().applicant).toEqual({
      status: "In progress",
      fullName: "Sigmund Sigmundson",
      sex: "Male",
      dateOfBirth: { day: "1", month: "1", year: "1901" },
      countryOfNationality: "",
      passportNumber: "12345",
      countryOfIssue: "BRB",
      passportIssueDate: { day: "2", month: "2", year: "1902" },
      passportExpiryDate: { day: "3", month: "3", year: "2053" },
      applicantHomeAddress1: "",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      townOrCity: "",
      provinceOrState: "",
      country: "",
      postcode: "",
      applicantPhotoFileName: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/visa-applicant-contact-information");
  });

  it("when ApplicantPassportDetailsForm is not filled then errors are displayed", async () => {
    renderWithProviders(<ApplicantPassportDetailsForm />);

    const submitButton = screen.getByRole("button", { name: /continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Enter the applicant's passport number",
      "Error: Select the country of issue",
      "Error: Passport issue date must include a day, month and year",
      "Error: Passport expiry date must include a day, month and year",
    ];

    await waitFor(() => {
      errorMessages.forEach((error) => {
        expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
        expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
      });
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<ApplicantPassportDetailsForm />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to applicant personal details page", () => {
    renderWithProviders(<ApplicantPassportDetailsPage />);
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/visa-applicant-personal-information");
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
    renderWithProviders(<ApplicantPassportDetailsPage />, { preloadedState: completeState });
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
    const { store } = renderWithProviders(<ApplicantPassportDetailsForm />, {
      preloadedState: stateWithPhoto,
    });

    await user.type(screen.getByTestId("passport-number"), "ABC123");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "GBR" } });
    await user.type(screen.getByTestId("passport-issue-date-day"), "1");
    await user.type(screen.getByTestId("passport-issue-date-month"), "1");
    await user.type(screen.getByTestId("passport-issue-date-year"), "2020");
    await user.type(screen.getByTestId("passport-expiry-date-day"), "1");
    await user.type(screen.getByTestId("passport-expiry-date-month"), "1");
    await user.type(screen.getByTestId("passport-expiry-date-year"), "2030");

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
    const { store } = renderWithProviders(<ApplicantPassportDetailsForm />, {
      preloadedState: completeState,
    });

    await user.clear(screen.getByTestId("passport-issue-date-day"));
    await user.type(screen.getByTestId("passport-issue-date-day"), "29");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(store.getState().applicant.passportIssueDate).toEqual({
        day: "29",
        month: "1",
        year: "2020",
      });
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

    renderWithProviders(<ApplicantPassportDetailsForm />, { preloadedState: completeState });

    expect(screen.queryByTestId("passport-number")).not.toBeInTheDocument();

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
