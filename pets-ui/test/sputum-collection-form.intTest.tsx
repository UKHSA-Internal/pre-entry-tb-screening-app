import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock, vi } from "vitest";

import { postSputumDetails } from "@/api/api";
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

vi.mock("@/api/api", () => ({
  postSputumDetails: vi.fn(),
}));

const mockPostSputumDetails = postSputumDetails as Mock;

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

const submittedSputumSample = {
  collection: {
    dateOfSample: { day: "10", month: "05", year: "2024" },
    collectionMethod: "Coughed up",
    submittedToDatabase: true,
  },
  smearResults: {
    smearResult: PositiveOrNegative.NOT_YET_ENTERED,
    submittedToDatabase: false,
  },
  cultureResults: {
    cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
    submittedToDatabase: false,
  },
  lastUpdatedDate: { day: "10", month: "05", year: "2024" },
};

const defaultApplicantData: ReduxApplicantDetailsType & { applicationId: string } = {
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
  applicationId: "test-app-123",
};

const initialEmptySputumState: ReduxSputumType = {
  status: ApplicationStatus.IN_PROGRESS,
  sample1: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
  sample2: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
  sample3: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
  version: 1,
};

const preloadedStateWithEmptySputum = {
  applicant: defaultApplicantData,
  application: {
    applicationId: "test-app-123",
    dateCreated: "2024-01-01",
  },
  sputum: initialEmptySputumState,
};

const preloadedStateWithPartialSputum = {
  applicant: defaultApplicantData,
  application: {
    applicationId: "test-app-123",
    dateCreated: "2024-01-01",
  },
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
    version: 1,
  } as ReduxSputumType,
};

const preloadedStateWithSubmittedSample = {
  applicant: defaultApplicantData,
  application: {
    applicationId: "test-app-123",
    dateCreated: "2024-01-01",
  },
  sputum: {
    status: ApplicationStatus.IN_PROGRESS,
    sample1: JSON.parse(JSON.stringify(submittedSputumSample)) as ReduxSputumSampleType,
    sample2: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
    sample3: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
    version: 2,
  } as ReduxSputumType,
};

const preloadedStateWithMixedSamples = {
  applicant: defaultApplicantData,
  application: {
    applicationId: "test-app-123",
    dateCreated: "2024-01-01",
  },
  sputum: {
    status: ApplicationStatus.IN_PROGRESS,
    sample1: JSON.parse(JSON.stringify(submittedSputumSample)) as ReduxSputumSampleType,
    sample2: {
      collection: {
        dateOfSample: { day: "15", month: "06", year: "2024" },
        collectionMethod: "Induced",
        submittedToDatabase: false,
      },
      smearResults: initialSputumSampleEmpty.smearResults,
      cultureResults: initialSputumSampleEmpty.cultureResults,
      lastUpdatedDate: { ...emptyDate },
    },
    sample3: JSON.parse(JSON.stringify(initialSputumSampleEmpty)) as ReduxSputumSampleType,
    version: 2,
  } as ReduxSputumType,
};

describe("SputumCollectionForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
    mockPostSputumDetails.mockClear();
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
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("");

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
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("Coughed up");
  });

  test("renders read-only display for submitted samples", () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithSubmittedSample },
    );

    const dayInput = screen.getByDisplayValue("10");
    const monthInput = screen.getByDisplayValue("05");
    const yearInput = screen.getByDisplayValue("2024");

    expect(dayInput.closest('div[style*="opacity: 0.6"]')).toBeInTheDocument();
    expect(monthInput.closest('div[style*="opacity: 0.6"]')).toBeInTheDocument();
    expect(yearInput.closest('div[style*="opacity: 0.6"]')).toBeInTheDocument();

    expect(screen.getByDisplayValue("Coughed up")).toBeDisabled();

    expect(screen.getAllByText("(Already submitted - cannot be changed)")).toHaveLength(2);

    expect(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
    ).toBeInTheDocument();
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

  test("shows validation errors for incomplete date fields", async () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
      "15",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Coughed up");

    await user.click(screen.getByRole("button", { name: "Save and continue to results" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Sputum sample 1 date must include a day, month and year/),
    ).toHaveLength(2);
  });

  test("shows validation errors for invalid dates", async () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
      "32",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-1-taken-month']" }),
      "13",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-1-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Coughed up");

    await user.click(screen.getByRole("button", { name: "Save and continue to results" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
  });

  test("updates store and navigates to '/check-sputum-sample-information' on 'Save progress' with valid data for one sample", async () => {
    mockPostSputumDetails.mockResolvedValue({
      data: { version: 2 },
    });

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
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Induced");

    await user.click(screen.getByRole("button", { name: "Save progress" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).toHaveBeenCalledWith(
        "test-app-123",
        {
          sample1: {
            dateOfSample: "2024-07-15",
            collectionMethod: "Induced",
            dateUpdated: "2025-06-10",
          },
        },
        1,
      );

      const sputumState = store.getState().sputum;
      expect(sputumState.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(sputumState.sample1.collection.dateOfSample).toEqual({
        day: "15",
        month: "07",
        year: "2024",
      });
      expect(sputumState.sample1.collection.collectionMethod).toBe("Induced");
      expect(sputumState.sample1.collection.submittedToDatabase).toBe(true);
      expect(sputumState.version).toBe(2);
      expect(useNavigateMock).toHaveBeenCalledWith("/check-sputum-sample-information");
    });
  });

  test("updates store and navigates to '/enter-sputum-sample-results' on 'Save and continue to results' with all samples valid", async () => {
    mockPostSputumDetails.mockResolvedValue({
      data: { version: 2 },
    });

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
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Coughed up");

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
    await user.selectOptions(screen.getAllByRole("combobox")[1], "Induced");

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
    await user.selectOptions(screen.getAllByRole("combobox")[2], "Gastric lavage");

    await user.click(screen.getByRole("button", { name: "Save and continue to results" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).toHaveBeenCalledWith(
        "test-app-123",
        {
          sample1: {
            dateOfSample: "2023-01-01",
            collectionMethod: "Coughed up",
            dateUpdated: "2025-06-10",
          },
          sample2: {
            dateOfSample: "2023-01-02",
            collectionMethod: "Induced",
            dateUpdated: "2025-06-10",
          },
          sample3: {
            dateOfSample: "2023-01-03",
            collectionMethod: "Gastric lavage",
            dateUpdated: "2025-06-10",
          },
        },
        1,
      );

      const sputumState = store.getState().sputum;
      expect(sputumState.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(sputumState.sample1.collection.submittedToDatabase).toBe(true);
      expect(sputumState.sample2.collection.submittedToDatabase).toBe(true);
      expect(sputumState.sample3.collection.submittedToDatabase).toBe(true);
      expect(sputumState.version).toBe(2);
      expect(useNavigateMock).toHaveBeenCalledWith("/enter-sputum-sample-results");
    });
  });

  test("handles mixed state with some samples submitted and some editable", async () => {
    mockPostSputumDetails.mockResolvedValue({
      data: { version: 3 },
    });

    const { store } = renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithMixedSamples },
    );

    const sample1DayInput = screen.getByDisplayValue("10");
    expect(sample1DayInput.closest('div[style*="opacity: 0.6"]')).toBeInTheDocument();

    expect(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
    ).toHaveValue("15");

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-3-taken-day']" }),
      "20",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-3-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-3-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[2], "Not known");

    await user.click(screen.getByRole("button", { name: "Save and continue to results" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).toHaveBeenCalledWith(
        "test-app-123",
        {
          sample2: {
            dateOfSample: "2024-06-15",
            collectionMethod: "Induced",
            dateUpdated: "2025-06-10",
          },
          sample3: {
            dateOfSample: "2024-07-20",
            collectionMethod: "Not known",
            dateUpdated: "2025-06-10",
          },
        },
        2,
      );

      const sputumState = store.getState().sputum;
      expect(sputumState.version).toBe(3);
      expect(useNavigateMock).toHaveBeenCalledWith("/enter-sputum-sample-results");
    });
  });

  test("handles API error gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockPostSputumDetails.mockRejectedValue(new Error("Network error"));

    renderWithProviders(
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
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Coughed up");

    await user.click(screen.getByRole("button", { name: "Save progress" }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error saving sputum details:",
        expect.any(Error),
      );
      expect(useNavigateMock).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test("handles 403 authentication error specifically", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockPostSputumDetails.mockRejectedValue({
      response: { status: 403, data: "Forbidden" },
    });

    renderWithProviders(
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
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Coughed up");

    await user.click(screen.getByRole("button", { name: "Save progress" }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Authentication error: The request was forbidden. This might be due to:",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Response data:", "Forbidden");
    });

    consoleErrorSpy.mockRestore();
  });

  test("shows validation errors when no samples have data and save progress is clicked", async () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.click(screen.getByRole("button", { name: "Save progress" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
    expect(mockPostSputumDetails).not.toHaveBeenCalled();
    expect(useNavigateMock).not.toHaveBeenCalled();
  });

  test("validation allows save progress with at least one filled sample", async () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
      "15",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-2-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-2-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[1], "Coughed up");

    await user.click(screen.getByRole("button", { name: "Save progress" }));

    expect(screen.queryByTestId("error-summary")).not.toBeInTheDocument();
  });

  test("renders all collection method options", () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    const coughedUpOptions = screen.getAllByRole("option", { name: "Coughed up" });
    const inducedOptions = screen.getAllByRole("option", { name: "Induced" });
    const gastricLavageOptions = screen.getAllByRole("option", { name: "Gastric lavage" });
    const notKnownOptions = screen.getAllByRole("option", { name: "Not known" });

    expect(coughedUpOptions).toHaveLength(3);
    expect(inducedOptions).toHaveLength(3);
    expect(gastricLavageOptions).toHaveLength(3);
    expect(notKnownOptions).toHaveLength(3);
  });

  test("shows correct sample headings and structure", () => {
    renderWithProviders(
      <Router>
        <SputumCollectionForm />
      </Router>,
      { preloadedState: preloadedStateWithEmptySputum },
    );

    expect(screen.getByRole("heading", { name: "Sputum sample 1", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sputum sample 2", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sputum sample 3", level: 2 })).toBeInTheDocument();

    expect(
      screen.getAllByRole("heading", { name: "Date sample 1 was taken on", level: 3 }),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { name: "Date sample 2 was taken on", level: 3 }),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { name: "Date sample 3 was taken on", level: 3 }),
    ).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Collection method", level: 3 })).toHaveLength(3);
  });
});
