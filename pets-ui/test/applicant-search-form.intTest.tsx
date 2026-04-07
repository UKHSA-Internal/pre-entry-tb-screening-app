import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Mock } from "vitest";

import { ApplicantPhotoProvider } from "@/context/applicantPhotoContext";
import type { AppDispatch } from "@/redux/store";
import ApplicantSearchForm from "@/sections/applicant-search-form";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../src/api/api";

vi.mock("@/utils/clinic", () => ({
  fetchClinic: (dispatch: AppDispatch) => {
    dispatch({
      type: "tbCertificateDetails/setClinic",
      payload: {
        clinicId: "UK/LHR/00",
        name: "PETS Test Clinic",
        city: "London",
        country: "GBR",
        startDate: "2025-04-01",
        endDate: null,
        createdBy: "tmp@email.com",
      },
    });
  },
}));

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

let originalCreateObjectURL: typeof URL.createObjectURL;
beforeAll(() => {
  originalCreateObjectURL = global.URL.createObjectURL?.bind(global.URL);
  global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test-photo.jpg");
});
afterAll(() => {
  global.URL.createObjectURL = originalCreateObjectURL;
});

vi.mock("@/context/applicantPhotoContext", async () => {
  const actual = await import("@/context/applicantPhotoContext");
  return {
    ...actual,
  };
});

describe("ApplicantSearchForm", () => {
  let mock: MockAdapter;
  const originalFetch = global.fetch;
  const successfulFetchMock = vi.fn<typeof fetch>(function _successfulFetchMock(
    _input: RequestInfo | URL,
    _init?: RequestInit,
  ) {
    void _input;
    void _init;
    const blob = new Blob(["dummy"], { type: "image/jpeg" });
    return Promise.resolve(new Response(blob, { status: 200 }));
  });
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
    global.fetch = successfulFetchMock;
  });
  afterEach(() => {
    global.fetch = originalFetch;
    successfulFetchMock.mockClear();
  });

  test("page text & fields render correctly & correct errors show when fields are not filled in", async () => {
    renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    expect(screen.getByText("Search for a visa applicant")).toBeInTheDocument();
    expect(screen.getByText("Visa applicant's passport number")).toBeInTheDocument();
    expect(screen.getByText("For example, 1208297A")).toBeInTheDocument();
    expect(screen.getByText("Country of issue")).toBeInTheDocument();
    expect(
      screen.getByText("As shown on passport, at the top of the first page"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getAllByText("Enter the applicant's passport number")).toHaveLength(2);
      expect(screen.getAllByText("Select the country of issue")).toHaveLength(2);
    });
  });

  test("correct errors show when freeText field has an input over 256 chars", async () => {
    const input256Chars =
      "abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd";

    renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    await user.type(screen.getByTestId("passport-number"), input256Chars + "x");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getAllByText(`"Visa applicant's passport number" must be 256 characters or less`),
      ).toHaveLength(2);
    });

    await user.clear(screen.getByTestId("passport-number"));
    await user.type(screen.getByTestId("passport-number"), input256Chars);
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.queryByText(`"Visa applicant's passport number" must be 256 characters or less`),
      ).not.toBeInTheDocument();
    });
  });

  test("store is correctly populated and user is navigated to screening history page on a 200 response", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, {
      status: "completed",
      fullName: "Maxwell Spiffington",
      sex: "Male",
      dateOfBirth: "1991-01-01",
      countryOfNationality: "AUS",
      passportNumber: "12345",
      countryOfIssue: "AUS",
      issueDate: "1992-02-02",
      expiryDate: "2053-03-03",
      applicantHomeAddress1: "1 Ayres Rock Way",
      townOrCity: "Sydney",
      provinceOrState: "New South Wales",
      country: "Australia",
      applications: [
        {
          applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
          applicationStatus: "In progress",
          clinicId: "UK/LHR/00/",
        },
      ],
      dateCreated: "2025-01-01",
    });

    await user.type(screen.getByTestId("passport-number"), "12345");
    const countryDropdown = screen.getByRole("combobox");
    await user.selectOptions(countryDropdown, "AUS");

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(countryDropdown).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/screening-history");

    expect(store.getState().applicationsList).toMatchObject([
      {
        applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        applicationStatus: "In progress",
        clinicId: "UK/LHR/00/",
      },
    ]);
  });

  test("user is navigated to no applicant found page on a 404 response", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(404);

    await user.type(screen.getByTestId("passport-number"), "12345");
    const countryDropdown = screen.getByRole("combobox");
    await user.selectOptions(countryDropdown, "AUS");

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(countryDropdown).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/no-visa-applicant-found");

    expect(store.getState().applicationsList).toMatchObject([]);
  });

  test("user is navigated to error page on a 500 response", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(500);

    await user.type(screen.getByTestId("passport-number"), "12345");
    const countryDropdown = screen.getByRole("combobox");
    await user.selectOptions(countryDropdown, "AUS");

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(countryDropdown).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");

    expect(store.getState().applicationsList).toMatchObject([]);
  });

  test("user is navigated to error page on a 200 response with an invalid application id", async () => {
    renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, {
      status: "completed",
      fullName: "Maxwell Spiffington",
      sex: "Male",
      dateOfBirth: "1991-01-01",
      countryOfNationality: "AUS",
      passportNumber: "12345",
      countryOfIssue: "AUS",
      issueDate: "1992-02-02",
      expiryDate: "2053-03-03",
      applicantHomeAddress1: "1 Ayres Rock Way",
      townOrCity: "Sydney",
      provinceOrState: "New South Wales",
      country: "Australia",
      applications: [
        {
          applicationId: "not-a-uuid",
          applicationStatus: "In progress",
          clinicId: "UK/LHR/00/",
        },
      ],
      dateCreated: "2025-01-01",
    });

    await user.type(screen.getByTestId("passport-number"), "12345");
    const countryDropdown = screen.getByRole("combobox");
    await user.selectOptions(countryDropdown, "AUS");

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(countryDropdown).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
  });
});
