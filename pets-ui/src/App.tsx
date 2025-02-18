import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ApiDocs from "./pages/api-docs";
import ApplicantConfirmation from "./pages/applicant-confirmation";
import ApplicantResultsPage from "./pages/applicant-results";
import ApplicantSearchPage from "./pages/applicant-search";
import ApplicantSummaryPage from "./pages/applicant-summary";
import ContactDetailsPage from "./pages/contact-details";
import HomePage from "./pages/home-page";
import MedicalScreeningPage from "./pages/medical-screening";
import MedicalConfirmation from "./pages/medical-screening-confirmation";
import MedicalSummaryPage from "./pages/medical-screening-summary";
import ProgressTrackerPage from "./pages/progress-tracker";
import TravelConfirmation from "./pages/travel-confirmation";
import TravelDetailsPage from "./pages/travel-details";
import TravelSummaryPage from "./pages/travel-summary";

const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  return <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
};

const UnauthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/applicant-search" />;
  }
  return <UnauthenticatedTemplate>{children}</UnauthenticatedTemplate>;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <UnauthenticatedRoute>
            <HomePage />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/applicant-search"
        element={
          <AuthenticatedRoute>
            <ApplicantSearchPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/tracker"
        element={
          <AuthenticatedRoute>
            <ProgressTrackerPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-results"
        element={
          <AuthenticatedRoute>
            <ApplicantResultsPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <AuthenticatedRoute>
            <ContactDetailsPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-summary"
        element={
          <AuthenticatedRoute>
            <ApplicantSummaryPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/applicant-confirmation"
        element={
          <AuthenticatedRoute>
            <ApplicantConfirmation />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-screening"
        element={
          <AuthenticatedRoute>
            <MedicalScreeningPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-summary"
        element={
          <AuthenticatedRoute>
            <MedicalSummaryPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/medical-confirmation"
        element={
          <AuthenticatedRoute>
            <MedicalConfirmation />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-details"
        element={
          <AuthenticatedRoute>
            <TravelDetailsPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-summary"
        element={
          <AuthenticatedRoute>
            <TravelSummaryPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/travel-confirmation"
        element={
          <AuthenticatedRoute>
            <TravelConfirmation />
          </AuthenticatedRoute>
        }
      />
      <Route path="/api-docs/" element={<ApiDocs />} />
    </Routes>
  );
}

export default App;
