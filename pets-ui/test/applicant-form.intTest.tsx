import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ApplicantForm from "@/sections/applicant-details-form";
import ApplicantReview from "@/sections/applicant-details-summary";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

export const handlers = [
  http.post("http://localhost:3005/dev/register-applicant", () => {
    return HttpResponse.json({}, { status: 201 });
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("state is updated from ApplicantForm and then read by ApplicantReview", async () => {
  renderWithProviders(
    <Router>
      <ApplicantForm />
      <ApplicantReview />
    </Router>,
  );

  const user = userEvent.setup();

  await user.type(screen.getByTestId("name"), "Sigmund Sigmundson");
  await user.click(screen.getAllByTestId("sex")[1]);
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "NOR" } });
  await user.type(screen.getByTestId("birth-date-day"), "1");
  await user.type(screen.getByTestId("birth-date-month"), "1");
  await user.type(screen.getByTestId("birth-date-year"), "1901");
  await user.type(screen.getByTestId("passport-number"), "1234");
  fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "FIN" } });
  await user.type(screen.getByTestId("passport-issue-date-day"), "2");
  await user.type(screen.getByTestId("passport-issue-date-month"), "feb");
  await user.type(screen.getByTestId("passport-issue-date-year"), "1902");
  await user.type(screen.getByTestId("passport-expiry-date-day"), "3");
  await user.type(screen.getByTestId("passport-expiry-date-month"), "march");
  await user.type(screen.getByTestId("passport-expiry-date-year"), "2053");
  await user.type(screen.getByTestId("address-1"), "The Bell Tower");
  await user.type(screen.getByTestId("address-2"), "Hallgrimskirkja");
  await user.type(screen.getByTestId("address-3"), "Hallgrimstorg 1");
  await user.type(screen.getByTestId("town-or-city"), "Reykjavik");
  await user.type(screen.getByTestId("province-or-state"), "Reykjavik");
  fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "ISL" } });
  await user.type(screen.getByTestId("postcode"), "101");

  expect(screen.getByTestId("name")).toHaveValue("Sigmund Sigmundson");
  expect(screen.getAllByTestId("sex")[0]).not.toBeChecked();
  expect(screen.getAllByTestId("sex")[1]).toBeChecked();
  expect(screen.getAllByRole("combobox")[0]).toHaveValue("NOR");
  expect(screen.getByTestId("birth-date-day")).toHaveValue("1");
  expect(screen.getByTestId("birth-date-month")).toHaveValue("1");
  expect(screen.getByTestId("birth-date-year")).toHaveValue("1901");
  expect(screen.getByTestId("passport-number")).toHaveValue("1234");
  expect(screen.getAllByRole("combobox")[1]).toHaveValue("FIN");
  expect(screen.getByTestId("passport-issue-date-day")).toHaveValue("2");
  expect(screen.getByTestId("passport-issue-date-month")).toHaveValue("feb");
  expect(screen.getByTestId("passport-issue-date-year")).toHaveValue("1902");
  expect(screen.getByTestId("passport-expiry-date-day")).toHaveValue("3");
  expect(screen.getByTestId("passport-expiry-date-month")).toHaveValue("march");
  expect(screen.getByTestId("passport-expiry-date-year")).toHaveValue("2053");
  expect(screen.getByTestId("address-1")).toHaveValue("The Bell Tower");
  expect(screen.getByTestId("address-2")).toHaveValue("Hallgrimskirkja");
  expect(screen.getByTestId("address-3")).toHaveValue("Hallgrimstorg 1");
  expect(screen.getByTestId("town-or-city")).toHaveValue("Reykjavik");
  expect(screen.getByTestId("province-or-state")).toHaveValue("Reykjavik");
  expect(screen.getAllByRole("combobox")[2]).toHaveValue("ISL");
  expect(screen.getByTestId("postcode")).toHaveValue("101");

  await user.click(screen.getAllByRole("button")[0]);

  expect(useNavigateMock).toHaveBeenCalledOnce();

  expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Sigmund Sigmundson");
  expect(screen.getAllByRole("term")[1]).toHaveTextContent("Sex");
  expect(screen.getAllByRole("definition")[2]).toHaveTextContent("male");
  expect(screen.getAllByRole("term")[2]).toHaveTextContent("Country of Nationality");
  expect(screen.getAllByRole("definition")[4]).toHaveTextContent("NOR");
  expect(screen.getAllByRole("term")[3]).toHaveTextContent("Date of Birth");
  expect(screen.getAllByRole("definition")[6]).toHaveTextContent("1/1/1901");
  expect(screen.getAllByRole("term")[4]).toHaveTextContent("Passport number");
  expect(screen.getAllByRole("definition")[8]).toHaveTextContent("1234");
  expect(screen.getAllByRole("term")[5]).toHaveTextContent("Country of Issue");
  expect(screen.getAllByRole("definition")[10]).toHaveTextContent("FIN");
  expect(screen.getAllByRole("term")[6]).toHaveTextContent("Passport Issue Date");
  expect(screen.getAllByRole("definition")[12]).toHaveTextContent("2/feb/1902");
  expect(screen.getAllByRole("term")[7]).toHaveTextContent("Passport Expiry Date");
  expect(screen.getAllByRole("definition")[14]).toHaveTextContent("3/march/2053");
  expect(screen.getAllByRole("term")[8]).toHaveTextContent("Home Address Line 1");
  expect(screen.getAllByRole("definition")[16]).toHaveTextContent("The Bell Tower");
  expect(screen.getAllByRole("term")[9]).toHaveTextContent("Home Address Line 2");
  expect(screen.getAllByRole("definition")[18]).toHaveTextContent("Hallgrimskirkja");
  expect(screen.getAllByRole("term")[10]).toHaveTextContent("Home Address Line 3");
  expect(screen.getAllByRole("definition")[20]).toHaveTextContent("Hallgrimstorg 1");
  expect(screen.getAllByRole("term")[11]).toHaveTextContent("Town or City");
  expect(screen.getAllByRole("definition")[22]).toHaveTextContent("Reykjavik");
  expect(screen.getAllByRole("term")[12]).toHaveTextContent("Province or State");
  expect(screen.getAllByRole("definition")[24]).toHaveTextContent("Reykjavik");
  expect(screen.getAllByRole("term")[13]).toHaveTextContent("Country");
  expect(screen.getAllByRole("definition")[26]).toHaveTextContent("ISL");
  expect(screen.getAllByRole("term")[14]).toHaveTextContent("Postcode");
  expect(screen.getAllByRole("definition")[28]).toHaveTextContent("101");

  await user.click(screen.getAllByRole("button")[1]);

  expect(useNavigateMock).toHaveBeenCalledTimes(2);
});
