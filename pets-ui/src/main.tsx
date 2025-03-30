import { MsalProvider } from "@azure/msal-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.tsx";
import { initializeMsal } from "./auth/auth.ts";
import { setupStore } from "./redux/store.ts";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
initializeMsal().then((msalInstance) => {
  createRoot(document.getElementById("root")!).render(
    <Provider store={setupStore()}>
      <HelmetProvider>
        <StrictMode>
          <Router>
            <MsalProvider instance={msalInstance}>
              <App />
            </MsalProvider>
          </Router>
        </StrictMode>
      </HelmetProvider>
    </Provider>,
  );
});
