import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Mock } from "vitest";

import ApplicantSearchForm from "@/sections/applicant-search-form";
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
  http.get("http://localhost:3005/dev/applicant-details", async ({ request }) => {
    const newPost = await request.json();
    console.log(newPost);
    const url = new URL(request.url);
    const passportNumber = url.searchParams.get("passportNumber");
    const countryOfIssue = url.searchParams.get("countryOfIssue");
    if (passportNumber != "12345" || countryOfIssue != "AUS") {
      throw new Error("Unexpected query parameters");
    }
    return HttpResponse.json({}, { status: 200 });
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("/applicant-details endpoint is invoked when form is filled out and button is clicked", async () => {
  renderWithProviders(<ApplicantSearchForm />);

  const user = userEvent.setup();

  await user.type(screen.getByTestId("passportNumber"), "12345");
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

  expect(screen.getByTestId("passportNumber")).toHaveValue("12345");
  expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

  await user.click(screen.getByRole("button"));
  expect(useNavigateMock).toBeCalled();
});
