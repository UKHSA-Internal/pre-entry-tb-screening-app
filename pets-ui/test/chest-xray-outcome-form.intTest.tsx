import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import ChestXrayOutcomePage from "@/pages/chest-xray-outcome";
import ChestXrayOutcomeForm from "@/sections/chest-xray-outcome-form";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

beforeEach(() => useNavigateMock.mockClear());

const user = userEvent.setup();

describe("ChestXrayOutcome Page", () => {
  it("displays the back link", () => {
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayOutcomePage />
      </HelmetProvider>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });
});

describe("ChestXrayOutcome Form", () => {
  it("renders form elements", () => {
    renderWithProviders(<ChestXrayOutcomeForm />);

    expect(screen.getByText("Chest X-ray results")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Chest X-ray normal")).toBeInTheDocument();
    expect(screen.getByLabelText("Non-TB abnormality")).toBeInTheDocument();
    expect(screen.getByLabelText("Old or active TB")).toBeInTheDocument();
  });

  it("shows validation errors when submitting without a selection", async () => {
    renderWithProviders(<ChestXrayOutcomeForm />);

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      const messages = screen.getAllByText("Select radiological outcome");
      expect(messages).toHaveLength(2);
      expect(messages[0]).toHaveAttribute("aria-label", "Error: Select radiological outcome");
    });

    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("navigates to findings when a result is selected and submitted", async () => {
    renderWithProviders(<ChestXrayOutcomeForm />);

    await user.click(screen.getByLabelText("Chest X-ray normal"));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenLastCalledWith("/enter-x-ray-findings");
    });
  });
});
