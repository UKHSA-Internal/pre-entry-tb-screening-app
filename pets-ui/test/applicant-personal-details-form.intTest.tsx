import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import * as api from "@/api/api";
import ApplicantPersonalDetailsPage from "@/pages/applicant-personal-details";
import ApplicantPersonalDetailsForm from "@/sections/applicant-personal-details-form";
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

describe("ApplicantPersonalDetailsForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantPersonalDetailsForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantPersonalDetailsForm />);

    await user.type(screen.getByTestId("name"), "Sigmund Sigmundson");
    await user.click(screen.getAllByTestId("sex")[1]);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "NOR" } });
    await user.type(screen.getByTestId("birth-date-day"), "1");
    await user.type(screen.getByTestId("birth-date-month"), "1");
    await user.type(screen.getByTestId("birth-date-year"), "1901");

    expect(screen.getByTestId("name")).toHaveValue("Sigmund Sigmundson");
    expect(screen.getAllByTestId("sex")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("sex")[1]).toBeChecked();
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("NOR");
    expect(screen.getByTestId("birth-date-day")).toHaveValue("1");
    expect(screen.getByTestId("birth-date-month")).toHaveValue("1");
    expect(screen.getByTestId("birth-date-year")).toHaveValue("1901");

    await user.click(screen.getByRole("button"));

    expect(store.getState().applicant).toEqual({
      status: "In progress",
      fullName: "Sigmund Sigmundson",
      sex: "Male",
      dateOfBirth: { day: "1", month: "1", year: "1901" },
      countryOfNationality: "NOR",
      passportNumber: "",
      countryOfIssue: "",
      passportIssueDate: { day: "", month: "", year: "" },
      passportExpiryDate: { day: "", month: "", year: "" },
      applicantHomeAddress1: "",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      townOrCity: "",
      provinceOrState: "",
      country: "",
      postcode: "",
      applicantPhotoFileName: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/visa-applicant-passport-information");
  });

  it("when ApplicantPersonalDetailsForm is not filled then errors are displayed", async () => {
    renderWithProviders(<ApplicantPersonalDetailsForm />);

    const submitButton = screen.getByRole("button", { name: /continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Enter the applicant's full name",
      "Error: Select the applicant's sex",
      "Error: Select the country of nationality",
      "Error: Date of birth must include a day, month and year",
    ];

    await waitFor(() => {
      errorMessages.forEach((error) => {
        expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
        expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
      });
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<ApplicantPersonalDetailsForm />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to consent question page", () => {
    renderWithProviders(<ApplicantPersonalDetailsPage />);
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
    renderWithProviders(<ApplicantPersonalDetailsPage />, { preloadedState: completeState });
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
    const { store } = renderWithProviders(<ApplicantPersonalDetailsForm />, {
      preloadedState: stateWithPhoto,
    });

    await user.type(screen.getByTestId("name"), "John Smith");
    await user.click(screen.getAllByTestId("sex")[0]);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "GBR" } });
    await user.type(screen.getByTestId("birth-date-day"), "1");
    await user.type(screen.getByTestId("birth-date-month"), "1");
    await user.type(screen.getByTestId("birth-date-year"), "1970");

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
    const { store } = renderWithProviders(<ApplicantPersonalDetailsForm />, {
      preloadedState: completeState,
    });

    await user.clear(screen.getByTestId("name"));
    await user.type(screen.getByTestId("name"), "Jeff Smith");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(store.getState().applicant.fullName).toBe("Jeff Smith");
      expect(store.getState().applicant.status).toBe(ApplicationStatus.COMPLETE);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-certificate-summary");
    });
  });
});
