import { render, screen } from "@testing-library/react";
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
      "There is an error on this page",
    );
  });
});
