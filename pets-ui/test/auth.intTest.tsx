import { MsalProvider } from "@azure/msal-react";
import { render, waitFor } from "@testing-library/react";
import { MsalReactTester, MsalReactTesterPlugin } from "msal-react-tester";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";

import App from "../src/App";

MsalReactTesterPlugin.init({
  spyOn: vi.spyOn,
  expect: expect,
  resetAllMocks: vi.resetAllMocks,
  waitingFor: waitFor,
});

let msalTester: MsalReactTester;

beforeEach(() => {
  msalTester = new MsalReactTester();

  msalTester.spyMsal();
});

afterEach(() => {
  msalTester.resetSpyMsal();
});

test("Redirects to Applicant Search page ('/applicant-search') page after successful authentication", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </MsalProvider>,
  );

  await msalTester.waitForRedirect();
  await waitFor(() => expect(window.location.pathname).toBe("/applicant-search"));
});

test("In authenticated state, user is able to access authenticated paths", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter initialEntries={["/applicant-results"]}>
        <App />
      </MemoryRouter>
    </MsalProvider>,
  );

  await msalTester.waitForRedirect();

  await waitFor(() => expect(window.location.pathname).toBe("/applicant-results"));
});

test("In authenticated state, user is taken to Applicant Search page ('/applicant-search') when accessing landing page ('/') via browser", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </MsalProvider>,
  );

  await msalTester.waitForRedirect();

  await waitFor(() => expect(window.location.pathname).toBe("/applicant-search"));
});

test("In unauthenticated state, user is taken to landing page ('/') when accessing landing page via browser", async () => {
  await msalTester.isNotLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </MsalProvider>,
  );

  await msalTester.waitForRedirect();

  await waitFor(() => expect(window.location.pathname).toBe("/"));
});

test("In unauthenticated state, user is taken to landing page ('/') if they try to access an authenticated path", async () => {
  await msalTester.isNotLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter initialEntries={["/applicant-results"]}>
        <App />
      </MemoryRouter>
    </MsalProvider>,
  );

  await msalTester.waitForRedirect();

  await waitFor(() => expect(window.location.pathname).toBe("/"));
});
