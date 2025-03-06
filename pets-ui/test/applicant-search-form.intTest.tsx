import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ApplicantSearchForm from "@/sections/applicant-search-form";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../src/api/api";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const emptyApplicantSlice = {
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  country: "",
  countryOfIssue: "AUS",
  countryOfNationality: "",
  dateOfBirth: {
    day: "",
    month: "",
    year: "",
  },
  fullName: "",
  passportExpiryDate: {
    day: "",
    month: "",
    year: "",
  },
  passportIssueDate: {
    day: "",
    month: "",
    year: "",
  },
  passportNumber: "12345",
  postcode: "",
  provinceOrState: "",
  sex: "",
  status: "Incomplete",
  townOrCity: "",
};
const emptyTravelSlice = {
  applicantUkAddress1: "",
  applicantUkAddress2: "",
  postcode: "",
  status: "Incomplete",
  townOrCity: "",
  ukEmail: "",
  ukMobileNumber: "",
  visaType: "",
};
const emptyMedicalSlice = {
  age: "",
  closeContactWithTb: "",
  closeContactWithTbDetail: "",
  menstrualPeriods: "",
  otherSymptomsDetail: "",
  physicalExamNotes: "",
  pregnant: "",
  previousTb: "",
  previousTbDetail: "",
  status: "Incomplete",
  tbSymptoms: "",
  tbSymptomsList: [],
  underElevenConditions: [],
  underElevenConditionsDetail: "",
};

describe("ApplicantSearchForm", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  test("store is correctly populated and user is navigated to tracker page when both api calls are successful", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantSearchForm />
      </Router>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992",
        expiryDate: "03-03-2053",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(200, {
      applicationId: "abc-123",
      travelInformation: {
        ukAddressLine1: "99 Downing Street",
        ukAddressPostcode: "W1 1AS",
        status: "completed",
        ukAddressTownOrCity: "London",
        ukEmailAddress: "Maxwell@Spiffington.com",
        ukMobileNumber: "071234567890",
        visaCategory: "Family Reunion",
      },
      medicalScreening: {
        applicationId: "abc-123",
        dateCreated: "2025-01-01",
        status: "completed",
        age: 43,
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "details1",
        haveMenstralPeriod: "No",
        historyOfConditionsUnder11: ["history1", "history2"],
        historyOfConditionsUnder11Details: "details2",
        historyOfPreviousTb: "No",
        physicalExaminationNotes: "Exam notes",
        pregnant: "N/A",
        previousTbDetails: "details3",
        symptoms: ["symptom1", "symptom2"],
        symptomsOfTb: "Yes",
        symptomsOther: "Other symptoms",
      },
    });

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "1991",
        month: "01",
        year: "01",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "2053",
        month: "03",
        year: "03",
      },
      passportIssueDate: {
        day: "1992",
        month: "02",
        year: "02",
      },
      passportNumber: "12345",
      postcode: "",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: "Complete",
      townOrCity: "Sydney",
    });
    expect(store.getState().travel).toEqual({
      applicantUkAddress1: "99 Downing Street",
      applicantUkAddress2: "",
      postcode: "W1 1AS",
      status: "Complete",
      townOrCity: "London",
      ukEmail: "Maxwell@Spiffington.com",
      ukMobileNumber: "071234567890",
      visaType: "Family Reunion",
    });
    expect(store.getState().medicalScreening).toEqual({
      age: "43",
      closeContactWithTb: "Yes",
      closeContactWithTbDetail: "details1",
      menstrualPeriods: "No",
      otherSymptomsDetail: "Other symptoms",
      physicalExamNotes: "Exam notes",
      pregnant: "N/A",
      previousTb: "No",
      previousTbDetail: "details3",
      status: "Complete",
      tbSymptoms: "Yes",
      tbSymptomsList: ["symptom1", "symptom2"],
      underElevenConditions: ["history1", "history2"],
      underElevenConditionsDetail: "details2",
    });

    expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
  });

  test("store is correctly populated and user is navigated to tracker page when applicant search is successful & application search returns 404", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantSearchForm />
      </Router>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992",
        expiryDate: "03-03-2053",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(404);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "1991",
        month: "01",
        year: "01",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "2053",
        month: "03",
        year: "03",
      },
      passportIssueDate: {
        day: "1992",
        month: "02",
        year: "02",
      },
      passportNumber: "12345",
      postcode: "",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: "Complete",
      townOrCity: "Sydney",
    });
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
  });

  test("store is correctly populated and user is navigated to error page when applicant search is successful & application search returns 500", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantSearchForm />
      </Router>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992",
        expiryDate: "03-03-2053",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(500);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "1991",
        month: "01",
        year: "01",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "2053",
        month: "03",
        year: "03",
      },
      passportIssueDate: {
        day: "1992",
        month: "02",
        year: "02",
      },
      passportNumber: "12345",
      postcode: "",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: "Complete",
      townOrCity: "Sydney",
    });
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("user is navigated to applicant results page when applicant search returns 404", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantSearchForm />
      </Router>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(404);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);

    expect(store.getState().applicant).toEqual(emptyApplicantSlice);
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/applicant-results");
  });

  test("user is navigated to applicant results page when applicant search returns 500", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantSearchForm />
      </Router>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(500);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);

    expect(store.getState().applicant).toEqual(emptyApplicantSlice);
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });
});
