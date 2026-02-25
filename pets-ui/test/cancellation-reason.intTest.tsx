import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

import CancellationReasonPage from "@/pages/cancellation-reason";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
    useLocation: vi.fn(),
  };
});

describe("CancellationReasonPage", () => {
  const user = userEvent.setup();

  let originalScrollIntoViewDescriptor: PropertyDescriptor | undefined;
  let scrollIntoViewMockFn: Mock;

  beforeEach(() => {
    (useLocation as Mock).mockReturnValue({
      pathname: "/why-are-you-cancelling-this-screening",
      hash: "",
      search: "",
    });

    originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
      window.HTMLElement.prototype,
      "scrollIntoView",
    );

    scrollIntoViewMockFn = vi.fn();

    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMockFn;

    renderWithProviders(
      <HelmetProvider>
        <CancellationReasonPage />
      </HelmetProvider>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();

    if (originalScrollIntoViewDescriptor) {
      Object.defineProperty(
        window.HTMLElement.prototype,
        "scrollIntoView",
        originalScrollIntoViewDescriptor,
      );
    }
  });

  it("displays the back link", () => {
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("renders the page title, radio question, textarea question", () => {
    expect(
      screen.getByRole("heading", {
        name: "Why are you cancelling this screening?",
        level: 1,
      }),
    ).toBeInTheDocument();

    const applicantRadioGroupElement = screen
      .getByRole("radio", { name: "Did not continue with sputum testing" })
      .closest("fieldset");
    const clinicRadioGroupElement = screen
      .getByRole("radio", { name: "Uploaded the wrong X-ray" })
      .closest("fieldset");
    expect(applicantRadioGroupElement).toBeInTheDocument();
    expect(clinicRadioGroupElement).toBeInTheDocument();

    expect(applicantRadioGroupElement).toHaveRole("group");
    expect(clinicRadioGroupElement).toHaveRole("group");

    expect(screen.getByText("Cancelling because the visa applicant:")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Did not continue with sputum testing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Had inconclusive sputum test results" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Did not attend their screening appointment" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: "Changed their travel plans and does not need TB screening",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Cancelling because the clinic:")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Uploaded the wrong X-ray" })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Submitted the wrong sputum decision" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Submitted an error in the screening details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Other" })).toBeInTheDocument();

    expect(screen.getByText("Give further information (optional)")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Give further information (optional)" }),
    ).toBeInTheDocument();
  });

  it("renders an error when continue button pressed but required question not answered", async () => {
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("There is a problem")).toBeInTheDocument();

    const expectedErrorMessageText = "Select the reason you are cancelling this screening";
    const expectedErrorLinkName = `Error: ${expectedErrorMessageText}`;

    const errorLinkInSummary = screen.getByRole("link", { name: expectedErrorLinkName });
    expect(errorLinkInSummary).toBeInTheDocument();
    expect(errorLinkInSummary).toHaveAttribute("href", "#why-are-you-cancelling-screening");
    expect(errorLinkInSummary).toHaveAttribute("aria-label", expectedErrorLinkName);

    const firstRadio = screen.getByRole("radio", { name: "Did not continue with sputum testing" });
    const radioGroupElement = firstRadio.closest("fieldset");
    expect(radioGroupElement).toBeInTheDocument();
    expect(within(radioGroupElement!).getByText(expectedErrorMessageText)).toBeInTheDocument();
  });

  it("renders an in-focus error summary when continue button pressed but required question not answered", async () => {
    await user.click(screen.getByRole("button", { name: "Continue" }));
    const errorSummaryDiv = await screen.findByTestId("error-summary");
    await waitFor(() => expect(errorSummaryDiv).toHaveFocus());
  });

  it("when an option selected and continue pressed, it navigates to /visa-applicant-passport-information", async () => {
    const firstRadio = screen.getByRole("radio", { name: "Did not continue with sputum testing" });
    await user.click(firstRadio);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(useNavigateMock).toHaveBeenLastCalledWith(
      "/are-you-sure-you-want-to-cancel-this-screening",
    );
  });

  it("scrolls to the radio group if location hash is #why-are-you-cancelling-screening", () => {
    (useLocation as Mock).mockReturnValue({
      pathname: "/why-are-you-cancelling-this-screening",
      hash: "#why-are-you-cancelling-screening",
      search: "",
    });

    cleanup();
    renderWithProviders(
      <HelmetProvider>
        <CancellationReasonPage />
      </HelmetProvider>,
    );

    expect(scrollIntoViewMockFn).toHaveBeenCalledTimes(1);
  });

  it("does not pre-select any radio button by default", () => {
    expect(
      screen.getByRole("radio", { name: "Did not continue with sputum testing" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Had inconclusive sputum test results" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Did not attend their screening appointment" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", {
        name: "Changed their travel plans and does not need TB screening",
      }),
    ).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Uploaded the wrong X-ray" })).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Submitted the wrong sputum decision" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Submitted an error in the screening details" }),
    ).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Other" })).not.toBeChecked();
  });
});
