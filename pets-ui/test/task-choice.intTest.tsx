import { screen } from "@testing-library/react";

import { renderWithProviders } from "@/utils/test-utils";

import TaskChoicePage from "../src/pages/task-choice";

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

test("Task choice page renders text & links correctly", () => {
  renderWithProviders(<TaskChoicePage />);

  expect(screen.getByText("What do you need to do?")).toBeInTheDocument();

  const newScreeningLink = screen.getByRole("link", {
    name: "Search for or start a new screening",
  });
  const screeningsInProgress = screen.getByRole("link", {
    name: "View all screenings in progress",
  });
  expect(newScreeningLink).toBeInTheDocument();
  expect(newScreeningLink).toHaveAttribute("href", "/search-for-visa-applicant");
  expect(screeningsInProgress).toBeInTheDocument();
  expect(screeningsInProgress).toHaveAttribute("href", "/screenings-in-progress");
});
