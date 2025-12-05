import { render, RenderOptions } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { AppStore, RootState, setupStore } from "@/redux/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    initialEntries = ["/"],
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const router = createMemoryRouter(
    [
      {
        path: initialEntries[initialEntries.length - 1],
        element: <ReduxProvider store={store}>{ui}</ReduxProvider>,
      },
    ],
    { initialEntries },
  );

  return {
    store,
    ...render(<RouterProvider router={router} />, renderOptions),
  };
}

export function renderWithProvidersWithoutRouter(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<object>): React.JSX.Element {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
