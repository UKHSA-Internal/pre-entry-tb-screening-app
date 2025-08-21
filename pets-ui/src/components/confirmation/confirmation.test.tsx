import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, Mock } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import LinkLabel from "../linkLabel/LinkLabel";
import Confirmation from "./confirmation";

const furtherInfo = [
  "Further Information Test Text",
  "Additional Information",
  <>
    Continue to <LinkLabel to="/tracker" title="tracker page" externalLink={false} />.
  </>,
];

const useNavigateMock = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Confirmation component", () => {
  beforeEach(() => {
    renderWithProviders(
      <Confirmation
        confirmationText={"Confirmation GreenBox Text"}
        furtherInfo={furtherInfo}
        buttonText={"Continue to next step"}
        buttonLink={"/next-step"}
      />,
    );
  });
  it("Renders the confirmation text elements correctly", () => {
    expect(screen.getByText("Confirmation GreenBox Text")).toBeTruthy();
    expect(screen.getByText("Further Information Test Text")).toBeTruthy();
    expect(screen.getByText("Additional Information")).toBeTruthy();
    expect(screen.queryByText("What happens next")).not.toBeInTheDocument();
  });
  it("Renders the JSX Elements with a working Link", () => {
    const paragraphs = screen.getAllByRole("paragraph");
    expect(paragraphs[2]).toBeTruthy();
    expect(paragraphs[2]).toHaveTextContent("Continue to tracker page");
    expect(screen.getByText("tracker page")).toHaveAttribute("href", "/tracker");
  });
  it("Renders a button element with a custom message and link", () => {
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Continue to next step");
    fireEvent.click(button);
    expect(useNavigateMock).toHaveBeenCalledWith("/next-step");
  });
  it("Renders the title 'What happens next' when whatHappensNext is true", () => {
    renderWithProviders(
      <Confirmation
        confirmationText={"Confirmation GreenBox Text"}
        furtherInfo={furtherInfo}
        buttonText={"Continue to next step"}
        buttonLink={"/next-step"}
        whatHappensNext={true}
      />,
    );

    expect(screen.getByText("What happens next")).toBeInTheDocument();
  });
});
