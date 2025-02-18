import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.tsx";
import AuthProvider from "./auth/authProvider.tsx";
import { setupStore } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={setupStore()}>
    <HelmetProvider>
      <StrictMode>
        <Router>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </StrictMode>
    </HelmetProvider>
  </Provider>,
);
