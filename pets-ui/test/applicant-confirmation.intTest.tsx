import { fireEvent, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import ApplicantConfirmation from "@/pages/applicant-confirmation";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Applicant Confirmation page", () => {
  beforeEach(() => {
    renderWithProviders(
      <HelmetProvider>
        <ApplicantConfirmation />
      </HelmetProvider>,
    );
  });

  test("Page renders with correct text", () => {
    expect(screen.getByText("Visa applicant details confirmed")).toBeInTheDocument();
    expect(screen.getByText("You can now return to the progress tracker.")).toBeInTheDocument();
  });

  test("Continue button redirects user to '/tracker' page", () => {
    fireEvent.click(screen.getByText("Continue"));
    expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
  });

  test("Back link points to applicant summary page", () => {
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/check-applicant-details");
    expect(link).toHaveClass("govuk-back-link");
  });
});
