import { render } from "@testing-library/react";

import Heading from "./heading";

test("Heading component renders correctly", () => {
  const title = "Test Title";
  const size = "l";

  const { getByText } = render(<Heading level={1} size={size} title={title} />);

  const titleElement = getByText(title);
  expect(titleElement).toBeInTheDocument();
});
