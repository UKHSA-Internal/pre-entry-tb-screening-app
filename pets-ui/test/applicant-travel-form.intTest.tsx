import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ApplicantTravelForm from "@/sections/applicant-travel-form";
import TravelReview from "@/sections/applicant-travel-summary";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

export const handlers = [];
const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("state is updated from ApplicantTravelForm and then read by TravelReview", async () => {
  renderWithProviders(
    <Router>
      <ApplicantTravelForm />
      <TravelReview />
    </Router>,
  );

  const user = userEvent.setup();

  fireEvent.change(screen.getAllByRole("combobox")[0], {
    target: { value: "Government Sponsored" },
  });
  await user.type(screen.getByTestId("address-1"), "Edinburgh Castle, Castlehill");
  await user.type(screen.getByTestId("town-or-city"), "Edinburgh");
  await user.type(screen.getByTestId("postcode"), "EH1 2NG");
  await user.type(screen.getByTestId("mobile-number"), "07321900900");
  await user.type(screen.getByTestId("email"), "sigmund.sigmundson@asgard.gov");

  expect(screen.getAllByRole("combobox")[0]).toHaveValue("Government Sponsored");
  expect(screen.getAllByRole("combobox")[0]).toHaveValue("British National (Overseas)");
  expect(screen.getByTestId("address-1")).toHaveValue("Edinburgh Castle, Castlehill");
  expect(screen.getByTestId("town-or-city")).toHaveValue("Edinburgh");
  expect(screen.getByTestId("postcode")).toHaveValue("EH1 2NG");
  expect(screen.getByTestId("mobile-number")).toHaveValue("07321900900");
  expect(screen.getByTestId("email")).toHaveValue("sigmund.sigmundson@asgard.gov");

  await user.click(screen.getAllByRole("button")[0]);

  expect(screen.getAllByRole("term")[0]).toHaveTextContent("Visa type");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Government Sponsored");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("British National (Overseas)");
  expect(screen.getAllByRole("term")[1]).toHaveTextContent("UK Address Line 1");
  expect(screen.getAllByRole("definition")[2]).toHaveTextContent("Edinburgh Castle, Castlehill");
  expect(screen.getAllByRole("term")[2]).toHaveTextContent("UK Address Line 2");
  expect(screen.getAllByRole("definition")[4]).toHaveTextContent("");
  expect(screen.getAllByRole("term")[3]).toHaveTextContent("UK Town or City");
  expect(screen.getAllByRole("definition")[6]).toHaveTextContent("Edinburgh");
  expect(screen.getAllByRole("term")[4]).toHaveTextContent("UK Postcode");
  expect(screen.getAllByRole("definition")[8]).toHaveTextContent("EH1 2NG");
  expect(screen.getAllByRole("term")[5]).toHaveTextContent("UK Mobile Number");
  expect(screen.getAllByRole("definition")[10]).toHaveTextContent("07321900900");
  expect(screen.getAllByRole("term")[6]).toHaveTextContent("UK Email Address");
  expect(screen.getAllByRole("definition")[12]).toHaveTextContent("sigmund.sigmundson@asgard.gov");
});
