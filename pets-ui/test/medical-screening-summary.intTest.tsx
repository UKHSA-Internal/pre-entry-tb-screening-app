import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
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

const preloadedState = {
  applicant: {
    status: ApplicationStatus.INCOMPLETE,
    fullName: "Full Name",
    sex: "",
    dateOfBirth: { year: "", month: "", day: "" },
    countryOfNationality: "",
    passportNumber: "",
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
  },
  application: { applicationId: "abc-123", dateCreated: "" },
  medicalScreening: {
    status: ApplicationStatus.COMPLETE,
    age: 99,
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
  },
  travel: {
    applicantUkAddress1: "",
    applicantUkAddress2: "",
    postcode: "",
    status: ApplicationStatus.INCOMPLETE,
    townOrCity: "",
    ukEmail: "",
    ukMobileNumber: "",
    visaType: "",
  },
  chestXray: {
    chestXrayTaken: false,
    posteroAnteriorXray: false,
    posteroAnteriorXrayFile: "",
    apicalLordoticXray: false,
    apicalLordoticXrayFile: "",
    lateralDecubitusXray: false,
    lateralDecubitusXrayFile: "",
    xrayWasNotTakenFurtherDetails: "",
    reasonXrayWasNotTaken: null,
    reasonXrayNotTakenDetail: null,
    dateOfCxr: null,
    radiologicalOutcome: "",
    radiologicalOutcomeNotes: null,
    radiologicalFinding: null,
    dateOfRadiologicalInterpretation: null,
    sputumCollected: false,
    reasonWhySputumNotRequired: null,
    xrayResult: "",
    xrayResultDetail: "",
    xrayFindingsList: [],
  },
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

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Full Name");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("Age");
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("99");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent(
      "Does the applicant have TB symptoms?",
    );
    expect(screen.getAllByRole("definition")[4]).toHaveTextContent("Yes");
    expect(screen.getAllByRole("term")[3]).toHaveTextContent("TB symptoms");
    expect(screen.getAllByRole("definition")[6]).toHaveTextContent("Cough, Night sweats");
    expect(screen.getAllByRole("term")[4]).toHaveTextContent("Other symptoms");
    expect(screen.getAllByRole("definition")[8]).toHaveTextContent("");
    expect(screen.getAllByRole("term")[5]).toHaveTextContent("Applicant history if under 11");
    expect(screen.getAllByRole("definition")[10]).toHaveTextContent(
      "Not applicable - applicant is aged 11 or over",
    );
    expect(screen.getAllByRole("term")[6]).toHaveTextContent(
      "Additional details of applicant history if under 11",
    );
    expect(screen.getAllByRole("definition")[12]).toHaveTextContent("");
    expect(screen.getAllByRole("term")[7]).toHaveTextContent(
      "Has the applicant ever had tuberculosis?",
    );
    expect(screen.getAllByRole("definition")[14]).toHaveTextContent("Yes");
    expect(screen.getAllByRole("term")[8]).toHaveTextContent("Detail of applicant's previous TB");
    expect(screen.getAllByRole("definition")[16]).toHaveTextContent("Details of previous TB.");
    expect(screen.getAllByRole("term")[9]).toHaveTextContent(
      "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?",
    );
    expect(screen.getAllByRole("definition")[18]).toHaveTextContent("No");
    expect(screen.getAllByRole("term")[10]).toHaveTextContent(
      "Details of applicant's close contact with any person with active pulmonary tuberculosis",
    );
    expect(screen.getAllByRole("definition")[20]).toHaveTextContent("");
    expect(screen.getAllByRole("term")[11]).toHaveTextContent("Is the applicant pregnant?");
    expect(screen.getAllByRole("definition")[22]).toHaveTextContent("Don't know");
    expect(screen.getAllByRole("term")[12]).toHaveTextContent(
      "Does the applicant have menstrual periods?",
    );
    expect(screen.getAllByRole("definition")[24]).toHaveTextContent("No");
    expect(screen.getAllByRole("term")[13]).toHaveTextContent("Physical examination notes");
    expect(screen.getAllByRole("definition")[26]).toHaveTextContent(
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
});
