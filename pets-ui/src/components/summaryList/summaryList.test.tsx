import { screen } from "@testing-library/react";

import { renderWithProviders } from "@/utils/test-utils";

import SummaryList from "./summaryList";

const summaryData = [
  { key: "key-one", value: "value-one" },
  { key: "key-two", value: "value-two" },
  { key: "key-three", value: "value-three" },
];

describe("SummaryList", () => {
  it("correctly displays values", () => {
    renderWithProviders(<SummaryList keyValuePairList={summaryData} />);

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("key-one");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("key-two");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent("key-three");

    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("value-one");
    expect(screen.getAllByRole("definition")[1]).toHaveTextContent("value-two");
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("value-three");
  });
});
