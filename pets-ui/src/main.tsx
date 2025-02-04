import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

import App from "./App.tsx";
import { setupStore } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={setupStore()}>
    <HelmetProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>
  </Provider>,
);
