import { MsalProvider } from "@azure/msal-react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MsalReactTester, MsalReactTesterPlugin } from "msal-react-tester";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";

import { ApplicantPhotoProvider } from "@/context/applicantPhotoContext";
import { renderWithProvidersWithoutRouter } from "@/utils/test-utils";

import App from "../src/App";

MsalReactTesterPlugin.init({
  spyOn: vi.spyOn,
  expect: expect,
  resetAllMocks: vi.resetAllMocks,
  waitingFor: waitFor,
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

test("In authenticated state, user is taken to Applicant Search page ('/search-for-visa-applicant') when accessing landing page ('/') via browser", async () => {
  await msalTester.isLogged();

  renderWithProvidersWithoutRouter(
    <MemoryRouter initialEntries={["/"]}>
      <MsalProvider instance={msalTester.client}>
        <ApplicantPhotoProvider>
          <App />
        </ApplicantPhotoProvider>
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByText("Search for a visa applicant")).toBeVisible();
});

test("In authenticated state, user is able to access authenticated paths", async () => {
  await msalTester.isLogged();

  renderWithProvidersWithoutRouter(
    <MemoryRouter initialEntries={["/search-for-visa-applicant"]}>
      <MsalProvider instance={msalTester.client}>
        <ApplicantPhotoProvider>
          <App />
        </ApplicantPhotoProvider>
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByText("Search for a visa applicant")).toBeVisible();
});

test("In unauthenticated state, user is taken to landing page ('/') when accessing landing page via browser", async () => {
  await msalTester.isNotLogged();

  renderWithProvidersWithoutRouter(
    <MemoryRouter initialEntries={["/"]}>
      <MsalProvider instance={msalTester.client}>
        <ApplicantPhotoProvider>
          <App />
        </ApplicantPhotoProvider>
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
});

test("In unauthenticated state, user is taken to landing page ('/') if they try to access an authenticated path", async () => {
  await msalTester.isNotLogged();

  renderWithProvidersWithoutRouter(
    <MemoryRouter initialEntries={["/no-matching-record-found"]}>
      <MsalProvider instance={msalTester.client}>
        <ApplicantPhotoProvider>
          <App />
        </ApplicantPhotoProvider>
      </MsalProvider>
    </MemoryRouter>,
  );

  await msalTester.waitForRedirect();

  expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
});

test("In unauthenticated state, user is taken to redirect to B2C page if they click sign-in on landing page", async () => {
  await msalTester.isNotLogged();

  renderWithProvidersWithoutRouter(
    <MemoryRouter initialEntries={["/"]}>
      <MsalProvider instance={msalTester.client}>
        <ApplicantPhotoProvider>
          <App />
        </ApplicantPhotoProvider>
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
