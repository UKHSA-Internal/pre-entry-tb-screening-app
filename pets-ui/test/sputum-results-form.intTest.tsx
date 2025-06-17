import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock, vi } from "vitest";

import { DateType, ReduxSputumSampleType, ReduxSputumType } from "@/applicant";
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
});
