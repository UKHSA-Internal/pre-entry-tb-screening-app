import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
import { RedirectedRouteIfReduxEmpty } from "./utils/redirect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route
          path="/tracker"
          element={
            <RedirectedRouteIfReduxEmpty>
              <ProgressTrackerPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/applicant-results"
          element={
            <RedirectedRouteIfReduxEmpty>
              <ApplicantResultsPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/contact"
          element={
            <RedirectedRouteIfReduxEmpty>
              <ContactDetailsPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/applicant-summary"
          element={
            <RedirectedRouteIfReduxEmpty>
              <ApplicantSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/applicant-confirmation"
          element={
            <RedirectedRouteIfReduxEmpty>
              <ApplicantConfirmation />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/medical-screening"
          element={
            <RedirectedRouteIfReduxEmpty>
              <MedicalScreeningPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/medical-summary"
          element={
            <RedirectedRouteIfReduxEmpty>
              <MedicalSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/medical-confirmation"
          element={
            <RedirectedRouteIfReduxEmpty>
              <MedicalConfirmation />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/travel-details"
          element={
            <RedirectedRouteIfReduxEmpty>
              <TravelDetailsPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/travel-summary"
          element={
            <RedirectedRouteIfReduxEmpty>
              <TravelSummaryPage />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route
          path="/travel-confirmation"
          element={
            <RedirectedRouteIfReduxEmpty>
              <TravelConfirmation />
            </RedirectedRouteIfReduxEmpty>
          }
        />
        <Route path="/api-docs/" element={<ApiDocs />} />
      </Routes>
    </Router>
  );
}

export default App;
