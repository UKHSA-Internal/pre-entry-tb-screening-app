import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import MedicalSummaryPage from "@/pages/medical-screening-summary";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
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

const medicalScreeningState = {
  status: ApplicationStatus.NOT_YET_STARTED,
  age: "99",
  closeContactWithTb: "No",
  closeContactWithTbDetail: "",
  menstrualPeriods: "No",
  otherSymptomsDetail: "",
  physicalExamNotes: "Details of physical examination.",
  pregnant: "Don't know",
  previousTb: "Yes",
  previousTbDetail: "Details of previous TB.",
  tbSymptoms: "Yes",
  tbSymptomsList: ["Cough", "Night sweats"],
  underElevenConditions: ["Not applicable - applicant is aged 11 or over"],
  underElevenConditionsDetail: "",
  completionDate: { year: "", month: "", day: "" },
};

const applicationState = { applicationId: "abc-123", dateCreated: "" };

const applicantState = {
  status: ApplicationStatus.COMPLETE,
  fullName: "Full Name",
  sex: "",
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

const tbCertificateState = {
  status: ApplicationStatus.NOT_YET_STARTED,
  isIssued: YesOrNo.NO,
  comments: "",
  certificateDate: {
    year: "",
    month: "",
    day: "",
  },
  certificateNumber: "",
  declaringPhysicianName: "",
};

const preloadedState = {
  medicalScreening: { ...medicalScreeningState },
  application: { ...applicationState },
  applicant: { ...applicantState },
  tbCertificate: { ...tbCertificateState },
};

describe("MedicalScreeningReview", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  test("state is displayed correctly & user is navigated to confirmation page when medical details are posted successfully", async () => {
    renderWithProviders(
      <Router>
        <MedicalScreeningReview />
      </Router>,
      { preloadedState },
    );
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/medical-screening").reply(200);

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Age");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("99");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent(
      "Does the applicant have TB symptoms?",
    );
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("Yes");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent("TB symptoms");
    expect(screen.getAllByRole("definition")[4]).toHaveTextContent("Cough, Night sweats");
    expect(screen.getAllByRole("term")[3]).toHaveTextContent("Other symptoms");
    expect(screen.getAllByRole("definition")[6]).toHaveTextContent("Enter other symptoms");
    expect(screen.getAllByRole("term")[4]).toHaveTextContent("Applicant history if under 11");
    expect(screen.getAllByRole("definition")[7]).toHaveTextContent(
      "Not applicable - applicant is aged 11 or over",
    );
    expect(screen.getAllByRole("term")[5]).toHaveTextContent(
      "Additional details of applicant history if under 11",
    );
    expect(screen.getAllByRole("definition")[9]).toHaveTextContent(
      "Enter additional details of applicant history if under 11",
    );
    expect(screen.getAllByRole("term")[6]).toHaveTextContent(
      "Has the applicant ever had tuberculosis?",
    );
    expect(screen.getAllByRole("definition")[10]).toHaveTextContent("Yes");
    expect(screen.getAllByRole("term")[7]).toHaveTextContent("Detail of applicant's previous TB");
    expect(screen.getAllByRole("definition")[12]).toHaveTextContent("Details of previous TB.");
    expect(screen.getAllByRole("term")[8]).toHaveTextContent(
      "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?",
    );
    expect(screen.getAllByRole("definition")[14]).toHaveTextContent("No");
    expect(screen.getAllByRole("term")[9]).toHaveTextContent(
      "Details of applicant's close contact with any person with active pulmonary tuberculosis",
    );
    expect(screen.getAllByRole("definition")[16]).toHaveTextContent(
      "Enter details of applicant's close contact with any person with active pulmonary tuberculosis (optional)",
    );
    expect(screen.getAllByRole("term")[10]).toHaveTextContent("Is the applicant pregnant?");
    expect(screen.getAllByRole("definition")[17]).toHaveTextContent("Don't know");
    expect(screen.getAllByRole("term")[11]).toHaveTextContent(
      "Does the applicant have menstrual periods?",
    );
    expect(screen.getAllByRole("definition")[19]).toHaveTextContent("No");
    expect(screen.getAllByRole("term")[12]).toHaveTextContent("Physical examination notes");
    expect(screen.getAllByRole("definition")[21]).toHaveTextContent(
      "Details of physical examination.",
    );

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application/abc-123/medical-screening");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-confirmation");
  });

  test("user is navigated to error page when api call is unsuccessful", async () => {
    renderWithProviders(
      <Router>
        <MedicalScreeningReview />
      </Router>,
      { preloadedState },
    );
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/medical-screening").reply(500);

    await user.click(screen.getAllByRole("button")[0]);

    expect(mock.history[0].url).toEqual("/application/abc-123/medical-screening");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("back link points to tracker when status is complete", () => {
    const preloadedState = {
      medicalScreening: {
        status: ApplicationStatus.COMPLETE,
        age: "",
        tbSymptoms: "",
        tbSymptomsList: [],
        otherSymptomsDetail: "",
        underElevenConditions: [],
        underElevenConditionsDetail: "",
        previousTb: "",
        previousTbDetail: "",
        closeContactWithTb: "",
        closeContactWithTbDetail: "",
        pregnant: "",
        menstrualPeriods: "",
        physicalExamNotes: "",
        completionDate: { year: "", month: "", day: "" },
      },
    };

    renderWithProviders(
      <Router>
        <MedicalSummaryPage />
      </Router>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("back link points to medical screening form page status is not complete", () => {
    const preloadedState = {
      medicalScreening: {
        status: ApplicationStatus.IN_PROGRESS,
        age: "",
        tbSymptoms: "",
        tbSymptomsList: [],
        otherSymptomsDetail: "",
        underElevenConditions: [],
        underElevenConditionsDetail: "",
        previousTb: "",
        previousTbDetail: "",
        closeContactWithTb: "",
        closeContactWithTbDetail: "",
        pregnant: "",
        menstrualPeriods: "",
        physicalExamNotes: "",
        completionDate: { year: "", month: "", day: "" },
      },
    };

    renderWithProviders(
      <Router>
        <MedicalSummaryPage />
      </Router>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/medical-screening");
    expect(link).toHaveClass("govuk-back-link");
  });
});
