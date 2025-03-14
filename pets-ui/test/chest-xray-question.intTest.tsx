import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
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
      <Router>
        <HelmetProvider>
          <ChestXrayQuestionPage />
        </HelmetProvider>
      </Router>,
    );
  });

  const user = userEvent.setup();

  it("shows the breadcrumbs", () => {
    const breadcrumbItems = [{ text: "Application progress tracker", href: "/tracker" }];

    breadcrumbItems.forEach((item) => {
      const breadcrumbElement = screen.getByText(item.text);
      expect(breadcrumbElement).toBeInTheDocument();
      expect(breadcrumbElement.closest("a")).toHaveAttribute("href", item.href);
    });
  });
  it("renders the applicantDataHeader component ", () => {
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Passport Number")).toBeInTheDocument();
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
