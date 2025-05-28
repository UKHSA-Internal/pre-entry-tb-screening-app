import { screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import ApplicantDataHeader from "./applicantDataHeader";

const applicantData = {
  status: ApplicationStatus.INCOMPLETE,
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
  it("correctly displays values", () => {
    renderWithProviders(
      <Router>
        <ApplicantDataHeader applicantData={applicantData} />
      </Router>,
    );

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("Date of birth");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent("Passport number");

    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("full name");
    expect(screen.getAllByRole("definition")[1]).toHaveTextContent("01/02/1980");
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("12345");
  });
});
