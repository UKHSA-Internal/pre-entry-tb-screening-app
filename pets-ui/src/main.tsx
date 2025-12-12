import { MsalProvider } from "@azure/msal-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router";

import App from "./App.tsx";
import { initializeMsal } from "./auth/auth.ts";
import { ErrorFallback } from "./components/errorFallback/errorFallback.tsx";
import ScrollToTop from "./components/scrollToTop/scrollToTop.tsx";
import { ApplicantPhotoProvider } from "./context/applicantPhotoContext.tsx";
import { setupStore } from "./redux/store.ts";
import { logError } from "./utils/helpers.ts";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
initializeMsal().then((msalInstance) => {
  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <Provider store={setupStore()}>
        <HelmetProvider>
          <StrictMode>
            <Router>
              <ScrollToTop />
              <MsalProvider instance={msalInstance}>
                <ApplicantPhotoProvider>
                  <App />
                </ApplicantPhotoProvider>
              </MsalProvider>
            </Router>
          </StrictMode>
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>,
  );
});
