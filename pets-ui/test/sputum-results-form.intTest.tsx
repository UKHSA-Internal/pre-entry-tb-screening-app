import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock, vi } from "vitest";

import { DateType, ReduxSputumSampleType, ReduxSputumType } from "@/applicant";
import EnterSputumSampleResultsPage from "@/pages/enter-sputum-sample-results";
import SputumResultsForm from "@/sections/sputum-results-form";
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

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

const emptyDate: DateType = { day: "", month: "", year: "" };

const createEmptySample = (): ReduxSputumSampleType => ({
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
});

const buildPreloadedState = (sputum: ReduxSputumType) => ({
  sputum,
});

const sampleWithDate = (date: DateType): ReduxSputumSampleType => ({
  ...createEmptySample(),
  collection: {
    dateOfSample: date,
    collectionMethod: "Coughed up",
    submittedToDatabase: false,
  },
});

const defaultSputumState: ReduxSputumType = {
  status: ApplicationStatus.IN_PROGRESS,
  version: 1,
  sample1: sampleWithDate({ day: "05", month: "05", year: "2024" }),
  sample2: createEmptySample(),
  sample3: createEmptySample(),
};

describe("SputumResultsForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  test("renders sample headings and dates", () => {
    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(defaultSputumState) },
    );

    expect(
      screen.getByRole("heading", { name: /Enter sputum sample results/i, level: 1 }),
    ).toBeInTheDocument();

    expect(screen.getByText("5 May 2024")).toBeInTheDocument();

    expect(screen.getAllByText("No date recorded")).toHaveLength(2);
  });

  test("dropdowns disabled when results already submitted", () => {
    const submittedSample: ReduxSputumSampleType = {
      ...sampleWithDate({ day: "01", month: "04", year: "2024" }),
      smearResults: {
        smearResult: PositiveOrNegative.NEGATIVE,
        submittedToDatabase: true,
      },
      cultureResults: {
        cultureResult: PositiveOrNegative.POSITIVE,
        submittedToDatabase: true,
      },
    };

    const preloadedState = buildPreloadedState({
      ...defaultSputumState,
      sample1: submittedSample,
    });

    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState },
    );

    const selects = screen.getAllByRole("combobox");

    expect(selects[0]).toBeDisabled();
    expect(selects[1]).toBeDisabled();
  });

  test("user can select results and navigate on save", async () => {
    const { store } = renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(defaultSputumState) },
    );

    const user = userEvent.setup();

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], PositiveOrNegative.POSITIVE);
    await user.selectOptions(selects[1], PositiveOrNegative.NEGATIVE);

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-sputum-sample-information");

    const state = store.getState();
    expect(state.sputum.sample1.smearResults.smearResult).toBe(PositiveOrNegative.POSITIVE);
    expect(state.sputum.sample1.cultureResults.cultureResult).toBe(PositiveOrNegative.NEGATIVE);
  });

  test("shows validation error when no results entered and user clicks save", async () => {
    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(defaultSputumState) },
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.getByRole("link", { name: /Error: Select result of smear test/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Error: Select result of culture test/i }),
    ).toBeInTheDocument();

    expect(useNavigateMock).not.toHaveBeenCalled();
  });

  test("saves successfully when only smear results are provided", async () => {
    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(defaultSputumState) },
    );

    const user = userEvent.setup();

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], PositiveOrNegative.POSITIVE);

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.queryByRole("link", { name: /Error: Select result of smear test/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Error: Select result of culture test/i }),
    ).not.toBeInTheDocument();

    expect(useNavigateMock).toHaveBeenCalled();
  });

  test("saves successfully when only culture results are provided", async () => {
    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(defaultSputumState) },
    );

    const user = userEvent.setup();

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[1], PositiveOrNegative.POSITIVE);

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.queryByRole("link", { name: /Error: Select result of smear test/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Error: Select result of culture test/i }),
    ).not.toBeInTheDocument();

    expect(useNavigateMock).toHaveBeenCalled();
  });

  test("allows save when both smear and culture results are entered", async () => {
    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(defaultSputumState) },
    );

    const user = userEvent.setup();

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], PositiveOrNegative.POSITIVE);
    await user.selectOptions(selects[1], PositiveOrNegative.NEGATIVE);

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.queryByRole("link", { name: /Error: Select result of smear test/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Error: Select result of culture test/i }),
    ).not.toBeInTheDocument();

    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-sputum-sample-information");
  });

  test("ignores samples without collection dates for validation", async () => {
    const stateWithOnlyOneSample: ReduxSputumType = {
      ...defaultSputumState,
      sample2: createEmptySample(),
      sample3: createEmptySample(),
    };

    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(stateWithOnlyOneSample) },
    );

    const user = userEvent.setup();

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], PositiveOrNegative.POSITIVE);

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.queryByRole("link", { name: /Error: Select result of smear test/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Error: Select result of culture test/i }),
    ).not.toBeInTheDocument();

    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-sputum-sample-information");
  });

  test("allows save when existing non-database values are present", async () => {
    const stateWithExistingValues: ReduxSputumType = {
      ...defaultSputumState,
      sample1: {
        ...sampleWithDate({ day: "05", month: "05", year: "2024" }),
        smearResults: {
          smearResult: PositiveOrNegative.POSITIVE,
          submittedToDatabase: false,
        },
        cultureResults: {
          cultureResult: PositiveOrNegative.NEGATIVE,
          submittedToDatabase: false,
        },
      },
    };

    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(stateWithExistingValues) },
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.queryByRole("link", { name: /Error: Select result of smear test/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Error: Select result of culture test/i }),
    ).not.toBeInTheDocument();

    expect(useNavigateMock).toHaveBeenCalledWith("/check-sputum-sample-information");
  });

  test("shows validation errors when there are no results from database and no new entries", async () => {
    const stateWithNoResults: ReduxSputumType = {
      ...defaultSputumState,
      sample1: {
        ...sampleWithDate({ day: "05", month: "05", year: "2024" }),
        smearResults: {
          smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          submittedToDatabase: false,
        },
        cultureResults: {
          cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          submittedToDatabase: false,
        },
      },
    };

    renderWithProviders(
      <Router>
        <SputumResultsForm />
      </Router>,
      { preloadedState: buildPreloadedState(stateWithNoResults) },
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /Save and continue/i }));

    expect(
      screen.getByRole("link", { name: /Error: Select result of smear test/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Error: Select result of culture test/i }),
    ).toBeInTheDocument();

    expect(useNavigateMock).not.toHaveBeenCalled();
  });

  test("back link points to tracker when collection information has been submitted", () => {
    const preloadedState = {
      sputum: {
        status: ApplicationStatus.IN_PROGRESS,
        sample1: {
          collection: {
            submittedToDatabase: true,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
        sample2: {
          collection: {
            submittedToDatabase: true,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
        sample3: {
          collection: {
            submittedToDatabase: true,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
      },
    };

    renderWithProviders(
      <Router>
        <EnterSputumSampleResultsPage />
      </Router>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("back link points to sputum collection page when collection information has not been submitted", () => {
    const preloadedState = {
      sputum: {
        status: ApplicationStatus.IN_PROGRESS,
        sample1: {
          collection: {
            submittedToDatabase: false,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
        sample2: {
          collection: {
            submittedToDatabase: false,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
        sample3: {
          collection: {
            submittedToDatabase: false,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
      },
    };

    renderWithProviders(
      <Router>
        <EnterSputumSampleResultsPage />
      </Router>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/sputum-collection");
    expect(link).toHaveClass("govuk-back-link");
  });
});
