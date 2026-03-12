import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdditionalStatusTagTexts, ApplicationStatus, TaskStatus } from "@/utils/enums";

import StatusTag from "./statusTag";

describe("StatusTag", () => {
  describe.each([
    [TaskStatus.NOT_YET_STARTED, TaskStatus.NOT_YET_STARTED, "govuk-tag govuk-tag--blue"],
    [TaskStatus.NOT_REQUIRED, TaskStatus.NOT_REQUIRED, "govuk-tag govuk-tag--grey"],
    [
      AdditionalStatusTagTexts.CANNOT_START_YET,
      AdditionalStatusTagTexts.CANNOT_START_YET,
      "govuk-tag govuk-tag--grey",
    ],
    [TaskStatus.IN_PROGRESS, TaskStatus.IN_PROGRESS, "govuk-tag govuk-tag--yellow"],
    [
      TaskStatus.CERTIFICATE_NOT_ISSUED,
      TaskStatus.CERTIFICATE_NOT_ISSUED,
      "govuk-tag govuk-tag--red progress-tracker-task-nowrap",
    ],
    [TaskStatus.CERTIFICATE_ISSUED, TaskStatus.CERTIFICATE_ISSUED, "govuk-tag govuk-tag--green"],

    // Application status conversions
    [ApplicationStatus.IN_PROGRESS, TaskStatus.IN_PROGRESS, "govuk-tag govuk-tag--yellow"],
    [
      ApplicationStatus.CERTIFICATE_NOT_ISSUED,
      TaskStatus.CERTIFICATE_NOT_ISSUED,
      "govuk-tag govuk-tag--red progress-tracker-task-nowrap",
    ],
    [
      ApplicationStatus.CERTIFICATE_AVAILABLE,
      TaskStatus.CERTIFICATE_ISSUED,
      "govuk-tag govuk-tag--green",
    ],
    [
      ApplicationStatus.CANCELLED,
      AdditionalStatusTagTexts.SCREENING_CANCELLED,
      "govuk-tag govuk-tag--orange progress-tracker-task-nowrap",
    ],
  ])("status mapping", (status, expectedText, expectedClass) => {
    it(`renders "${expectedText}" with correct class`, () => {
      render(<StatusTag status={status} />);

      const tag = screen.getByText(expectedText);

      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(expectedClass);
    });
  });

  describe("overrides", () => {
    it("uses textOverride instead of mapped text", () => {
      render(<StatusTag status={TaskStatus.NOT_YET_STARTED} textOverride="Custom override" />);

      expect(screen.getByText("Custom override")).toBeInTheDocument();
    });

    it("uses classOverride instead of mapped class", () => {
      render(<StatusTag status={TaskStatus.NOT_YET_STARTED} classOverride="custom-class" />);

      const tag = screen.getByText(TaskStatus.NOT_YET_STARTED);

      expect(tag).toHaveClass("custom-class");
      expect(tag).not.toHaveClass("govuk-tag--blue");
    });
  });

  describe("taskListWrapper", () => {
    it("wraps the tag in govuk-task-list__status when enabled", () => {
      const { container } = render(<StatusTag status={TaskStatus.IN_PROGRESS} taskListWrapper />);

      const wrapper = container.querySelector(".govuk-task-list__status");
      const tag = screen.getByText(TaskStatus.IN_PROGRESS);

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toContainElement(tag);
    });

    it("does not render wrapper when disabled", () => {
      const { container } = render(<StatusTag status={TaskStatus.IN_PROGRESS} />);

      const wrapper = container.querySelector(".govuk-task-list__status");

      expect(wrapper).toBeNull();
    });
  });
});
