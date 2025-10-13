import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, Mock } from "vitest";

import ChestXrayQuestionPage from "@/pages/chest-xray-question";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("ChestXrayQuestionForm", () => {
  beforeEach(() => {
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayQuestionPage />
      </HelmetProvider>,
    );
  });

  const user = userEvent.setup();

  it("displays the back link", () => {
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/medical-screening");
    expect(link).toHaveClass("govuk-back-link");
  });
  it("renders the page titles and descriptions ", () => {
    expect(screen.getByText("Is an X-ray required?")).toBeInTheDocument();
  });
  it("renders an error when continue button pressed but required question not answered", async () => {
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      expect(screen.getAllByText("Select yes if X-ray is required")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Select yes if X-ray is required")[1]).toBeInTheDocument();
      expect(screen.getAllByText("Select yes if X-ray is required")[0]).toHaveAttribute(
        "aria-label",
        "Error: Select yes if X-ray is required",
      );
    });
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });
  it("does not render an error if continue button not clicked with no answer provided", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Select yes if X-ray is required")).not.toBeInTheDocument();
  });
  it("when yes selected and continue pressed, it navigates to /medical-summary", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-summary");
  });
  it("when no selected and continue pressed, it navigates to /chest-xray-not-taken", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[1]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/chest-xray-not-taken");
  });
});
