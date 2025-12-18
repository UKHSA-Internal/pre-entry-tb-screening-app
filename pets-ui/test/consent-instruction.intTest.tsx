import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, Mock } from "vitest";

import ConsentInstructionPage from "@/pages/consent-instruction";
import { renderWithProviders } from "@/utils/test-utils";

const user = userEvent.setup();

const useNavigateMock = vi.fn();

vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Get written consent page", () => {
  const setup = () => {
    renderWithProviders(
      <HelmetProvider>
        <ConsentInstructionPage />
      </HelmetProvider>,
    );
  };

  it("renders the notification banner with the correct text & styling", () => {
    setup();
    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByText("Important")).toHaveClass("govuk-notification-banner__title");
    expect(screen.getByText("You need the visa applicant's consent")).toBeInTheDocument();
    expect(screen.getByText("You need the visa applicant's consent")).toHaveClass(
      "govuk-notification-banner__heading",
    );
  });

  it("renders heading and explanatory text", () => {
    setup();
    expect(screen.getByRole("heading", { name: "Get written consent" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "The visa applicant (or their parent or guardian) must have signed a paper consent form before you start TB screening.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the button directing the user back to the applicant search", async () => {
    setup();
    const searchAgainButton = screen.getByRole("button", { name: "Search again" });
    await user.click(searchAgainButton);
    expect(useNavigateMock).toHaveBeenCalledWith("/search-for-visa-applicant");
  });
});
