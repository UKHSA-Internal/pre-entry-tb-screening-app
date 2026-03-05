import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { postSputumRequirement } from "@/api/api";
import SputumDecisionSummaryPage from "@/pages/sputum-decision-summary";
import SputumDecisionSummary from "@/sections/sputum-decision-summary";
import { ApplicationStatus, TaskStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const user = userEvent.setup();

const useNavigateMock: Mock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
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
      application: {
        applicationId: "test-app-id",
        dateCreated: { year: "2010", month: "1", day: "1" },
        applicationStatus: ApplicationStatus.IN_PROGRESS,
      },
      sputumDecision: {
        status: TaskStatus.NOT_YET_STARTED,
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
      application: {
        applicationId: "test-app-id",
        dateCreated: { year: "2010", month: "1", day: "1" },
        applicationStatus: ApplicationStatus.IN_PROGRESS,
      },
      sputumDecision: {
        status: TaskStatus.NOT_YET_STARTED,
        isSputumRequired: YesOrNo.NO,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    (postSputumRequirement as Mock).mockResolvedValue({});
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    await user.click(screen.getByRole("button", { name: "Submit and continue" }));
    expect(postSputumRequirement).toHaveBeenCalledWith("test-app-id", {
      sputumRequired: YesOrNo.NO,
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sputum-decision-confirmed");
  });

  it("shows Return to tracker button when status is COMPLETE", () => {
    const preloadedState = {
      application: {
        applicationId: "test-app-id",
        dateCreated: { year: "2010", month: "1", day: "1" },
        applicationStatus: ApplicationStatus.IN_PROGRESS,
      },
      sputumDecision: {
        status: TaskStatus.COMPLETE,
        isSputumRequired: YesOrNo.NO,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    expect(screen.getByRole("button", { name: "Return to tracker" })).toBeInTheDocument();
  });

  it("navigates to tracker on Return to tracker click", async () => {
    const preloadedState = {
      application: {
        applicationId: "test-app-id",
        dateCreated: { year: "2010", month: "1", day: "1" },
        applicationStatus: ApplicationStatus.IN_PROGRESS,
      },
      sputumDecision: {
        status: TaskStatus.COMPLETE,
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
      application: {
        applicationId: "test-app-id",
        dateCreated: { year: "2010", month: "1", day: "1" },
        applicationStatus: ApplicationStatus.IN_PROGRESS,
      },
      sputumDecision: {
        status: TaskStatus.NOT_YET_STARTED,
        isSputumRequired: YesOrNo.YES,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    (postSputumRequirement as Mock).mockRejectedValue(new Error("fail"));
    renderWithProviders(<SputumDecisionSummary />, { preloadedState });
    await user.click(screen.getByRole("button", { name: "Submit and continue" }));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
  });

  it("back link points to tracker page when sputum decision task is complete", () => {
    const preloadedState = {
      sputumDecision: {
        status: TaskStatus.COMPLETE,
        isSputumRequired: YesOrNo.YES,
        completionDate: { year: "", month: "", day: "" },
      },
    };

    renderWithProviders(
      <HelmetProvider>
        <SputumDecisionSummaryPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/tracker");
    expect(backLink).toHaveClass("govuk-back-link");
  });

  it("back link points to sputum question page when sputum decision task is not complete", () => {
    const preloadedState = {
      sputumDecision: {
        status: TaskStatus.IN_PROGRESS,
        isSputumRequired: YesOrNo.NULL,
        completionDate: { year: "", month: "", day: "" },
      },
    };

    renderWithProviders(
      <HelmetProvider>
        <SputumDecisionSummaryPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/is-sputum-collection-required");
    expect(backLink).toHaveClass("govuk-back-link");
  });
});
