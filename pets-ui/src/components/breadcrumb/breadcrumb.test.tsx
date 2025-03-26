import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Breadcrumb, { IBreadcrumbItem } from "./breadcrumb";

const breadcrumbItems: IBreadcrumbItem[] = [
  {
    text: "crumb-1",
    href: "/crumb-1",
  },
  {
    text: "crumb-2",
    href: "/crumb-2",
  },
];

describe("Breadcrumb component", () => {
  it("renders text correctly", () => {
    render(
      <Router>
        <Breadcrumb items={breadcrumbItems} />
      </Router>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("crumb-1")).toBeTruthy();
    expect(screen.getByText("crumb-2")).toBeTruthy();
  });
  it("renders links correctly", () => {
    render(
      <Router>
        <Breadcrumb items={breadcrumbItems} />
      </Router>,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    const crumbOne = screen.getAllByRole("link")[0];
    const crumbTwo = screen.getAllByRole("link")[1];
    expect(crumbOne.getAttribute("href")).toEqual("/crumb-1");
    expect(crumbTwo.getAttribute("href")).toEqual("/crumb-2");
  });
});
