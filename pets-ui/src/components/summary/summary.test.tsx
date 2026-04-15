import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationStatus, TaskStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import Summary from "./summary";

const summaryData = [
  {
    key: "Example Title",
    value: "A typical value",
    link: "/example-link",
    hiddenLabel: "Hidden Label Example",
  },
];

const summaryArrayData = [
  {
    key: "Example Title",
    value: ["A typical value", "Another value", "A third value"],
    link: "/example-link",
    hiddenLabel: "Hidden Label Example",
  },
];

describe("Summary Component", () => {
  it("renders correctly when props are specified", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.NOT_YET_STARTED}
        applicationStatus={ApplicationStatus.IN_PROGRESS}
        summaryElements={summaryData}
      />,
    );
    expect(screen.getByText("Example Title")).toBeInTheDocument();
    expect(screen.getByText("A typical value")).toBeInTheDocument();
    expect(screen.getByText("Hidden Label Example")).toBeInTheDocument();
  });

  it("renders an array of strings", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.NOT_YET_STARTED}
        applicationStatus={ApplicationStatus.IN_PROGRESS}
        summaryElements={summaryArrayData}
      />,
    );
    expect(screen.getByText("A typical value")).toBeInTheDocument();
    expect(screen.getByText("Another value")).toBeInTheDocument();
    expect(screen.getByText("A third value")).toBeInTheDocument();
  });

  it("renders a link attached to the word 'Change'", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.NOT_YET_STARTED}
        applicationStatus={ApplicationStatus.IN_PROGRESS}
        summaryElements={summaryData}
      />,
    );
    expect(screen.getByText("Change")).toBeInTheDocument();
    expect(screen.getAllByRole("definition")).toHaveLength(2);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    const changeLink = screen.getAllByRole("link")[0];
    expect(changeLink.getAttribute("href")).toEqual("/example-link");
  });

  it("does not render a link attached to the word 'Change' when the status is complete", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.COMPLETE}
        applicationStatus={ApplicationStatus.IN_PROGRESS}
        summaryElements={summaryData}
      />,
    );
    expect(screen.getAllByRole("definition")).toHaveLength(1);
  });

  it("shows change link when showChangeLinksAfterTaskComplete is true and application is valid", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.COMPLETE}
        applicationStatus={ApplicationStatus.IN_PROGRESS}
        summaryElements={summaryData}
        showChangeLinksAfterTaskComplete={true}
      />,
    );

    expect(screen.getByText("Change")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("does not show change link when showChangeLinksAfterTaskComplete is true and application is CANCELLED", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.COMPLETE}
        applicationStatus={ApplicationStatus.CANCELLED}
        summaryElements={summaryData}
        showChangeLinksAfterTaskComplete={true}
      />,
    );

    expect(screen.queryByText("Change")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("does not show change link when showChangeLinksAfterTaskComplete is true and application is CERTIFICATE_NOT_ISSUED", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.COMPLETE}
        applicationStatus={ApplicationStatus.CERTIFICATE_NOT_ISSUED}
        summaryElements={summaryData}
        showChangeLinksAfterTaskComplete={true}
      />,
    );

    expect(screen.queryByText("Change")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("does not show change link when showChangeLinksAfterTaskComplete is false and application is not IN_PROGRESS or NULL", () => {
    renderWithProviders(
      <Summary
        taskStatus={TaskStatus.NOT_YET_STARTED}
        applicationStatus={ApplicationStatus.CANCELLED}
        summaryElements={summaryData}
        showChangeLinksAfterTaskComplete={false}
      />,
    );

    expect(screen.queryByText("Change")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
