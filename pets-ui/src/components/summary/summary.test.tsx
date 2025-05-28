import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ApplicationStatus } from "@/utils/enums";
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
      <Router>
        <Summary status={ApplicationStatus.NOT_YET_STARTED} summaryElements={summaryData} />
      </Router>,
    );
    expect(screen.getByText("Example Title")).toBeInTheDocument();
    expect(screen.getByText("A typical value")).toBeInTheDocument();
    expect(screen.getByText("Hidden Label Example")).toBeInTheDocument();
  });
  it("renders an array of strings", () => {
    render(
      <Router>
        <Summary status={ApplicationStatus.NOT_YET_STARTED} summaryElements={summaryArrayData} />
      </Router>,
    );
    expect(screen.getByText("A typical value")).toBeInTheDocument();
    expect(screen.getByText("Another value")).toBeInTheDocument();
    expect(screen.getByText("A third value")).toBeInTheDocument();
  });
  it("renders a link attached to the word 'Change'", () => {
    render(
      <Router>
        <Summary status={ApplicationStatus.NOT_YET_STARTED} summaryElements={summaryData} />
      </Router>,
    );
    expect(screen.getByText("Change")).toBeInTheDocument();
    expect(screen.getAllByRole("definition")).toHaveLength(2);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    const changeLink = screen.getAllByRole("link")[0];
    expect(changeLink.getAttribute("href")).toEqual("/example-link");
  });
  it("does not render a link attached to the word 'Change' when the status is complete", () => {
    render(
      <Router>
        <Summary status={ApplicationStatus.COMPLETE} summaryElements={summaryData} />
      </Router>,
    );
    expect(screen.getAllByRole("definition")).toHaveLength(1);
  });
});
