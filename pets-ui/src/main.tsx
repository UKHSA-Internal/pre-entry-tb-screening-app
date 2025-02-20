import { PublicClientApplication } from "@azure/msal-browser";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.tsx";
import { msalConfig } from "./auth/authConfig.ts";
import AuthProvider from "./auth/authProvider.tsx";
import { setupStore } from "./redux/store.ts";

const msalInstance = new PublicClientApplication(msalConfig);

await msalInstance.initialize();

createRoot(document.getElementById("root")!).render(
  <Provider store={setupStore()}>
    <HelmetProvider>
      <StrictMode>
        <Router>
          <AuthProvider instance={msalInstance}>
            <App />
          </AuthProvider>
        </Router>
      </StrictMode>
    </HelmetProvider>
  </Provider>,
);
