import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, Mock } from "vitest";

import ChestXrayQuestionPage from "@/pages/chest-xray-question";
import { TaskStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

beforeEach(() => {
  localStorage.setItem("cookie-consent", "rejected");
});

afterEach(() => {
  localStorage.clear();
});

describe("ChestXrayQuestionForm", () => {
  beforeEach(() => {
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayQuestionPage />
      </HelmetProvider>,
    );
  });

  const user = userEvent.setup();

  it("displays the back link", () => {
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/record-medical-history-tb-symptoms");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("renders the page titles and descriptions ", () => {
    expect(screen.getByText("Is an X-ray required?")).toBeInTheDocument();
  });

  it("renders an error when continue button pressed but required question not answered", async () => {
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      expect(screen.getAllByText("Select yes if an X-ray is required")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Select yes if an X-ray is required")[1]).toBeInTheDocument();
      expect(screen.getAllByText("Select yes if an X-ray is required")[0]).toHaveAttribute(
        "aria-label",
        "Error: Select yes if an X-ray is required",
      );
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("does not render an error if continue button not clicked with no answer provided", () => {
    expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Select yes if an X-ray is required")).not.toBeInTheDocument();
  });

  it("when yes selected and continue pressed, it navigates to /check-medical-history-and-tb-symptoms", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[0]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-medical-history-and-tb-symptoms");
  });

  it("when no selected and continue pressed, it navigates to /reason-x-ray-not-required", async () => {
    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[1]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/reason-x-ray-not-required");
  });

  it("back link points to female Qs form if applicant is female & over 11", () => {
    const preloadedState = {
      applicant: {
        status: TaskStatus.COMPLETE,
        fullName: "Full Name",
        sex: "Female",
        dateOfBirth: { year: "1990", month: "1", day: "1" },
        countryOfNationality: "",
        passportNumber: "0987",
        countryOfIssue: "",
        passportIssueDate: { year: "", month: "", day: "" },
        passportExpiryDate: { year: "", month: "", day: "" },
        applicantHomeAddress1: "",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "",
        provinceOrState: "",
        country: "",
        postcode: "",
      },
    };

    cleanup();
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayQuestionPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/medical-history-female");
  });

  it("back link points to female Qs form if applicant is female & under 11", () => {
    const preloadedState = {
      applicant: {
        status: TaskStatus.COMPLETE,
        fullName: "Full Name",
        sex: "Female",
        dateOfBirth: { year: "2020", month: "1", day: "1" },
        countryOfNationality: "",
        passportNumber: "0987",
        countryOfIssue: "",
        passportIssueDate: { year: "", month: "", day: "" },
        passportExpiryDate: { year: "", month: "", day: "" },
        applicantHomeAddress1: "",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "",
        provinceOrState: "",
        country: "",
        postcode: "",
      },
    };

    cleanup();
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayQuestionPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/medical-history-female");
  });

  it("back link points to under 11 Qs form if applicant is male & under 11", () => {
    const preloadedState = {
      applicant: {
        status: TaskStatus.COMPLETE,
        fullName: "Full Name",
        sex: "Male",
        dateOfBirth: { year: "2020", month: "1", day: "1" },
        countryOfNationality: "",
        passportNumber: "0987",
        countryOfIssue: "",
        passportIssueDate: { year: "", month: "", day: "" },
        passportExpiryDate: { year: "", month: "", day: "" },
        applicantHomeAddress1: "",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "",
        provinceOrState: "",
        country: "",
        postcode: "",
      },
    };

    cleanup();
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayQuestionPage />
      </HelmetProvider>,
      { preloadedState },
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/medical-history-under-11-years-old");
  });
});
