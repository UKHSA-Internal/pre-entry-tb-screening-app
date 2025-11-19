import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import ChestXrayConfirmation from "@/pages/chest-xray-confirmation";
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

test("Chest X-ray Information confirmation page renders correctly & redirects on button click", async () => {
  renderWithProviders(<ChestXrayConfirmation />);

  const button = screen.getAllByRole("button")[0];
  const user = userEvent.setup();

  expect(screen.getByText("Chest X-ray images confirmed")).toBeTruthy();
  expect(screen.getByText("We have sent the chest X-ray images to UKHSA.")).toBeTruthy();
  expect(screen.getByText("You can now view a summary for this visa applicant.")).toBeTruthy();
  expect(button).toHaveTextContent("Continue");
  await user.click(button);
  expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
});
