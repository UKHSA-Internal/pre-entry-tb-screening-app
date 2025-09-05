import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock, vi } from "vitest";

import { postSputumDetails } from "@/api/api";
import SputumCollectionPage from "@/pages/sputum-collection";
import SputumCollectionForm from "@/sections/sputum-collection-form";
import {
  DateType,
  ReduxApplicantDetailsType,
  ReduxSputumSampleType,
  ReduxSputumType,
} from "@/types";
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

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
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
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    expect(screen.getByText("Save progress", { selector: "button" })).toBeInTheDocument();
    expect(
      screen.getByText("Save and continue to results", { selector: "button" }),
    ).toBeInTheDocument();
  });

  test("renders the form with pre-filled values from Redux store", () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithPartialSputum,
    });

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

  test("renders all samples as editable forms (no read-only display)", () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithSubmittedSample,
    });

    expect(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
    ).toHaveValue("10");
    expect(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-1-taken-month']" }),
    ).toHaveValue("05");
    expect(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-1-taken-year']" }),
    ).toHaveValue("2024");

    expect(screen.queryByText("(Already submitted - cannot be changed)")).not.toBeInTheDocument();
  });

  test("when form is submitted with empty required fields then errors are displayed", async () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

    await user.click(screen.getByText("Save and continue to results", { selector: "button" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
    expect(screen.getAllByText("Enter the date sample 1 was taken on")).toHaveLength(2);
    expect(screen.getAllByText("Enter Sputum sample 1 collection method")).toHaveLength(2);
    expect(screen.getAllByText("Enter the date sample 2 was taken on")).toHaveLength(2);
    expect(screen.getAllByText("Enter Sputum sample 2 collection method")).toHaveLength(2);
    expect(screen.getAllByText("Enter the date sample 3 was taken on")).toHaveLength(2);
    expect(screen.getAllByText("Enter Sputum sample 3 collection method")).toHaveLength(2);
  });

  test("shows validation errors for incomplete date fields", async () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
      "15",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[0], "Coughed up");

    await user.click(screen.getByText("Save and continue to results", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByTestId("error-summary")).toBeInTheDocument();
      expect(
        screen.getAllByText(/Sputum sample 1 date must include a day, month and year/),
      ).toHaveLength(2);
    });
  });

  test("shows validation errors for invalid dates", async () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    await user.click(screen.getByText("Save and continue to results", { selector: "button" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
  });

  test("updates store and navigates to '/check-sputum-sample-information' on 'Save progress' with valid data for all samples", async () => {
    const { store } = renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
      "16",
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

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-3-taken-day']" }),
      "17",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-3-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-3-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[2], "Gastric lavage");

    await user.click(screen.getByText("Save progress", { selector: "button" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).not.toHaveBeenCalled();

      const sputumState = store.getState().sputum;
      expect(sputumState.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(sputumState.sample1.collection.dateOfSample).toEqual({
        day: "15",
        month: "07",
        year: "2024",
      });
      expect(sputumState.sample1.collection.collectionMethod).toBe("Induced");
      expect(sputumState.sample1.collection.submittedToDatabase).toBe(false);
      expect(sputumState.sample2.collection.dateOfSample).toEqual({
        day: "16",
        month: "07",
        year: "2024",
      });
      expect(sputumState.sample2.collection.collectionMethod).toBe("Coughed up");
      expect(sputumState.sample2.collection.submittedToDatabase).toBe(false);
      expect(sputumState.sample3.collection.dateOfSample).toEqual({
        day: "17",
        month: "07",
        year: "2024",
      });
      expect(sputumState.sample3.collection.collectionMethod).toBe("Gastric lavage");
      expect(sputumState.sample3.collection.submittedToDatabase).toBe(false);
      expect(sputumState.version).toBe(1);
      expect(useNavigateMock).toHaveBeenCalledWith("/check-sputum-sample-information");
    });
  });

  test("updates store and navigates to '/enter-sputum-sample-results' on 'Save and continue to results' with all samples valid", async () => {
    const { store } = renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    await user.click(screen.getByText("Save and continue to results", { selector: "button" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).not.toHaveBeenCalled();

      const sputumState = store.getState().sputum;
      expect(sputumState.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(sputumState.sample1.collection.submittedToDatabase).toBe(false);
      expect(sputumState.sample2.collection.submittedToDatabase).toBe(false);
      expect(sputumState.sample3.collection.submittedToDatabase).toBe(false);
      expect(sputumState.version).toBe(1);
      expect(useNavigateMock).toHaveBeenCalledWith("/enter-sputum-sample-results");
    });
  });

  test("handles form with pre-filled data correctly", async () => {
    const { store } = renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithMixedSamples,
    });

    expect(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-1-taken-day']" }),
    ).toHaveValue("10");
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

    await user.click(screen.getByText("Save and continue to results", { selector: "button" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).not.toHaveBeenCalled();

      const sputumState = store.getState().sputum;
      expect(sputumState.version).toBe(2);
      expect(useNavigateMock).toHaveBeenCalledWith("/enter-sputum-sample-results");
    });
  });

  test("handles form submission without API errors since no API calls are made", async () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
      "16",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-2-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-2-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[1], "Induced");

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-3-taken-day']" }),
      "17",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-3-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-3-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[2], "Gastric lavage");

    await user.click(screen.getByText("Save progress", { selector: "button" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).not.toHaveBeenCalled();
      expect(useNavigateMock).toHaveBeenCalledWith("/check-sputum-sample-information");
    });
  });

  test("saves form data to Redux state without API calls", async () => {
    const { store } = renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-2-taken-day']" }),
      "16",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-2-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-2-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[1], "Induced");

    await user.type(
      screen.getByLabelText("Day", { selector: "input[id='date-sample-3-taken-day']" }),
      "17",
    );
    await user.type(
      screen.getByLabelText("Month", { selector: "input[id='date-sample-3-taken-month']" }),
      "07",
    );
    await user.type(
      screen.getByLabelText("Year", { selector: "input[id='date-sample-3-taken-year']" }),
      "2024",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[2], "Gastric lavage");

    await user.click(screen.getByText("Save progress", { selector: "button" }));

    await waitFor(() => {
      expect(mockPostSputumDetails).not.toHaveBeenCalled();

      const sputumState = store.getState().sputum;
      expect(sputumState.sample1.collection.dateOfSample).toEqual({
        day: "15",
        month: "07",
        year: "2024",
      });
      expect(sputumState.sample1.collection.collectionMethod).toBe("Coughed up");
      expect(sputumState.sample1.collection.submittedToDatabase).toBe(false);

      expect(useNavigateMock).toHaveBeenCalledWith("/check-sputum-sample-information");
    });
  });

  test("shows validation errors when no samples have data and save progress is clicked", async () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

    await user.click(screen.getByText("Save progress", { selector: "button" }));

    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
    expect(mockPostSputumDetails).not.toHaveBeenCalled();
    expect(useNavigateMock).not.toHaveBeenCalled();
  });

  test("shows validation errors when only one sample is filled (all three required)", async () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

    await user.click(screen.getByText("Save progress", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByTestId("error-summary")).toBeInTheDocument();
      expect(screen.getAllByText("Enter the date sample 1 was taken on")).toHaveLength(2);
      expect(screen.getAllByText("Enter the date sample 3 was taken on")).toHaveLength(2);
    });
  });

  test("renders all collection method options", () => {
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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
    renderWithProviders(<SputumCollectionForm />, {
      preloadedState: preloadedStateWithEmptySputum,
    });

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

  test("back link points to tracker", () => {
    renderWithProviders(<SputumCollectionPage />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });
});
