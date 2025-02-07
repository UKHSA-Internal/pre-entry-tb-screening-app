import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ChestXrayForm from "@/sections/chest-xray-form";
import { renderWithProviders } from "@/utils/test-utils";

// const useNavigateMock: Mock = vi.fn();
// vi.mock(`react-router-dom`, async (): Promise<unknown> => {
//   const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
//   return {
//     ...actual,
//     useNavigate: (): Mock => useNavigateMock,
//   };
// });

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

const xray_scan = new File(["dummy scan"], "scan.png", { type: "image/png" });
const xray_al_scan = new File(["dummy scan"], "scan_al.pdf", { type: "image/png" });
const xray_ld_scan = new File(["dummy scan"], "scan_ld.jpg", { type: "image/png" });

export const handlers = []; // for further API calls

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("User can upload files, click radio then is proceeded to next page", async () => {
  renderWithProviders(
    <Router>
      <ChestXrayForm />
    </Router>,
  );

  const user = userEvent.setup();

  fireEvent.change(screen.getByTestId("posteroAnteriorFile"), {
    target: { files: [xray_scan] },
  });

  await user.click(screen.getAllByTestId("apicalLordoticXray")[0]);
  fireEvent.change(screen.getByTestId("apicalLordoticXrayFile"), {
    target: { files: [xray_al_scan] },
  });

  await user.click(screen.getAllByTestId("lateralDecubitus")[0]);
  fireEvent.change(screen.getByTestId("lateralDecubitusFile"), {
    target: { files: [xray_ld_scan] },
  });

  expect(screen.getByTestId("posteroAnteriorFile").files[0].name).toBe("scan.png");

  expect(screen.getAllByTestId("apicalLordoticXray")[0]).toBeChecked();
  expect(screen.getAllByTestId("apicalLordoticXray")[1]).not.toBeChecked();
  expect(screen.getByTestId("apicalLordoticXrayFile").files[0].name).toBe("scan_al.pdf");

  expect(screen.getAllByTestId("lateralDecubitus")[0]).toBeChecked();
  expect(screen.getAllByTestId("lateralDecubitus")[1]).not.toBeChecked();
  expect(screen.getByTestId("lateralDecubitusFile").files[0].name).toBe("scan_ld.jpg");

  await user.click(screen.getByText("Continue"));
  expect(useNavigateMock).toBeCalled();
});
