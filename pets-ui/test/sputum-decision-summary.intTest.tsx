import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import { postSputumRequirement } from "@/api/api";
import SputumDecisionSummary from "@/sections/sputum-decision-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const user = userEvent.setup();
const applicationId = "test-app-id";
const useNavigateMock: Mock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => useNavigateMock,
  };
});
vi.mock("@/api/api", async () => {
  const actual = await vi.importActual("@/api/api");
  return {
    ...actual,
    postSputumRequirement: vi.fn(),
  };
});

describe("SputumDecisionSummary", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
    (postSputumRequirement as Mock).mockReset();
  });

  it("renders summary and Submit and continue button when status is NOT_YET_STARTED", () => {
    const preloadedState = {
      application: { applicationId, dateCreated: "2025-01-01" },
      sputumDecision: {
        status: ApplicationStatus.NOT_YET_STARTED,
        isSputumRequired: YesOrNo.YES,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    expect(screen.getByText("Sputum required")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit and continue" })).toBeInTheDocument();
  });

  it("posts data and navigates to confirmation on Submit and continue", async () => {
    const preloadedState = {
      application: { applicationId, dateCreated: "2025-01-01" },
      sputumDecision: {
        status: ApplicationStatus.NOT_YET_STARTED,
        isSputumRequired: YesOrNo.NO,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    (postSputumRequirement as Mock).mockResolvedValue({});
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    await user.click(screen.getByRole("button", { name: "Submit and continue" }));
    expect(postSputumRequirement).toHaveBeenCalledWith(applicationId, {
      sputumRequired: YesOrNo.NO,
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sputum-decision-confirmed");
  });

  it("shows Return to tracker button when status is COMPLETE", () => {
    const preloadedState = {
      application: { applicationId, dateCreated: "2025-01-01" },
      sputumDecision: {
        status: ApplicationStatus.COMPLETE,
        isSputumRequired: YesOrNo.NO,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    expect(screen.getByRole("button", { name: "Return to tracker" })).toBeInTheDocument();
  });

  it("navigates to tracker on Return to tracker click", async () => {
    const preloadedState = {
      application: { applicationId, dateCreated: "2025-01-01" },
      sputumDecision: {
        status: ApplicationStatus.COMPLETE,
        isSputumRequired: YesOrNo.YES,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    await user.click(screen.getByRole("button", { name: "Return to tracker" }));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
  });

  it("navigates to /sorry-there-is-problem-with-service if API fails", async () => {
    const preloadedState = {
      application: { applicationId, dateCreated: "2025-01-01" },
      sputumDecision: {
        status: ApplicationStatus.NOT_YET_STARTED,
        isSputumRequired: YesOrNo.YES,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    (postSputumRequirement as Mock).mockRejectedValue(new Error("fail"));
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    await user.click(screen.getByRole("button", { name: "Submit and continue" }));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
  });
});
