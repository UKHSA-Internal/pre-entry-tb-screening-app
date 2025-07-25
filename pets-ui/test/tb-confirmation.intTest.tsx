import { screen } from "@testing-library/react";
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
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("TB screening complete");
    expect(screen.getByText("The visa applicant TB screening is complete.")).toBeInTheDocument();
  });
});
