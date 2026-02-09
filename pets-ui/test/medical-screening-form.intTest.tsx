import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import MedicalScreeningPage from "@/pages/medical-screening";
import MedicalScreeningForm from "@/sections/medical-screening-form";
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

const applicantState = {
  status: ApplicationStatus.COMPLETE,
  fullName: "Full Name",
  sex: "Male",
  dateOfBirth: { year: "1979", month: "10", day: "20" },
  countryOfNationality: "",
  passportNumber: "0987",
  countryOfIssue: "",
  passportIssueDate: { year: "", month: "", day: "" },
  passportExpiryDate: { year: "", month: "", day: "" },
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  townOrCity: "",
  provinceOrState: "",
  country: "",
  postcode: "",
};

const femaleApplicantState = { ...applicantState, sex: "Female" };
const maleU11ApplicantState = {
  ...applicantState,
  dateOfBirth: { year: "2015", month: "1", day: "1" },
};
const femaleU11ApplicantState = {
  ...applicantState,
  sex: "Female",
  dateOfBirth: { year: "2015", month: "1", day: "1" },
};

const preloadedState = {
  applicant: { ...applicantState },
};

describe("MedicalScreeningForm", () => {
  beforeEach(() => {
    vi.setSystemTime("2025-01-31T00:00:00Z");
    useNavigateMock.mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  const user = userEvent.setup();

  it("when MedicalScreeningForm is filled correctly then state is updated and user is navigated to xray question page", async () => {
    const { store } = renderWithProviders(<MedicalScreeningForm />, { preloadedState });

    const today = new Date();
    const day = today.getDate().toString();
    const month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    const user = userEvent.setup();
    await user.type(screen.getByTestId("medical-screening-completion-date-day"), day);
    await user.type(screen.getByTestId("medical-screening-completion-date-month"), month);
    await user.type(screen.getByTestId("medical-screening-completion-date-year"), year);

    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[1]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.type(screen.getByTestId("previous-tb-detail"), "Details of previous pulmonary TB.");
    await user.click(screen.getAllByTestId("close-contact-with-tb")[1]);
    await user.type(screen.getByTestId("physical-exam-notes"), "Details of physical examination.");

    expect(screen.getAllByTestId("tb-symptoms")[0]).toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[0]).toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[1]).toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[2]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[3]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[4]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[5]).not.toBeChecked();
    expect(screen.getByTestId("other-symptoms-detail")).toHaveValue("");
    expect(screen.getAllByTestId("previous-tb")[0]).toBeChecked();
    expect(screen.getAllByTestId("previous-tb")[1]).not.toBeChecked();
    expect(screen.getByTestId("previous-tb-detail")).toHaveValue(
      "Details of previous pulmonary TB.",
    );
    expect(screen.getAllByTestId("close-contact-with-tb")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("close-contact-with-tb")[1]).toBeChecked();
    expect(screen.getByTestId("close-contact-with-tb-detail")).toHaveValue("");
    expect(screen.getByTestId("physical-exam-notes")).toHaveValue(
      "Details of physical examination.",
    );
    expect(screen.getAllByText("You have 150 words remaining")).toHaveLength(3);
    expect(screen.getAllByText("You have 145 words remaining")).toHaveLength(1);
    expect(screen.getAllByText("You have 146 words remaining")).toHaveLength(1);

    await user.click(screen.getByRole("button"));

    expect(store.getState().medicalScreening).toEqual({
      chestXrayTaken: "",
      closeContactWithTb: "No",
      closeContactWithTbDetail: "",
      completionDate: {
        day: day,
        month: month,
        year: year,
      },
      menstrualPeriods: "",
      otherSymptomsDetail: "",
      physicalExamNotes: "Details of physical examination.",
      pregnant: "",
      previousTb: "Yes",
      previousTbDetail: "Details of previous pulmonary TB.",
      reasonXrayNotRequired: "",
      reasonXrayNotRequiredFurtherDetails: "",
      status: "In progress",
      tbSymptoms: "Yes",
      tbSymptomsList: ["Cough", "Night sweats"],
      underElevenConditions: [],
      underElevenConditionsDetail: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/is-an-x-ray-required");
  });

  it("when MedicalScreeningForm is submitted then user is navigated to under 11 page when applicant is an under 11 female", async () => {
    const femaleU11PreloadedState = {
      ...preloadedState,
      applicant: { ...femaleU11ApplicantState },
    };
    renderWithProviders(<MedicalScreeningForm />, { preloadedState: femaleU11PreloadedState });

    const today = new Date();
    const day = today.getDate().toString();
    const month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    const user = userEvent.setup();
    await user.type(screen.getByTestId("medical-screening-completion-date-day"), day);
    await user.type(screen.getByTestId("medical-screening-completion-date-month"), month);
    await user.type(screen.getByTestId("medical-screening-completion-date-year"), year);

    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[1]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.type(screen.getByTestId("previous-tb-detail"), "Details of previous pulmonary TB.");
    await user.click(screen.getAllByTestId("close-contact-with-tb")[1]);
    await user.type(screen.getByTestId("physical-exam-notes"), "Details of physical examination.");

    await user.click(screen.getByRole("button"));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-history-under-11-years-old");
  });

  it("when MedicalScreeningForm is submitted then user is navigated to under 11 page when applicant is an under 11 male", async () => {
    const maleU11PreloadedState = {
      ...preloadedState,
      applicant: { ...maleU11ApplicantState },
    };
    renderWithProviders(<MedicalScreeningForm />, { preloadedState: maleU11PreloadedState });

    const today = new Date();
    const day = today.getDate().toString();
    const month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    const user = userEvent.setup();
    await user.type(screen.getByTestId("medical-screening-completion-date-day"), day);
    await user.type(screen.getByTestId("medical-screening-completion-date-month"), month);
    await user.type(screen.getByTestId("medical-screening-completion-date-year"), year);

    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[1]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.type(screen.getByTestId("previous-tb-detail"), "Details of previous pulmonary TB.");
    await user.click(screen.getAllByTestId("close-contact-with-tb")[1]);
    await user.type(screen.getByTestId("physical-exam-notes"), "Details of physical examination.");

    await user.click(screen.getByRole("button"));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-history-under-11-years-old");
  });

  it("when MedicalScreeningForm is submitted then user is navigated to female page when applicant is an over 11 female", async () => {
    const femalePreloadedState = {
      ...preloadedState,
      applicant: { ...femaleApplicantState },
    };
    renderWithProviders(<MedicalScreeningForm />, { preloadedState: femalePreloadedState });

    const today = new Date();
    const day = today.getDate().toString();
    const month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    const user = userEvent.setup();
    await user.type(screen.getByTestId("medical-screening-completion-date-day"), day);
    await user.type(screen.getByTestId("medical-screening-completion-date-month"), month);
    await user.type(screen.getByTestId("medical-screening-completion-date-year"), year);

    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[1]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.type(screen.getByTestId("previous-tb-detail"), "Details of previous pulmonary TB.");
    await user.click(screen.getAllByTestId("close-contact-with-tb")[1]);
    await user.type(screen.getByTestId("physical-exam-notes"), "Details of physical examination.");

    await user.click(screen.getByRole("button"));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-history-female");
  });

  it("errors for mandatory fields are rendered as expected", async () => {
    renderWithProviders(<MedicalScreeningForm />);
    expect(screen.getAllByText("You have 150 words remaining")).toHaveLength(5);

    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Enter the date the medical screening took place",
      "Error: Select whether the visa applicant has any pulmonary TB symptoms",
      "Error: Select whether the visa applicant has ever had pulmonary TB",
      "Error: Select whether the visa applicant has had close contact with any person with active pulmonary TB within the past year",
    ];

    await waitFor(() => {
      errorMessages.forEach((error) => {
        expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
        expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
      });
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<MedicalScreeningForm />);
    expect(screen.getAllByText("You have 150 words remaining")).toHaveLength(5);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to tracker", () => {
    renderWithProviders(<MedicalScreeningPage />);
    expect(screen.getAllByText("You have 150 words remaining")).toHaveLength(5);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("correct error messages are displayed when word count is exceeded in textarea fields", async () => {
    const tooLongInput =
      "This string is 151 words long a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a";
    renderWithProviders(<MedicalScreeningForm />);
    expect(screen.getAllByText("You have 150 words remaining")).toHaveLength(5);

    const user = userEvent.setup();
    await user.type(screen.getByTestId("medical-screening-completion-date-day"), "15");
    await user.type(screen.getByTestId("medical-screening-completion-date-month"), "6");
    await user.type(screen.getByTestId("medical-screening-completion-date-year"), "2025");
    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.click(screen.getAllByTestId("close-contact-with-tb")[1]);
    await user.click(screen.getAllByTestId("pregnant")[2]);
    await user.click(screen.getAllByTestId("menstrual-periods")[1]);

    await user.type(screen.getByTestId("other-symptoms-detail"), tooLongInput);
    await user.type(screen.getByTestId("under-eleven-conditions-detail"), tooLongInput);
    await user.type(screen.getByTestId("previous-tb-detail"), tooLongInput);
    await user.type(screen.getByTestId("close-contact-with-tb-detail"), tooLongInput);
    await user.type(screen.getByTestId("physical-exam-notes"), tooLongInput);

    expect(screen.getByTestId("other-symptoms-detail")).toHaveValue(tooLongInput);
    expect(screen.getByTestId("under-eleven-conditions-detail")).toHaveValue(tooLongInput);
    expect(screen.getByTestId("previous-tb-detail")).toHaveValue(tooLongInput);
    expect(screen.getByTestId("close-contact-with-tb-detail")).toHaveValue(tooLongInput);
    expect(screen.getByTestId("physical-exam-notes")).toHaveValue(tooLongInput);
    expect(screen.getAllByText("You have 1 word too many")).toHaveLength(5);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getAllByText('"Give further details (optional)" must be 150 words or fewer'),
      ).toHaveLength(8);
      expect(
        screen.getAllByText('"Physical examination notes (optional)" must be 150 words or fewer'),
      ).toHaveLength(2);
    });
  });
});
