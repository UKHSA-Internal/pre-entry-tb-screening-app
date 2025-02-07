import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ChestXrayForm from "@/sections/chest-xray-form";
import { renderWithProviders } from "@/utils/test-utils";

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

  it("uploads a postero-anterior X-ray file", () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm nextpage="/next" />
      </Router>,
    );
    const input = screen.getByTestId("posteroAnteriorFile");
    const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getAllByTestId("apicalLordoticXray")[1]);
    fireEvent.click(screen.getAllByTestId("lateralDecubitus")[1]);

    // expect file to be in the box
    expect(input.files.length).toBe(1);

    const submitButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(submitButton);

    // has the file (fize count = 1)
    expect(input.files.length).toBe(1);

    // No errors
    expect(screen.queryByText(/Please Upload/i)).not.toBeInTheDocument();
  });
});
