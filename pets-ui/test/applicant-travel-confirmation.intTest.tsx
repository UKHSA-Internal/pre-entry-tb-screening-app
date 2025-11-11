import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import TravelConfirmation from "@/pages/travel-confirmation";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});
vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

beforeEach(() => {
  localStorage.setItem("cookie-consent", "rejected");
});

afterEach(() => {
  localStorage.clear();
});

test("Travel confirmation page renders correctly & redirects on button click", async () => {
  renderWithProviders(<TravelConfirmation />);

  const user = userEvent.setup();
  expect(screen.getByText("Travel information confirmed")).toBeTruthy();
  await user.click(screen.getAllByRole("button")[0]);
  expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
});
