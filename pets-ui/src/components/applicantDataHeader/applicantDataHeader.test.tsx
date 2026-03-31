import { screen } from "@testing-library/react";

import { ApplicationStatus, TaskStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import ApplicantDataHeader from "./applicantDataHeader";

const applicantData = {
  status: TaskStatus.NOT_YET_STARTED,
  fullName: "full name",
  sex: "male",
  dateOfBirth: {
    year: "1980",
    month: "02",
    day: "01",
  },
  countryOfNationality: "ARG",
  passportNumber: "12345",
  countryOfIssue: "BRB",
  passportIssueDate: {
    year: "1985",
    month: "04",
    day: "03",
  },
  passportExpiryDate: {
    year: "2050",
    month: "06",
    day: "05",
  },
  applicantHomeAddress1: "address 1",
  applicantHomeAddress2: "address 2",
  applicantHomeAddress3: "address 3",
  townOrCity: "town",
  provinceOrState: "state",
  country: "AFG",
  postcode: "p0stc0de",
};

describe("applicantDataHeader", () => {
  it("correctly displays values when applicationStatus specified and showCountryOfIssue is false", () => {
    renderWithProviders(
      <ApplicantDataHeader
        applicantData={applicantData}
        applicationStatus={ApplicationStatus.IN_PROGRESS}
        showCountryOfIssue={false}
      />,
    );

    expect(screen.getAllByRole("rowheader")[0]).toHaveTextContent("Name");
    expect(screen.getAllByRole("rowheader")[1]).toHaveTextContent("Date of birth");
    expect(screen.getAllByRole("rowheader")[2]).toHaveTextContent("Passport number");
    expect(screen.getAllByRole("rowheader")[3]).toHaveTextContent("TB screening");

    expect(screen.getAllByRole("cell")[0]).toHaveTextContent("full name");
    expect(screen.getAllByRole("cell")[1]).toHaveTextContent("1 February 1980");
    expect(screen.getAllByRole("cell")[2]).toHaveTextContent("12345");
    expect(screen.getAllByRole("cell")[3]).toHaveTextContent("In progress");

    expect(screen.queryByText("Country of Issue")).not.toBeInTheDocument();
  });

  it("correctly displays values when applicationStatus not specified and showCountryOfIssue is true", () => {
    renderWithProviders(
      <ApplicantDataHeader applicantData={applicantData} showCountryOfIssue={true} />,
    );

    expect(screen.getAllByRole("rowheader")[0]).toHaveTextContent("Name");
    expect(screen.getAllByRole("rowheader")[1]).toHaveTextContent("Date of birth");
    expect(screen.getAllByRole("rowheader")[2]).toHaveTextContent("Passport number");
    expect(screen.getAllByRole("rowheader")[3]).toHaveTextContent("Country of issue");

    expect(screen.getAllByRole("cell")[0]).toHaveTextContent("full name");
    expect(screen.getAllByRole("cell")[1]).toHaveTextContent("1 February 1980");
    expect(screen.getAllByRole("cell")[2]).toHaveTextContent("12345");
    expect(screen.getAllByRole("cell")[3]).toHaveTextContent("Barbados");

    expect(screen.queryByText("TB screening")).not.toBeInTheDocument();
  });
});
