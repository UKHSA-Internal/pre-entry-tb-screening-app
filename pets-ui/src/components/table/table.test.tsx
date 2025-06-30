import { screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Table, { TableRow } from "./table";

const tableData: TableRow[] = [
  {
    rowTitle: "Title 1",
    cells: ["Cell 1.1", "Cell 1.2", "Cell 1.3"],
  },
  {
    rowTitle: "Title 2",
    cells: ["Cell 2.1", "Cell 2.2", "Cell 2.3"],
  },
  {
    rowTitle: "Title 3",
    cells: ["Cell 3.1", "Cell 3.2", "Cell 3.3"],
  },
];

describe("Summary Component", () => {
  it("renders correctly when all props are specified", () => {
    renderWithProviders(
      <Router>
        <Table
          title="Example Title"
          columnHeaders={["Column one", "Column two", "Column three"]}
          tableRows={tableData}
        />
      </Router>,
    );

    const expectedTextList = [
      "Example Title",
      "Column one",
      "Column two",
      "Column three",
      "Title 1",
      "Title 2",
      "Title 3",
      "Cell 1.1",
      "Cell 1.2",
      "Cell 1.3",
      "Cell 2.1",
      "Cell 2.2",
      "Cell 2.3",
      "Cell 3.1",
      "Cell 3.2",
      "Cell 3.3",
    ];
    for (const text of expectedTextList) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("renders correctly when optional props are omitted", () => {
    renderWithProviders(
      <Router>
        <Table tableRows={tableData} />
      </Router>,
    );

    const expectedTextList = [
      "Title 1",
      "Title 2",
      "Title 3",
      "Cell 1.1",
      "Cell 1.2",
      "Cell 1.3",
      "Cell 2.1",
      "Cell 2.2",
      "Cell 2.3",
      "Cell 3.1",
      "Cell 3.2",
      "Cell 3.3",
    ];
    for (const text of expectedTextList) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }

    const unexpectedTextList = ["Example Title", "Column one", "Column two", "Column three"];
    for (const text of unexpectedTextList) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
  });
});
