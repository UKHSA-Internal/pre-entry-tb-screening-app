import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
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

export const handlers = [];
const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("Chest X-ray Information confirmation page renders correctly & redirects on button click", async () => {
  renderWithProviders(
    <Router>
      <ChestXrayConfirmation />
    </Router>,
  );

  const button = screen.getAllByRole("button")[0];
  const user = userEvent.setup();

  expect(screen.getByText("Chest X-ray information recorded")).toBeTruthy();
  expect(
    screen.getByText("You cannot currently log sputum test information in this service."),
  ).toBeTruthy();
  expect(screen.getByText("TB screening progress tracker")).toHaveAttribute("href", "/tracker");
  expect(button).toHaveTextContent("Continue");
  await user.click(button);
  expect(useNavigateMock).toHaveBeenCalled();
});
