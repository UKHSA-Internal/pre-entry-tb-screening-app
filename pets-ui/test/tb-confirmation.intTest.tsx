import { fireEvent, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import TbConfirmationPage from "@/pages/tb-confirmation";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Tb Confirmation page", () => {
  beforeEach(() => {
    renderWithProviders(
      <Router>
        <HelmetProvider>
          <TbConfirmationPage />
        </HelmetProvider>
      </Router>,
    );
  });

  test("Page renders with correct text", () => {
    expect(screen.getByText("TB screening complete")).toBeInTheDocument();
    expect(
      screen.getByText("Thank you for recording the visa applicant's TB screening."),
    ).toBeInTheDocument();
  });

  test("Finish button redirects user to '/tracker' page", () => {
    fireEvent.click(screen.getByText("Finish"));

    expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
  });
});
