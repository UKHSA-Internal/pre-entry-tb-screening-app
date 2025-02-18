import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ChestXrayUploadPage from "@/pages/chest-xray-upload";
import ChestXrayForm from "@/sections/chest-xray-form";
import { renderWithProviders } from "@/utils/test-utils";

describe("ChestXrayUploadPage", () => {
  it("Shows the breadcrums", () => {
    renderWithProviders(
      <Router>
        <HelmetProvider>
          <ChestXrayUploadPage />
        </HelmetProvider>
      </Router>,
    );
    const breadcrumbItems = [
      { text: "Home", href: "/" },
      { text: "Application Search", href: "/applicant-search" },
      { text: "Medical Screening", href: "#" },
    ];

    breadcrumbItems.forEach((item) => {
      const breadcrumbElement = screen.getByText(item.text);
      expect(breadcrumbElement).toBeInTheDocument();
      expect(breadcrumbElement.closest("a")).toHaveAttribute("href", item.href);
    });
  });
});
describe("ChestXrayForm Component", () => {
  it("renders the component and loads from redux", () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm nextpage="/next" />
      </Router>,
    );
    expect(screen.getByText("Upload the postero-anterior X-ray")).toBeInTheDocument();
    expect(screen.getByText("Was an apical lordotic X-ray required ?")).toBeInTheDocument();
    expect(screen.getByText("Was a lateral decubitus X-ray required ?")).toBeInTheDocument();
  });

  it("uploads a postero-anterior X-ray file", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm nextpage="/next" />
      </Router>,
    );
    const input: HTMLInputElement = screen.getByTestId("posteroAnteriorFile");
    const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getAllByTestId("apicalLordoticXray")[1]);
    fireEvent.click(screen.getAllByTestId("lateralDecubitus")[1]);

    // expect file to be in the box
    expect(input.files?.length).toBe(1);

    const submitButton = screen.getByRole("button", { name: /continue/i });
    const user = userEvent.setup();
    await user.click(submitButton);

    // has the file (fize count = 1)
    expect(input.files?.length).toBe(1);
  });

  it("Missing upload for AL and LD", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm nextpage="/next" />
      </Router>,
    );
    const input = screen.getByTestId("posteroAnteriorFile");
    const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getAllByTestId("apicalLordoticXray")[0]);
    fireEvent.click(screen.getAllByTestId("lateralDecubitus")[0]);

    const submit = screen.getByRole("button", { name: /continue/i });
    const user = userEvent.setup();
    await user.click(submit);

    // errors
    expect(screen.getAllByText(/Please Upload/i)).not.toBeNull();
  });
});
