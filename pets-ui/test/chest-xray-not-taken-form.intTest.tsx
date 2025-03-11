import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
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
      <Router>
        <HelmetProvider>
          <ChestXrayNotTaken />
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
    expect(screen.getByText("Enter reason X-ray not taken")).toBeInTheDocument();
    expect(screen.getByText("Reason X-ray not taken")).toBeInTheDocument();
    expect(screen.getByText("Choose from the following options")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("If other, give further details")).toBeInTheDocument();
  });
  it("renders an error when continue button pressed but required radio question not answered", async () => {
    await user.click(screen.getByRole("button"));

    expect(screen.getByText("There is a problem")).toBeInTheDocument();
    expect(
      screen.getAllByText("Select the reason why the chest X-ray was not taken")[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Select the reason why the chest X-ray was not taken")[1],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Select the reason why the chest X-ray was not taken")[0],
    ).toHaveAttribute("aria-label", "Select the reason why the chest X-ray was not taken");
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

    expect(screen.queryByText("There is a problem")).toBeInTheDocument();
    expect(screen.getAllByText("Enter reason X-ray not taken")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Enter reason X-ray not taken")[1]).toBeInTheDocument();
    expect(screen.getAllByText("Enter reason X-ray not taken")[1]).toHaveAttribute(
      "aria-label",
      "Enter reason X-ray not taken",
    );
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    expect(errorSummaryDiv).toHaveFocus();
  });
  it("does not render an error if 'Other' option chosen, further details entered, and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]);

    await user.type(screen.getByTestId("xray-not-taken-further-details"), "Further Explanation");

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryAllByText("Enter reason X-ray not taken")).toHaveLength(1); //Only the title with no errors
  });
  it("when continue pressed, it navigates to /xray-not-taken-summary", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/xray-not-taken-summary");
  });
});
