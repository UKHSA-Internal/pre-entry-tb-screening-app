import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import RadiologicalOutcomeSummaryPage from "@/pages/radiological-outcome-summary";
import RadiologicalOutcomeSummary from "@/sections/radiological-outcome-summary";
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

describe("RadiologicalOutcomeSummary Page", () => {
  it("shows back link to findings when status in progress", () => {
    const preloadedState = {
      radiologicalOutcome: { status: ApplicationStatus.IN_PROGRESS },
    } as unknown as Record<string, unknown>;

    renderWithProviders(
      <HelmetProvider>
        <RadiologicalOutcomeSummaryPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/enter-x-ray-findings");
  });

  it("shows back link to tracker when status complete", () => {
    const preloadedState = {
      radiologicalOutcome: { status: ApplicationStatus.COMPLETE },
    } as unknown as Record<string, unknown>;

    renderWithProviders(
      <HelmetProvider>
        <RadiologicalOutcomeSummaryPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/tracker");
  });
});

describe("RadiologicalOutcomeSummary Section", () => {
  let mock: MockAdapter;
  const user = userEvent.setup();

  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  it("renders YES summary and posts radiological outcome on continue", async () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      medicalScreening: {
        chestXrayTaken: YesOrNo.YES,
      },
      radiologicalOutcome: {
        status: ApplicationStatus.NOT_YET_STARTED,
        xrayResult: "Chest X-ray normal",
        xrayResultDetail: "Some details",
        xrayMinorFindings: ["1.1 Single fibrous streak or band or scar"],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
      },
    } as unknown as Record<string, unknown>;

    mock.onPost("/application/abc-123/radiological-outcome").reply(200);

    renderWithProviders(<RadiologicalOutcomeSummary />, { preloadedState });

    await user.click(screen.getByRole("button", { name: /save and continue/i }));

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe("/application/abc-123/radiological-outcome");
      expect(JSON.parse(mock.history.post[0].data as string)).toMatchObject({
        xrayResult: "Chest X-ray normal",
        xrayResultDetail: "Some details",
        xrayMinorFindings: ["1.1 Single fibrous streak or band or scar"],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
      });
      expect(useNavigateMock).toHaveBeenLastCalledWith("/radiological-outcome-confirmed");
    });
  });

  it("renders NO summary and posts chest xray not taken on continue", async () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      medicalScreening: {
        chestXrayTaken: YesOrNo.NO,
      },
      radiologicalOutcome: {
        status: ApplicationStatus.IN_PROGRESS,
        reasonXrayWasNotTaken: "Pregnancy",
        xrayWasNotTakenFurtherDetails: "First trimester",
      },
    } as unknown as Record<string, unknown>;

    mock.onPost("/application/abc-123/chest-xray").reply(200);

    renderWithProviders(<RadiologicalOutcomeSummary />, { preloadedState });

    await user.click(screen.getByRole("button", { name: /save and continue/i }));

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe("/application/abc-123/chest-xray");
      expect(JSON.parse(mock.history.post[0].data as string)).toMatchObject({
        chestXrayTaken: "No",
        reasonXrayWasNotTaken: "Pregnancy",
        xrayWasNotTakenFurtherDetails: "First trimester",
      });
      expect(useNavigateMock).toHaveBeenLastCalledWith("/radiological-outcome-confirmed");
    });
  });

  it("when post request returns client-side error then user is navigated to /sorry-there-is-problem-with-service", async () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      medicalScreening: {
        chestXrayTaken: YesOrNo.NO,
      },
      radiologicalOutcome: {
        status: ApplicationStatus.IN_PROGRESS,
        reasonXrayWasNotTaken: "Pregnancy",
        xrayWasNotTakenFurtherDetails: "First trimester",
      },
    } as unknown as Record<string, unknown>;

    mock.onPost("/application/abc-123/chest-xray").reply(400);

    renderWithProviders(<RadiologicalOutcomeSummary />, { preloadedState });

    await user.click(screen.getByRole("button", { name: /save and continue/i }));

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe("/application/abc-123/chest-xray");
      expect(JSON.parse(mock.history.post[0].data as string)).toMatchObject({
        chestXrayTaken: "No",
        reasonXrayWasNotTaken: "Pregnancy",
        xrayWasNotTakenFurtherDetails: "First trimester",
      });
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });
  });

  it("when post request returns server-side error then user is navigated to /sorry-there-is-problem-with-service", async () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      medicalScreening: {
        chestXrayTaken: YesOrNo.NO,
      },
      radiologicalOutcome: {
        status: ApplicationStatus.IN_PROGRESS,
        reasonXrayWasNotTaken: "Pregnancy",
        xrayWasNotTakenFurtherDetails: "First trimester",
      },
    } as unknown as Record<string, unknown>;

    mock.onPost("/application/abc-123/chest-xray").reply(500);

    renderWithProviders(<RadiologicalOutcomeSummary />, { preloadedState });

    await user.click(screen.getByRole("button", { name: /save and continue/i }));

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe("/application/abc-123/chest-xray");
      expect(JSON.parse(mock.history.post[0].data as string)).toMatchObject({
        chestXrayTaken: "No",
        reasonXrayWasNotTaken: "Pregnancy",
        xrayWasNotTakenFurtherDetails: "First trimester",
      });
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });
  });

  it("shows Return to tracker when status complete", () => {
    const preloadedState = {
      radiologicalOutcome: { status: ApplicationStatus.COMPLETE, chestXrayTaken: YesOrNo.YES },
    } as unknown as Record<string, unknown>;

    renderWithProviders(<RadiologicalOutcomeSummary />, { preloadedState });

    expect(screen.getByRole("button", { name: /return to tracker/i })).toBeInTheDocument();
  });
});
