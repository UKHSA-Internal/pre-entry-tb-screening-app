import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import SputumConfirmation from "@/pages/sputum-confirmation";
import { ApplicationStatus, PositiveOrNegative, SputumCollectionMethod } from "@/utils/enums";
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

const preloadedState = {
  sputum: {
    status: ApplicationStatus.NOT_YET_STARTED,
    sample1: {
      collection: {
        submittedToDatabase: true,
        dateOfSample: {
          year: "01",
          month: "01",
          day: "2025",
        },
        collectionMethod: SputumCollectionMethod.COUGHED_UP,
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

test("Sputum confirmation page renders correctly when sputum task is in progress & redirects on button click", async () => {
  preloadedState.sputum.status = ApplicationStatus.IN_PROGRESS;
  renderWithProviders(<SputumConfirmation />, { preloadedState });

  const user = userEvent.setup();
  expect(screen.getByText("Partial sputum sample information confirmed")).toBeTruthy();
  await user.click(screen.getAllByRole("button")[0]);
  expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
});

test("Sputum confirmation page renders correctly when sputum task is completed & redirects on button click", async () => {
  preloadedState.sputum.status = ApplicationStatus.COMPLETE;
  renderWithProviders(<SputumConfirmation />, { preloadedState });

  const user = userEvent.setup();
  expect(screen.getByText("All sputum sample information confirmed")).toBeTruthy();
  await user.click(screen.getAllByRole("button")[0]);
  expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
});
