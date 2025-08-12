import { screen } from "@testing-library/react";
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

describe("ChestXrayUploadPage", () => {
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
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });
  it("renders the page titles and descriptions ", () => {
    expect(screen.getByText("Select X-ray status")).toBeInTheDocument();
    expect(screen.getByText("Has the visa applicant had a chest X-ray?")).toBeInTheDocument();
    expect(
      screen.getByText("This would typically be the postero-anterior chest X-ray"),
    ).toBeInTheDocument();
  });
  it("renders an error when continue button pressed but required question not answered", async () => {
    await user.click(screen.getByRole("button"));

    expect(screen.getByText("There is a problem")).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Select yes if the visa applicant has had a chest X-ray or no if they have not",
      )[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Select yes if the visa applicant has had a chest X-ray or no if they have not",
      )[1],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Select yes if the visa applicant has had a chest X-ray or no if they have not",
      )[0],
    ).toHaveAttribute(
      "aria-label",
      "Error: Select yes if the visa applicant has had a chest X-ray or no if they have not",
    );
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    expect(errorSummaryDiv).toHaveFocus();
  });
  it("does not render an error if continue button not clicked with no answer provided", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Select whether the applicant has had a chest X-ray"),
    ).not.toBeInTheDocument();
  });
  it("when yes selected and continue pressed, it navigates to /chest-xray-upload", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/chest-xray-upload");
  });
  it("when no selected and continue pressed, it navigates to /chest-xray-not-taken", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[1]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/chest-xray-not-taken");
  });
});
