import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Pagination from "./pagination";

describe("Pagination", () => {
  const setup = (overrides = {}) => {
    const props = {
      currentPage: 5,
      maximumPage: 10,
      onClickPrevious: vi.fn(),
      onClickNext: vi.fn(),
      onClickNumberedPage: vi.fn(),
      ...overrides,
    };

    render(<Pagination {...props} />);
    return {
      user: userEvent.setup(),
      props,
    };
  };

  it("renders current page", () => {
    setup();

    expect(screen.getByText("5")).toHaveAttribute("aria-current", "page");
  });

  it("renders previous and next buttons when applicable", () => {
    setup();

    expect(screen.getByText(/Previous/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  it("does not render previous button on first page", () => {
    setup({ currentPage: 1 });

    expect(screen.queryByText(/Previous/i)).not.toBeInTheDocument();
  });

  it("does not render next button on last page", () => {
    setup({ currentPage: 10 });

    expect(screen.queryByText(/Next/i)).not.toBeInTheDocument();
  });

  it("calls onClickPrevious when previous is clicked", async () => {
    const { user, props } = setup();

    await user.click(screen.getByText(/Previous/i));
    expect(props.onClickPrevious).toHaveBeenCalledTimes(1);
  });

  it("calls onClickNext when next is clicked", async () => {
    const { user, props } = setup();

    await user.click(screen.getByText(/Next/i));
    expect(props.onClickNext).toHaveBeenCalledTimes(1);
  });

  it("calls onClickNumberedPage with correct page number", async () => {
    const { user, props } = setup();

    await user.click(screen.getByText("4"));
    expect(props.onClickNumberedPage).toHaveBeenCalledWith(4);

    await user.click(screen.getByText("6"));
    expect(props.onClickNumberedPage).toHaveBeenCalledWith(6);
  });

  it("does not call onClickNumberedPage when clicking current page", async () => {
    const { user, props } = setup();

    await user.click(screen.getByText("5"));
    expect(props.onClickNumberedPage).not.toHaveBeenCalled();
  });

  it("renders ellipsis when pages are truncated", () => {
    setup({ currentPage: 5, maximumPage: 20 });

    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  it("renders correct pages near the start", () => {
    setup({ currentPage: 2, maximumPage: 5 });

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders correct pages near the end", () => {
    setup({ currentPage: 9, maximumPage: 10 });

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
