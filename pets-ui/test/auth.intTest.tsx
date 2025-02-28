import { MsalProvider } from "@azure/msal-react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MsalReactTester, MsalReactTesterPlugin } from "msal-react-tester";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import App from "../src/App";

MsalReactTesterPlugin.init({
  spyOn: vi.spyOn,
  expect: expect,
  resetAllMocks: vi.resetAllMocks,
  waitingFor: waitFor,
});

vi.mock("@azure/msal-browser", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("@azure/msal-browser")>()),
    PublicClientApplication: vi.fn(),
  };
});

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

let msalTester: MsalReactTester;

beforeEach(() => {
  msalTester = new MsalReactTester();

  msalTester.spyMsal();
});

afterEach(() => {
  msalTester.resetSpyMsal();
});

test("In authenticated state, user is taken to Applicant Search page ('/applicant-search') when accessing landing page ('/') via browser", async () => {
  await msalTester.isLogged();

  renderWithProviders(
    <MemoryRouter initialEntries={["/"]}>
      <MsalProvider instance={msalTester.client}>
        <App />
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByText("Search for a visa applicant")).toBeVisible();
});

test("In authenticated state, user is able to access authenticated paths", async () => {
  await msalTester.isLogged();

  renderWithProviders(
    <MemoryRouter initialEntries={["/applicant-results"]}>
      <MsalProvider instance={msalTester.client}>
        <App />
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByText("No matching record found")).toBeVisible();
});

test("In unauthenticated state, user is taken to landing page ('/') when accessing landing page via browser", async () => {
  await msalTester.isNotLogged();

  renderWithProviders(
    <MemoryRouter initialEntries={["/"]}>
      <MsalProvider instance={msalTester.client}>
        <App />
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
});

test("In unauthenticated state, user is taken to landing page ('/') if they try to access an authenticated path", async () => {
  await msalTester.isNotLogged();

  renderWithProviders(
    <MemoryRouter initialEntries={["/applicant-results"]}>
      <MsalProvider instance={msalTester.client}>
        <App />
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
});

test("In unauthenticated state, user is taken to redirect to B2C page if they click sign-in on landing page", async () => {
  await msalTester.isNotLogged();

  renderWithProviders(
    <MemoryRouter initialEntries={["/"]}>
      <MsalProvider instance={msalTester.client}>
        <App />
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  const signin = screen.getByRole("button", { name: /Sign In/i });
  await userEvent.click(signin);

  await waitFor(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(msalTester.client.handleRedirectPromise).toBeCalled();
  });
});
