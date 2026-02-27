import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, Mock } from "vitest";

import AutoSignedOutPage from "@/pages/signed-out-auto";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock = vi.fn();

vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Auto-signed out page", () => {
  const setup = () => {
    renderWithProviders(
      <HelmetProvider>
        <AutoSignedOutPage />
      </HelmetProvider>,
    );
  };

  it("renders heading and explanatory text", () => {
    setup();
    expect(screen.getByRole("heading", { name: "You have been signed out" })).toBeInTheDocument();
    expect(screen.getByText("Your session was inactive for 20 minutes.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If you completed a section and viewed a confirmation page, we saved your answers. Any information you did not submit has been deleted.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You need to sign in to continue or start a new screening."),
    ).toBeInTheDocument();
  });

  it("contains a sign in link back to root", async () => {
    setup();
    const user = userEvent.setup();
    const signInButton = screen.getByRole("button", { name: "Sign in" });
    expect(signInButton).toBeInTheDocument();
    await user.click(signInButton);
    expect(useNavigateMock).toHaveBeenCalledWith("/");
  });
});
