import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

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

describe("MedicalScreeningForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  it("when MedicalScreeningForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(
      <Router>
        <MedicalScreeningForm />
      </Router>,
    );

    const user = userEvent.setup();

    await user.type(screen.getByTestId("age"), "99");
    await user.click(screen.getAllByTestId("tb-symptoms")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[0]);
    await user.click(screen.getAllByTestId("tb-symptoms-list")[1]);
    await user.click(screen.getAllByTestId("under-eleven-conditions")[5]);
    await user.click(screen.getAllByTestId("previous-tb")[0]);
    await user.type(screen.getByTestId("previous-tb-detail"), "Details of previous TB.");
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
    expect(screen.getByTestId("previous-tb-detail")).toHaveValue("Details of previous TB.");
    expect(screen.getAllByTestId("close-contact-with-tb")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("close-contact-with-tb")[1]).toBeChecked();
    expect(screen.getByTestId("close-contact-with-tb-detail")).toHaveValue("");
    expect(screen.getAllByTestId("pregnant")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("pregnant")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("pregnant")[2]).toBeChecked();
    expect(screen.getAllByTestId("pregnant")[3]).not.toBeChecked();
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
      menstrualPeriods: "No",
      otherSymptomsDetail: "",
      physicalExamNotes: "Details of physical examination.",
      pregnant: "Don't know",
      previousTb: "Yes",
      previousTbDetail: "Details of previous TB.",
      status: "Incomplete",
      tbSymptoms: "Yes",
      tbSymptomsList: ["Cough", "Night sweats"],
      underElevenConditions: ["Not applicable - applicant is aged 11 or over"],
      underElevenConditionsDetail: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-summary");
  });

  it("state is updated from MedicalScreeningForm and then read by MedicalScreeningReview", async () => {
    renderWithProviders(
      <Router>
        <MedicalScreeningForm />
      </Router>,
    );

    const user = userEvent.setup();
    const submitButton = screen.getByRole("button", { name: /Save and Continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Enter applicant's age in years",
      "Select whether the applicant has any TB symptoms",
      "Select whether the applicant has ever had tuberculosis",
      "Select whether the applicant has had close contact with any person with active pulmonary tuberculosis within the past year",
      "Select whether the applicant is pregnant",
      "Select whether the applicant has menstrual periods",
    ];

    errorMessages.forEach((error) => {
      expect(screen.getAllByText(error)).toHaveLength(2);
      expect(screen.getAllByText(error)[0]).toHaveAttribute("aria-label", error);
    });
  });
});
