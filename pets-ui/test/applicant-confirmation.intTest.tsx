import { fireEvent, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import ApplicantConfirmation from "@/pages/applicant-confirmation";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
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

  test("does not render back link on confirmation page", () => {
    expect(screen.queryByRole("link", { name: "Back" })).not.toBeInTheDocument();
  });
});
