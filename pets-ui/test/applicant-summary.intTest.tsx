import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import ApplicantSummaryPage from "@/pages/applicant-summary";
import ApplicantReview from "@/sections/applicant-details-summary";
import { ApplicationStatus, ImageType } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";
import uploadFile from "@/utils/uploadFile";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

vi.mock("@/utils/uploadFile", () => ({
  __esModule: true,
  default: vi.fn(),
  computeBase64SHA256: vi.fn(),
}));
const mockApplicantPhotoFile = new File(["dummy content"], "photo.jpg", { type: "image/jpeg" });

vi.mock("@/context/applicantPhotoContext", () => ({
  useApplicantPhoto: () => ({
    applicantPhotoFile: mockApplicantPhotoFile,
    setApplicantPhotoFile: vi.fn(),
  }),
}));

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

const user = userEvent.setup();

describe("ApplicantReview", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  test("state is displayed correctly & user is navigated to confirmation page when both api calls are successful", async () => {
    const preloadedState = {
      applicant: {
        status: ApplicationStatus.NOT_YET_STARTED,
        fullName: "Sigmund Sigmundson",
        sex: "Male",
        dateOfBirth: {
          year: "1901",
          month: "1",
          day: "1",
        },
        countryOfNationality: "NOR",
        passportNumber: "1234",
        countryOfIssue: "FIN",
        passportIssueDate: {
          year: "1902",
          month: "feb",
          day: "2",
        },
        passportExpiryDate: {
          year: "2053",
          month: "march",
          day: "3",
        },
        applicantHomeAddress1: "The Bell Tower",
        applicantHomeAddress2: "Hallgrimskirkja",
        applicantHomeAddress3: "Hallgrimstorg 1",
        townOrCity: "Reykjavik",
        provinceOrState: "Reykjavik",
        country: "ISL",
        postcode: "101",
        applicantPhotoFileName: "photo.jpg",
      },
    };

    renderWithProviders(<ApplicantReview />, { preloadedState });

    mock.onPost("/application").reply(200, { applicationId: "abc-123" });
    mock.onPost("/applicant/register/abc-123").reply(200);

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Sigmund Sigmundson");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("Sex");
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("Male");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent("Country of nationality");
    expect(screen.getAllByRole("definition")[4]).toHaveTextContent("NOR");
    expect(screen.getAllByRole("term")[3]).toHaveTextContent("Date of birth");
    expect(screen.getAllByRole("definition")[6]).toHaveTextContent("1/1/1901");
    expect(screen.getAllByRole("term")[4]).toHaveTextContent("Passport number");
    expect(screen.getAllByRole("definition")[8]).toHaveTextContent("1234");
    expect(screen.getAllByRole("term")[5]).toHaveTextContent("Country of issue");
    expect(screen.getAllByRole("definition")[10]).toHaveTextContent("FIN");
    expect(screen.getAllByRole("term")[6]).toHaveTextContent("Passport issue date");
    expect(screen.getAllByRole("definition")[12]).toHaveTextContent("2/feb/1902");
    expect(screen.getAllByRole("term")[7]).toHaveTextContent("Passport expiry date");
    expect(screen.getAllByRole("definition")[14]).toHaveTextContent("3/march/2053");
    expect(screen.getAllByRole("term")[8]).toHaveTextContent("Home address line 1");
    expect(screen.getAllByRole("definition")[16]).toHaveTextContent("The Bell Tower");
    expect(screen.getAllByRole("term")[9]).toHaveTextContent("Home address line 2");
    expect(screen.getAllByRole("definition")[18]).toHaveTextContent("Hallgrimskirkja");
    expect(screen.getAllByRole("term")[10]).toHaveTextContent("Home address line 3");
    expect(screen.getAllByRole("definition")[20]).toHaveTextContent("Hallgrimstorg 1");
    expect(screen.getAllByRole("term")[11]).toHaveTextContent("Town or city");
    expect(screen.getAllByRole("definition")[22]).toHaveTextContent("Reykjavik");
    expect(screen.getAllByRole("term")[12]).toHaveTextContent("Province or state");
    expect(screen.getAllByRole("definition")[24]).toHaveTextContent("Reykjavik");
    expect(screen.getAllByRole("term")[13]).toHaveTextContent("Country");
    expect(screen.getAllByRole("definition")[26]).toHaveTextContent("ISL");
    expect(screen.getAllByRole("term")[14]).toHaveTextContent("Postcode");
    expect(screen.getAllByRole("definition")[28]).toHaveTextContent("101");
    expect(screen.getAllByRole("term")[15]).toHaveTextContent("Applicant Photo");
    expect(screen.getAllByRole("definition")[30]).toHaveTextContent("photo.jpg");

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application");
    expect(mock.history[1].url).toEqual("/applicant/register/abc-123");
    expect(mock.history).toHaveLength(2);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/applicant-confirmation");
  });

  test("user is navigated to error page when first api call is unsuccessful", async () => {
    renderWithProviders(<ApplicantReview />);

    mock.onPost("/application").reply(500);

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("user is navigated to error page when second api call is unsuccessful", async () => {
    renderWithProviders(<ApplicantReview />);

    mock.onPost("/application").reply(200, { applicationId: "abc-123" });
    mock.onPost("/applicant/register/abc-123").reply(500);

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application");
    expect(mock.history[1].url).toEqual("/applicant/register/abc-123");
    expect(mock.history).toHaveLength(2);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("calls uploadFile to upload applicant photo if present", async () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
    };

    renderWithProviders(<ApplicantReview />, { preloadedState });

    await user.click(screen.getByRole("button"));

    expect(uploadFile).toHaveBeenCalledWith(
      mockApplicantPhotoFile,
      "applicant-photo.jpg",
      "abc-123",
      ImageType.Photo,
    );
  });

  test("back link points to tracker when status is complete", () => {
    const preloadedState = {
      applicant: {
        status: ApplicationStatus.COMPLETE,
        fullName: "Sigmund Sigmundson",
        sex: "Male",
        dateOfBirth: {
          year: "1901",
          month: "1",
          day: "1",
        },
        countryOfNationality: "NOR",
        passportNumber: "1234",
        countryOfIssue: "FIN",
        passportIssueDate: {
          year: "1902",
          month: "feb",
          day: "2",
        },
        passportExpiryDate: {
          year: "2053",
          month: "march",
          day: "3",
        },
        applicantHomeAddress1: "The Bell Tower",
        applicantHomeAddress2: "Hallgrimskirkja",
        applicantHomeAddress3: "Hallgrimstorg 1",
        townOrCity: "Reykjavik",
        provinceOrState: "Reykjavik",
        country: "ISL",
        postcode: "101",
        applicantPhotoFileName: "photo.jpg",
      },
    };

    renderWithProviders(<ApplicantSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("back link points to applicant photo page when status is not complete", () => {
    const preloadedState = {
      applicant: {
        status: ApplicationStatus.IN_PROGRESS,
        fullName: "Sigmund Sigmundson",
        sex: "Male",
        dateOfBirth: {
          year: "1901",
          month: "1",
          day: "1",
        },
        countryOfNationality: "NOR",
        passportNumber: "1234",
        countryOfIssue: "FIN",
        passportIssueDate: {
          year: "1902",
          month: "feb",
          day: "2",
        },
        passportExpiryDate: {
          year: "2053",
          month: "march",
          day: "3",
        },
        applicantHomeAddress1: "The Bell Tower",
        applicantHomeAddress2: "Hallgrimskirkja",
        applicantHomeAddress3: "Hallgrimstorg 1",
        townOrCity: "Reykjavik",
        provinceOrState: "Reykjavik",
        country: "ISL",
        postcode: "101",
        applicantPhotoFileName: "photo.jpg",
      },
    };

    renderWithProviders(<ApplicantSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/applicant-photo");
    expect(link).toHaveClass("govuk-back-link");
  });
});
