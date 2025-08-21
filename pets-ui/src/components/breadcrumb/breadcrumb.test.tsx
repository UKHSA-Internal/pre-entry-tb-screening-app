import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

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
    renderWithProviders(<Breadcrumb items={breadcrumbItems} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("crumb-1")).toBeTruthy();
    expect(screen.getByText("crumb-2")).toBeTruthy();
  });
  it("renders links correctly", () => {
    renderWithProviders(<Breadcrumb items={breadcrumbItems} />);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    const crumbOne = screen.getAllByRole("link")[0];
    const crumbTwo = screen.getAllByRole("link")[1];
    expect(crumbOne.getAttribute("href")).toEqual("/crumb-1");
    expect(crumbTwo.getAttribute("href")).toEqual("/crumb-2");
  });
});
