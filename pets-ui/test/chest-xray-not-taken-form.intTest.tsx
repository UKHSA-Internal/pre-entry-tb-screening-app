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

beforeEach(() => {
  localStorage.setItem("cookie-consent", "rejected");
});

afterEach(() => {
  localStorage.clear();
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
    expect(link).toHaveAttribute("href", "/is-an-x-ray-required");
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
        screen.getAllByText("Select the reason an X-ray is not required")[0],
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Select the reason an X-ray is not required")[1],
      ).toBeInTheDocument();
      expect(screen.getAllByText("Select the reason an X-ray is not required")[0]).toHaveAttribute(
        "aria-label",
        "Error: Select the reason an X-ray is not required",
      );
    });
  });
  it("does not render an error if continue button not clicked", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Select the reason an X-ray is not required"),
    ).not.toBeInTheDocument();
  });
  it("does not render an error if 'Child (under 11 years)' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[0]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Select the reason an X-ray is not required"),
    ).not.toBeInTheDocument();
  });
  it("does not render an error if 'Pregnant' option chosen and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[1]);

    await user.click(screen.getByRole("button"));

    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Select the reason an X-ray is not required"),
    ).not.toBeInTheDocument();
  });
  it("does render an error if 'Other' option chosen with empty reason and continue clicked", async () => {
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Error: Enter the reason why X-ray is not required" }),
      ).toBeInTheDocument();
    });
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("when continue pressed, it navigates to /check-medical-history-and-tb-symptoms", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));

    expect(useNavigateMock).toHaveBeenCalled();
    expect(useNavigateMock).toHaveBeenCalledWith("/check-medical-history-and-tb-symptoms");
  });
  it("pre-fills 'Other' reason text field when the redux variable is not empty", async () => {
    const preloadedState = {
      medicalScreening: {
        reasonXrayNotRequired: "Other",
        reasonXrayNotRequiredFurtherDetails: "too old",
      },
    } as unknown as Record<string, unknown>;

    renderWithProviders(
      <HelmetProvider>
        <ChestXrayNotTaken />
      </HelmetProvider>,
      { preloadedState },
    );

    const input = await screen.findByTestId("reason-xray-not-required-other-detail");
    expect(input).toHaveValue("too old");
  });
});
