import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import MedicalScreeningPage from "@/pages/medical-screening";
import MedicalScreeningForm from "@/sections/medical-screening-form";
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

describe("MedicalScreeningForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  const user = userEvent.setup();

  it("when MedicalScreeningForm is filled correctly then state is updated and user is navigated to xray question page", async () => {
    const { store } = renderWithProviders(<MedicalScreeningForm />);

    const user = userEvent.setup();
    await user.type(screen.getByTestId("medical-screening-completion-date-day"), "15");
    await user.type(screen.getByTestId("medical-screening-completion-date-month"), "6");
    await user.type(screen.getByTestId("medical-screening-completion-date-year"), "2025");

    await user.type(screen.getByTestId("age"), "99");
    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[1]);
    await user.click(screen.getAllByTestId("under-eleven-conditions")[5]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.type(screen.getByTestId("previous-tb-detail"), "Details of previous pulmonary TB.");
    await user.click(screen.getAllByTestId("close-contact-with-tb")[1]);
    await user.click(screen.getAllByTestId("pregnant")[2]);
    await user.click(screen.getAllByTestId("menstrual-periods")[1]);
    await user.type(screen.getByTestId("physical-exam-notes"), "Details of physical examination.");

    expect(screen.getByTestId("age")).toHaveValue("99");
    expect(screen.getAllByTestId("tb-symptoms")[0]).toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[0]).toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[1]).toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[2]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[3]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[4]).not.toBeChecked();
    expect(screen.getAllByTestId("tb-symptoms-list")[5]).not.toBeChecked();
    expect(screen.getByTestId("other-symptoms-detail")).toHaveValue("");
    expect(screen.getAllByTestId("under-eleven-conditions")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[2]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[3]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[4]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[5]).toBeChecked();
    expect(screen.getByTestId("under-eleven-conditions-detail")).toHaveValue("");
    expect(screen.getAllByTestId("previous-tb")[0]).toBeChecked();
    expect(screen.getAllByTestId("previous-tb")[1]).not.toBeChecked();
    expect(screen.getByTestId("previous-tb-detail")).toHaveValue(
      "Details of previous pulmonary TB.",
    );
    expect(screen.getAllByTestId("close-contact-with-tb")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("close-contact-with-tb")[1]).toBeChecked();
    expect(screen.getByTestId("close-contact-with-tb-detail")).toHaveValue("");
    expect(screen.getAllByTestId("pregnant")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("pregnant")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("pregnant")[2]).toBeChecked();
    expect(screen.getAllByTestId("menstrual-periods")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("menstrual-periods")[1]).toBeChecked();
    expect(screen.getAllByTestId("menstrual-periods")[2]).not.toBeChecked();
    expect(screen.getByTestId("physical-exam-notes")).toHaveValue(
      "Details of physical examination.",
    );

    await user.click(screen.getByRole("button"));

    expect(store.getState().medicalScreening).toEqual({
      age: "99",
      closeContactWithTb: "No",
      closeContactWithTbDetail: "",
      completionDate: {
        day: "",
        month: "",
        year: "",
      },
      menstrualPeriods: "No",
      otherSymptomsDetail: "",
      physicalExamNotes: "Details of physical examination.",
      pregnant: "Do not know",
      previousTb: "Yes",
      previousTbDetail: "Details of previous pulmonary TB.",
      status: "In progress",
      tbSymptoms: "Yes",
      tbSymptomsList: ["Cough", "Night sweats"],
      underElevenConditions: ["Not applicable - applicant is aged 11 or over"],
      underElevenConditionsDetail: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/xray-question");
  });

  it("state is updated from MedicalScreeningForm and then read by MedicalScreeningReview", async () => {
    renderWithProviders(<MedicalScreeningForm />);

    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: The date the medical screening took place must include a day, month and year",
      "Error: Enter applicant's age in years",
      "Error: Select whether the visa applicant has any pulmonary TB symptoms",
      "Error: Select whether the visa applicant has ever had pulmonary TB",
      "Error: Select whether the visa applicant has had close contact with any person with active pulmonary TB within the past year",
      "Error: Select whether the visa applicant is pregnant",
      "Error: Select whether the visa applicant has menstrual periods",
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
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to tracker", () => {
    renderWithProviders(<MedicalScreeningPage />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });
});
