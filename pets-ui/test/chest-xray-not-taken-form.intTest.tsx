import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import ChestXrayNotTaken from "@/pages/chest-xray-not-taken";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("ChestXrayNotTakenPage", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayNotTaken />
      </HelmetProvider>,
    );
  });

  const user = userEvent.setup();

  it("displays the back link", () => {
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/chest-xray-question");
    expect(link).toHaveClass("govuk-back-link");
  });
  it("renders the page titles and descriptions ", () => {
    expect(screen.getByText("Reason X-ray is not required?")).toBeInTheDocument();
  });
  it("renders an error when continue button pressed but required radio question not answered", async () => {
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      expect(
        screen.getAllByText("Select a reason why X-ray is not required")[0],
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Select a reason why X-ray is not required")[1],
      ).toBeInTheDocument();
      expect(screen.getAllByText("Select a reason why X-ray is not required")[0]).toHaveAttribute(
        "aria-label",
        "Error: Select a reason why X-ray is not required",
      );
    });
  });
  it("does not render an error if continue button not clicked", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Select a reason why X-ray is not required")).not.toBeInTheDocument();
  });
  it("does not render an error if 'Child (under 11 years)' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[0]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Select a reason why X-ray is not required")).not.toBeInTheDocument();
  });
  it("does not render an error if 'Pregnant' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[1]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Select a reason why X-ray is not required")).not.toBeInTheDocument();
  });
  it("does not render an error if 'Other' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Select a reason why X-ray is not required")).not.toBeInTheDocument();
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("when continue pressed, it navigates to /medical-summary", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));

    expect(useNavigateMock).toHaveBeenCalled();
    expect(useNavigateMock).toHaveBeenCalledWith("/medical-summary");
  });
});
