import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock, vi } from "vitest";

import {
  DateType,
  ReduxApplicantDetailsType,
  ReduxSputumSampleType,
  ReduxSputumType,
} from "@/applicant";
import SputumCollectionForm from "@/sections/sputum-collection-form";
import { ApplicationStatus, PositiveOrNegative } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const emptyDate: DateType = { day: "", month: "", year: "" };

const initialSputumSampleEmpty = {
  collection: {
    dateOfSample: { ...emptyDate },
    collectionMethod: "",
    submittedToDatabase: false,
  },
  smearResults: {
    smearResult: PositiveOrNegative.NOT_YET_ENTERED,

    submittedToDatabase: false,
  },
  cultureResults: {
    cultureResult: PositiveOrNegative.NOT_YET_ENTERED,

    submittedToDatabase: false,
  },
  lastUpdatedDate: { ...emptyDate },
};

const defaultApplicantData: ReduxApplicantDetailsType = {
  status: ApplicationStatus.IN_PROGRESS,
  fullName: "Test User One",
  sex: "Female",
  dateOfBirth: { day: "10", month: "05", year: "1985" },
  countryOfNationality: "GBR",
  passportNumber: "X12345678",
  countryOfIssue: "GBR",
  passportIssueDate: { day: "01", month: "01", year: "2020" },
  passportExpiryDate: { day: "01", month: "01", year: "2030" },
  applicantHomeAddress1: "1 Test Street",
  townOrCity: "Testville",
  provinceOrState: "Testshire",
  country: "GBR",
  postcode: "T3S T1N",
  applicantPhotoFileName: "photo.jpg",
};

const initialEmptySputumState: ReduxSputumType = {
  status: ApplicationStatus.IN_PROGRESS,
  sample1: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
  sample2: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
  sample3: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
};

const preloadedStateWithEmptySputum = {
  applicant: defaultApplicantData,
  sputum: initialEmptySputumState,
};

const preloadedStateWithPartialSputum = {
  applicant: defaultApplicantData,
  sputum: {
    status: ApplicationStatus.IN_PROGRESS,
    sample1: {
      collection: {
        dateOfSample: { day: "05", month: "05", year: "2024" },
        collectionMethod: "Coughed up",
        submittedToDatabase: false,
      },
      smearResults: initialSputumSampleEmpty.smearResults,
      cultureResults: initialSputumSampleEmpty.cultureResults,
      lastUpdatedDate: { ...emptyDate },
    },
    sample2: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
    sample3: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
  } as ReduxSputumType,
};

describe("SputumCollectionForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  test("renders the form with initial (empty) values from Redux store", () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    expect(
      screen.getByRole("heading", { name: "Enter sputum sample collection information", level: 1 }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
    ).toHaveValue("");
    expect(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-1-taken-month']" }),
    ).toHaveValue("");
    expect(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-1-taken-year']" }),
    ).toHaveValue("");
    expect(screen.getAllByRole("combobox", { name: "Collection method" })[0]).toHaveValue("");

    expect(screen.getByRole("button", { name: "Save progress" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save and continue to results" }),
    ).toBeInTheDocument();
  });

  test("renders the form with pre-filled values from Redux store", () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithPartialSputum },
    );

    expect(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
    ).toHaveValue("05");
    expect(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-1-taken-month']" }),
    ).toHaveValue("05");
    expect(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-1-taken-year']" }),
    ).toHaveValue("2024");
    expect(screen.getAllByRole("combobox", { name: "Collection method" })[0]).toHaveValue(
      "Coughed up",
    );
  });

  test("when form is submitted with empty required fields then errors are displayed", async () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.click(screen.getByRole("button", { name: "Save and continue to results" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
    expect(screen.getAllByText("Enter the date sample 1 was taken on")).toHaveLength(2);
    expect(screen.getAllByText("Select if collection method was coughed up, etc.")).toHaveLength(6);
  });

  test("updates store and navigates to '/check-sputum-sample-information' on 'Save progress' with valid data for one sample", async () => {
    const { store } = renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
      "15",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-1-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-1-taken-year']" }),
      "2024",
    );
    await user.selectOptions(
      screen.getAllByRole("combobox", { name: "Collection method" })[0],
      "Induced",
    );

    await user.click(screen.getByRole("button", { name: "Save progress" }));

    await waitFor(() => {
      const sputumState = store.getState().sputum;
      expect(sputumState.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(sputumState.sample1.collection.dateOfSample).toEqual({
        day: "15",
        month: "07",
        year: "2024",
      });
      expect(sputumState.sample1.collection.collectionMethod).toBe("Induced");
      expect(sputumState.sample2.collection.collectionMethod).toBe("");
      expect(useNavigateMock).toHaveBeenCalledWith("/check-sputum-sample-information");
    });
  });

  test("updates store and navigates to '/enter-sputum-sample-results' on 'Save and continue to results' with all samples valid", async () => {
    const { store } = renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
      "01",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-1-taken-month']" }),
      "01",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-1-taken-year']" }),
      "2023",
    );
    await user.selectOptions(
      screen.getAllByRole("combobox", { name: "Collection method" })[0],
      "Coughed up",
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
      "02",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-2-taken-month']" }),
      "01",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-2-taken-year']" }),
      "2023",
    );
    await user.selectOptions(
      screen.getAllByRole("combobox", { name: "Collection method" })[1],
      "Induced",
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-3-taken-day']" }),
      "03",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-3-taken-month']" }),
      "01",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-3-taken-year']" }),
      "2023",
    );
    await user.selectOptions(
      screen.getAllByRole("combobox", { name: "Collection method" })[2],
      "Gastric lavage",
    );

    await user.click(screen.getByRole("button", { name: "Save and continue to results" }));

    await waitFor(() => {
      const sputumState = store.getState().sputum;
      expect(sputumState.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(sputumState.sample1.collection.dateOfSample).toEqual({
        day: "01",
        month: "01",
        year: "2023",
      });
      expect(sputumState.sample1.collection.collectionMethod).toBe("Coughed up");
      expect(sputumState.sample2.collection.dateOfSample).toEqual({
        day: "02",
        month: "01",
        year: "2023",
      });
      expect(sputumState.sample2.collection.collectionMethod).toBe("Induced");
      expect(sputumState.sample3.collection.dateOfSample).toEqual({
        day: "03",
        month: "01",
        year: "2023",
      });
      expect(sputumState.sample3.collection.collectionMethod).toBe("Gastric lavage");
      expect(useNavigateMock).toHaveBeenCalledWith("/enter-sputum-sample-results");
    });
  });
});
