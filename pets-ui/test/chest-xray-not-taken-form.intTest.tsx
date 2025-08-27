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
    expect(screen.getByText("Enter reason X-ray not taken")).toBeInTheDocument();
    expect(screen.getByText("Reason X-ray not taken")).toBeInTheDocument();
    expect(screen.getByText("Choose from the following options")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("If other, give further details")).toBeInTheDocument();
  });
  it("renders an error when continue button pressed but required radio question not answered", async () => {
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      expect(
        screen.getAllByText("Select the reason why the chest X-ray was not taken")[0],
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Select the reason why the chest X-ray was not taken")[1],
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Select the reason why the chest X-ray was not taken")[0],
      ).toHaveAttribute("aria-label", "Error: Select the reason why the chest X-ray was not taken");
    });
  });
  it("does not render an error if continue button not clicked", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Select the reason why the chest X-ray was not taken."),
    ).not.toBeInTheDocument();
  });
  it("does not render an error if 'Child' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[0]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Enter reason X-ray not taken.")).not.toBeInTheDocument();
  });
  it("does not render an error if 'Pregnant' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[1]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Enter reason X-ray not taken.")).not.toBeInTheDocument();
  });
  it("does render an error if 'Other' option chosen and continue clicked without providing further details", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.queryByText("There is a problem")).toBeInTheDocument();
      expect(screen.getAllByText("Enter reason X-ray not taken")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Enter reason X-ray not taken")[1]).toBeInTheDocument();
      expect(screen.getAllByText("Enter reason X-ray not taken")[0]).toHaveAttribute(
        "aria-label",
        "Error: Enter reason X-ray not taken",
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
  it("does not render an error if 'Other' option chosen, further details entered, and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]);

    await user.type(screen.getByTestId("xray-not-taken-further-details"), "Further Explanation");

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryAllByText("Enter reason X-ray not taken")).toHaveLength(1); //Only the title with no errors
  });
  it("when continue pressed, it navigates to /sputum-question", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sputum-question");
  });
});
