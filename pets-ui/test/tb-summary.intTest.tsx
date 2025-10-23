import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import { ApplicantPhotoProvider } from "@/context/applicantPhotoContext";
import TbSummaryPage from "@/pages/tb-summary";
import { ReduxTbCertificateType } from "@/types";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const tbState: ReduxTbCertificateType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  isIssued: YesOrNo.YES,
  comments: "Extra Details",
  certificateDate: {
    year: "2025",
    month: "03",
    day: "25",
  },
  certificateNumber: "12345",
  declaringPhysicianName: "Test Testov",
  clinic: {
    clinicId: "UK/LHR/00",
    name: "PETS Test Clinic",
    city: "London",
    country: "GBR",
    startDate: "2025-04-01",
    endDate: null,
    createdBy: "tmp@email.com",
  },
};

describe("TBSummaryPage", () => {
  let mock: MockAdapter;
  const user = userEvent.setup();

  describe("General UI Tests", () => {
    beforeEach(() => {
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
      );
    });

    it("displays the back link", () => {
      const link = screen.getByRole("link", { name: "Back" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/enter-clinic-certificate-information");
      expect(link).toHaveClass("govuk-back-link");
    });

    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Check certificate information")).toBeInTheDocument();
    });
  });

  describe("TB Summary Data & post request", () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      tbCertificate: { ...tbState },
    };

    beforeEach(() => {
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState },
      );
      mock = new MockAdapter(petsApi);
      useNavigateMock.mockClear();
    });

    it("renders the page titles and data ", () => {
      expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
      expect(screen.getAllByText("Physician's comments")[0]).toBeInTheDocument();
      expect(screen.getByText("Extra Details")).toBeInTheDocument();
      expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
      expect(screen.getByText("25 March 2025")).toBeInTheDocument();
    });

    it("when post request returns client-side error then user is navigated to /sorry-there-is-problem-with-service", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(400);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });

    it("when post request returns server-side error then user is navigated to /sorry-there-is-problem-with-service", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(500);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });

    it("when continue pressed, it navigates to /tb-screening-complete", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(200);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-screening-complete");
    });

    it("shows change links to other tasks", () => {
      const completeState = {
        application: { applicationId: "abc-123", dateCreated: "" },
        applicant: {
          status: ApplicationStatus.COMPLETE,
          fullName: "John Smith",
          sex: "Male",
          dateOfBirth: { year: "1970", month: "1", day: "1" },
          countryOfNationality: "GBR",
          passportNumber: "12345",
          countryOfIssue: "GBR",
          passportIssueDate: { year: "2020", month: "1", day: "1" },
          passportExpiryDate: { year: "2030", month: "1", day: "1" },
          applicantHomeAddress1: "1 Street",
          applicantHomeAddress2: "",
          applicantHomeAddress3: "",
          townOrCity: "London",
          provinceOrState: "Greater London",
          country: "GBR",
          postcode: "0000 111",
          applicantPhotoFileName: "photo.jpg",
        },
        travel: {
          status: ApplicationStatus.COMPLETE,
          visaCategory: "Work",
          applicantUkAddress1: "1 Street",
          applicantUkAddress2: "",
          applicantUkAddress3: "",
          townOrCity: "London",
          postcode: "0000 111",
          ukEmail: "test@example.co.uk",
          ukMobileNumber: "07123456789",
        },
        tbCertificate: {
          ...tbState,
          status: ApplicationStatus.IN_PROGRESS,
        },
      };
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState: completeState },
      );

      const changeLinks = screen.getAllByRole("link", { name: /Change/ });
      expect(changeLinks.length).toBeGreaterThan(0);
    });

    it("Change link for name redirects to applicant details page", () => {
      const completeState = {
        application: { applicationId: "abc-123", dateCreated: "" },
        applicant: {
          status: ApplicationStatus.COMPLETE,
          fullName: "John Smith",
          sex: "Male",
          dateOfBirth: { year: "1970", month: "1", day: "1" },
          countryOfNationality: "GBR",
          passportNumber: "12345",
          countryOfIssue: "GBR",
          passportIssueDate: { year: "2020", month: "1", day: "1" },
          passportExpiryDate: { year: "2030", month: "1", day: "1" },
          applicantHomeAddress1: "1 Street",
          applicantHomeAddress2: "",
          applicantHomeAddress3: "",
          townOrCity: "London",
          provinceOrState: "Greater London",
          country: "GBR",
          postcode: "0000 111",
          applicantPhotoFileName: "photo.jpg",
        },
        travel: {
          status: ApplicationStatus.COMPLETE,
          visaCategory: "Work",
          applicantUkAddress1: "1 Street",
          applicantUkAddress2: "",
          applicantUkAddress3: "",
          townOrCity: "London",
          postcode: "0000 111",
          ukEmail: "test@example.co.uk",
          ukMobileNumber: "07123456789",
        },
        tbCertificate: {
          ...tbState,
          status: ApplicationStatus.IN_PROGRESS,
        },
      };
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState: completeState },
      );

      const nameChangeLinks = screen.getAllByRole("link", { name: "Change Name" });
      expect(nameChangeLinks[0]).toHaveAttribute(
        "href",
        "/enter-applicant-information?from=tb#name",
      );
    });

    it("Change link for visa category redirects to visa category page", () => {
      const completeState = {
        application: { applicationId: "abc-123", dateCreated: "" },
        applicant: {
          status: ApplicationStatus.COMPLETE,
          fullName: "John Smith",
          sex: "Male",
          dateOfBirth: { year: "1970", month: "1", day: "1" },
          countryOfNationality: "GBR",
          passportNumber: "12345",
          countryOfIssue: "GBR",
          passportIssueDate: { year: "2020", month: "1", day: "1" },
          passportExpiryDate: { year: "2030", month: "1", day: "1" },
          applicantHomeAddress1: "1 Street",
          applicantHomeAddress2: "",
          applicantHomeAddress3: "",
          townOrCity: "London",
          provinceOrState: "Greater London",
          country: "GBR",
          postcode: "0000 111",
          applicantPhotoFileName: "photo.jpg",
        },
        travel: {
          status: ApplicationStatus.COMPLETE,
          visaCategory: "Work",
          applicantUkAddress1: "1 Street",
          applicantUkAddress2: "",
          applicantUkAddress3: "",
          townOrCity: "London",
          postcode: "0000 111",
          ukEmail: "test@example.co.uk",
          ukMobileNumber: "07123456789",
        },
        tbCertificate: {
          ...tbState,
          status: ApplicationStatus.IN_PROGRESS,
        },
      };
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState: completeState },
      );

      const visaCategoryChangeLinks = screen.getAllByRole("link", {
        name: "Change UKVI visa category",
      });
      expect(visaCategoryChangeLinks[0]).toHaveAttribute(
        "href",
        "/proposed-visa-category#visa-category",
      );
    });

    it("Change link for UK address redirects to UK address page", () => {
      const completeState = {
        application: { applicationId: "abc-123", dateCreated: "" },
        applicant: {
          status: ApplicationStatus.COMPLETE,
          fullName: "John Smith",
          sex: "Male",
          dateOfBirth: { year: "1970", month: "1", day: "1" },
          countryOfNationality: "GBR",
          passportNumber: "12345",
          countryOfIssue: "GBR",
          passportIssueDate: { year: "2020", month: "1", day: "1" },
          passportExpiryDate: { year: "2030", month: "1", day: "1" },
          applicantHomeAddress1: "1 Street",
          applicantHomeAddress2: "",
          applicantHomeAddress3: "",
          townOrCity: "London",
          provinceOrState: "Greater London",
          country: "GBR",
          postcode: "0000 111",
          applicantPhotoFileName: "photo.jpg",
        },
        travel: {
          status: ApplicationStatus.COMPLETE,
          visaCategory: "Work",
          applicantUkAddress1: "1 Street",
          applicantUkAddress2: "",
          applicantUkAddress3: "",
          townOrCity: "London",
          postcode: "0000 111",
          ukEmail: "test@example.co.uk",
          ukMobileNumber: "07123456789",
        },
        tbCertificate: {
          ...tbState,
          status: ApplicationStatus.IN_PROGRESS,
        },
      };
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState: completeState },
      );

      const ukAddressChangeLinks = screen.getAllByRole("link", {
        name: "Change UK address line 1",
      });
      expect(ukAddressChangeLinks[0]).toHaveAttribute(
        "href",
        "/visa-applicant-proposed-uk-address#address-1",
      );
    });
  });

  describe("TB Summary change link restrictions", () => {
    it("does not show Change link for Passport number", () => {
      const preloadedState = {
        application: { applicationId: "abc-123", dateCreated: "" },
        applicant: {
          status: ApplicationStatus.COMPLETE,
          fullName: "John Smith",
          sex: "Male",
          dateOfBirth: { year: "1970", month: "1", day: "1" },
          countryOfNationality: "GBR",
          passportNumber: "12345",
          countryOfIssue: "GBR",
          passportIssueDate: { year: "2020", month: "1", day: "1" },
          passportExpiryDate: { year: "2030", month: "1", day: "1" },
          applicantHomeAddress1: "1 Street",
          applicantHomeAddress2: "",
          applicantHomeAddress3: "",
          townOrCity: "London",
          provinceOrState: "Greater London",
          country: "GBR",
          postcode: "0000 111",
          applicantPhotoFileName: "photo.jpg",
        },
        travel: {
          status: ApplicationStatus.COMPLETE,
          visaCategory: "Work",
          applicantUkAddress1: "1 Street",
          applicantUkAddress2: "",
          applicantUkAddress3: "",
          townOrCity: "London",
          postcode: "0000 111",
          ukEmail: "test@example.co.uk",
          ukMobileNumber: "07123456789",
        },
        tbCertificate: {
          ...tbState,
          status: ApplicationStatus.IN_PROGRESS,
        },
      };
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState },
      );

      expect(
        screen.queryByRole("link", { name: "Change Passport number" }),
      ).not.toBeInTheDocument();
    });
  });
});
