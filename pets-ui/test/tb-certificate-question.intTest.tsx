import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

import TbCertificateQuestionPage from "@/pages/tb-certificate-question";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
    useLocation: vi.fn(),
  };
});

describe("TbCertificateQuestionPage", () => {
  const user = userEvent.setup();

  let originalScrollIntoViewDescriptor: PropertyDescriptor | undefined;
  let scrollIntoViewMockFn: Mock;

  beforeEach(() => {
    (useLocation as Mock).mockReturnValue({
      pathname: "/will-you-issue-tb-clearance-certificate",
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
        <TbCertificateQuestionPage />
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

  it("renders the page titles and radio question", () => {
    expect(
      screen.getByRole("heading", { name: "Will you issue a TB clearance certificate?", level: 1 }),
    ).toBeInTheDocument();

    const yesRadio = screen.getByRole("radio", { name: "Yes" });
    const radioGroupElement = yesRadio.closest("fieldset");
    expect(radioGroupElement).toBeInTheDocument();

    expect(radioGroupElement).toHaveRole("group");
    expect(yesRadio).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "No" })).toBeInTheDocument();
  });

  it("renders an error when continue button pressed but required question not answered", async () => {
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("There is a problem")).toBeInTheDocument();

    const expectedErrorMessageText = "Select yes if you will issue a TB clearance certificate";
    const expectedErrorLinkName = `Error: ${expectedErrorMessageText}`;

    const errorLinkInSummary = screen.getByRole("link", { name: expectedErrorLinkName });
    expect(errorLinkInSummary).toBeInTheDocument();
    expect(errorLinkInSummary).toHaveAttribute("href", "#tb-clearance-issued");
    expect(errorLinkInSummary).toHaveAttribute("aria-label", expectedErrorLinkName);

    const yesRadio = screen.getByRole("radio", { name: "Yes" });
    const radioGroupElement = yesRadio.closest("fieldset");
    expect(radioGroupElement).toBeInTheDocument();
    expect(within(radioGroupElement!).getByText(expectedErrorMessageText)).toBeInTheDocument();
  });

  it("renders an in-focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button", { name: "Continue" }));
    const errorSummaryDiv = await screen.findByTestId("error-summary");
    await waitFor(() => expect(errorSummaryDiv).toHaveFocus());
  });

  it("does not render an error if continue button not clicked with no answer provided", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();

    const yesRadio = screen.getByRole("radio", { name: "Yes" });
    const radioGroupElement = yesRadio.closest("fieldset");
    expect(radioGroupElement).toBeInTheDocument();
    expect(
      within(radioGroupElement!).queryByText(
        "Select yes if you will issue a TB clearance certificate",
      ),
    ).not.toBeInTheDocument();
  });

  it("when 'Yes' selected and continue pressed, it navigates to /clinic-certificate-information", async () => {
    const radioYes = screen.getByRole("radio", { name: "Yes" });
    await user.click(radioYes);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/clinic-certificate-information");
  });

  it("when 'No' selected and continue pressed, it navigates to /why-are-you-not-issuing-certificate", async () => {
    const radioNo = screen.getByRole("radio", { name: "No" });
    await user.click(radioNo);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/why-are-you-not-issuing-certificate");
  });

  it("scrolls to the TB certificate radio group if location hash is #tb-clearance-issued", () => {
    (useLocation as Mock).mockReturnValue({
      pathname: "/will-you-issue-tb-clearance-certificate",
      hash: "#tb-clearance-issued",
      search: "",
    });

    cleanup();
    renderWithProviders(
      <HelmetProvider>
        <TbCertificateQuestionPage />
      </HelmetProvider>,
    );

    expect(scrollIntoViewMockFn).toHaveBeenCalledTimes(1);
  });

  it("does not pre-select any radio button by default if the store's default isIssued is null/undefined", () => {
    expect(screen.getByRole("radio", { name: "Yes" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "No" })).not.toBeChecked();
  });
});
