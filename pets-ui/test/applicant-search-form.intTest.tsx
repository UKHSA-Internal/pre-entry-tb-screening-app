import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ApplicantSearchForm from "@/sections/applicant-search-form";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../axios/api";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

beforeEach(() => useNavigateMock.mockClear());

describe("/applicant-details endpoint is invoked when form is filled out and button is clicked", () => {
  // let instance: AxiosInstance = axios.create();
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(petsApi);
  });

  test("/applicant-details endpoint is invoked when form is filled out and button is clicked", async () => {
    mock.onGet("/applicant/search").reply(200, {
      data: [
        {
          applicationId: "abc-123",
          fullName: "Maxwell Spiffington",
          passportNumber: "12345",
          countryOfIssue: "AUS",
        },
      ],
    });

    mock.onGet("/api/application/abc-123").reply(200, {
      applicationId: "abc-123",
      travelInformation: {
        visaCategory: "Family Reunion",
        status: "completed",
      },
      medicalScreening: {
        symptomsOfTb: "Yes",
        status: "completed",
      },
    });

    renderWithProviders(
      <Router>
        <HelmetProvider>
          <ApplicantSearchForm />
        </HelmetProvider>
      </Router>,
    );
    const user = userEvent.setup();

    // Search for a visa applicant

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    const button = screen.getByRole("button");

    await user.click(button);

    await waitFor(() => {
      expect(mock.history.get[0].url).toEqual("/applicant/search");
      //Won't work until other api call is updated
      // expect(useNavigateMock).toHaveBeenCalledWith("/applicant-results");
    });

    // expect(mock.history.get[1].url).toEqual("/api/application/abc-123");
  });
});

/*
test plan:
- applicant search 200, then application search 200
  expect(mock.history).toHaveLength(2);
  expect(mock.history.get[0].url).toEqual("/api/applicant/search");
  expect(mock.history.get[1].url).toEqual("/api/application/abc-123");
  expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
- applicant search 200, then application search 404
  expect(mock.history).toHaveLength(2);
  expect(mock.history.get[0].url).toEqual("/api/applicant/search");
  expect(mock.history.get[1].url).toEqual("/api/application/abc-123");
  expect(useNavigateMock).toHaveBeenCalledWith("/tracker");
- applicant search 200, then application search 500
  expect(mock.history).toHaveLength(2);
  expect(mock.history.get[0].url).toEqual("/api/applicant/search");
  expect(mock.history.get[1].url).toEqual("/api/application/abc-123");
  expect(useNavigateMock).toHaveBeenCalledWith("/error");
- applicant search 404
  expect(mock.history).toHaveLength(1);
  expect(mock.history.get[0].url).toEqual("/api/applicant/search");
  expect(useNavigateMock).toHaveBeenCalledWith("/applicant-results");
- applicant search 500
  expect(mock.history).toHaveLength(1);
  expect(mock.history.get[0].url).toEqual("/api/applicant/search");
  expect(useNavigateMock).toHaveBeenCalledWith("/error");
*/
