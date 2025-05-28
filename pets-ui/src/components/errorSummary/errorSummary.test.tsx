import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ErrorSummary from "./errorSummary";

const errorsToShow = ["errorToDisplay"];
const errors = {
  errorToDisplay: {
    message: "There is an error on this page",
    type: "required",
  },
};

const multipleErrorsToShow = ["errorToDisplay", "anotherErrorToDisplay"];
const multipleErrors = {
  errorToDisplay: {
    message: "There is an error on this page",
    type: "required",
  },
  anotherErrorToDisplay: {
    message: "There is an additonal error on this page",
    type: "required",
  },
};

describe("Error Summary Component", () => {
  it("renders correctly when props are specified", () => {
    render(<ErrorSummary errorsToShow={errorsToShow} errors={errors} />);
    expect(screen.getByText("There is a problem")).toBeInTheDocument();
    expect(screen.getByText("There is an error on this page")).toBeInTheDocument();
  });

  it("renders multiple errors correctly when props are specified", () => {
    render(<ErrorSummary errorsToShow={multipleErrorsToShow} errors={multipleErrors} />);
    expect(screen.getByText("There is a problem")).toBeInTheDocument();
    expect(screen.getByText("There is an error on this page")).toBeInTheDocument();
    expect(screen.getByText("There is an additonal error on this page")).toBeInTheDocument();
  });

  it("has an aria-label with the error message for screen readers", () => {
    render(<ErrorSummary errorsToShow={multipleErrorsToShow} errors={multipleErrors} />);
    expect(screen.getByText("There is a problem")).toBeInTheDocument();
    expect(screen.getByText("There is an error on this page")).toHaveAttribute(
      "aria-label",
      "Error: There is an error on this page",
    );
  });

  it("has screen focus when an error is found", () => {
    render(<ErrorSummary errorsToShow={multipleErrorsToShow} errors={multipleErrors} />);
    const errorSummaryDiv = screen.getByTestId("error-summary");
    expect(errorSummaryDiv).toHaveAttribute("tabIndex", "-1");
  });

  it("moves focus to the correct input field when clicking an error link", async () => {
    const errorsToShow = ["passportNumber"];
    const errors = {
      passportNumber: {
        message: "Enter the applicant's passport number",
        type: "required",
      },
    };

    render(
      <>
        <ErrorSummary errorsToShow={errorsToShow} errors={errors} />
        <div id="passport-number">
          <input id="passport-number" data-testid="passport-number-input" />
        </div>
      </>,
    );

    const errorLink = screen.getByText("Enter the applicant's passport number");
    const inputElement = screen.getByTestId("passport-number-input");

    await userEvent.click(errorLink);

    await waitFor(() => {
      expect(document.activeElement).toBe(inputElement);
      expect(inputElement).toHaveAttribute("tabIndex", "-1");
    });
  });
});
