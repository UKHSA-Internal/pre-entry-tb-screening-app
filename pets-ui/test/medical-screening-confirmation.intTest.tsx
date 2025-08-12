import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import MedicalConfirmation from "@/pages/medical-screening-confirmation";
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

test("Medical screening confirmation page renders correctly & redirects on button click", async () => {
  renderWithProviders(<MedicalConfirmation />);

  const user = userEvent.setup();
  expect(screen.getByText("Medical history and TB symptoms confirmed")).toBeTruthy();
  await user.click(screen.getAllByRole("button")[0]);
  expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
});
