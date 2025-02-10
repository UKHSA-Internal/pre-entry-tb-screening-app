import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("/applicant-details endpoint is invoked when form is filled out and button is clicked", async () => {
  renderWithProviders(<ApplicantSearchForm />);

  const user = userEvent.setup();

  await user.type(screen.getByTestId("passport-number"), "12345");
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

  expect(screen.getByTestId("passport-number")).toHaveValue("12345");
  expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

  await user.click(screen.getByRole("button"));
  expect(useNavigateMock).toBeCalled();
});

test("submits the form and handles successful applicant with an application (Passport 007)", async () => {
  renderWithProviders(<ApplicantSearchForm />);

  const user = userEvent.setup();

  await user.type(screen.getByTestId("passport-number"), "007");
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

  await act(async () => {
    fireEvent.click(screen.getByText("Search"));
  });

  expect(useNavigateMock).toBeCalled();
  expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
});

test("submits the form and handles successful applicant without an application (Passport 008)", async () => {
  renderWithProviders(<ApplicantSearchForm />);

  const user = userEvent.setup();

  await user.type(screen.getByTestId("passport-number"), "009");
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

  await act(async () => {
    fireEvent.click(screen.getByText("Search"));
  });

  expect(useNavigateMock).toBeCalled();
  expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
});

test("handles applicant not found (Passport 009)", async () => {
  renderWithProviders(<ApplicantSearchForm />);

  const user = userEvent.setup();

  await user.type(screen.getByTestId("passport-number"), "009");
  fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

  await act(async () => {
    fireEvent.click(screen.getByText("Search"));
  });

  expect(useNavigateMock).toBeCalled();
  expect(useNavigateMock).toHaveBeenCalledWith("/applicant-results");
});
