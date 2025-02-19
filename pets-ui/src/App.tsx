import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ApiDocs from "./pages/api-docs";
import ApplicantConfirmation from "./pages/applicant-confirmation";
import ApplicantResultsPage from "./pages/applicant-results";
import ApplicantSearchPage from "./pages/applicant-search";
import ApplicantSummaryPage from "./pages/applicant-summary";
import ChestXrayQuestionPage from "./pages/chest-xray-question";
import ContactDetailsPage from "./pages/contact-details";
import HomePage from "./pages/home-page";
import MedicalScreeningPage from "./pages/medical-screening";
import MedicalConfirmation from "./pages/medical-screening-confirmation";
import MedicalSummaryPage from "./pages/medical-screening-summary";
import ProgressTrackerPage from "./pages/progress-tracker";
import TravelConfirmation from "./pages/travel-confirmation";
import TravelDetailsPage from "./pages/travel-details";
import TravelSummaryPage from "./pages/travel-summary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/tracker" element={<ProgressTrackerPage />} />
        <Route path="/applicant-results" element={<ApplicantResultsPage />} />
        <Route path="/contact" element={<ContactDetailsPage />} />
        <Route path="/chest-xray-question" element={<ChestXrayQuestionPage />} />
        <Route path="/applicant-summary" element={<ApplicantSummaryPage />} />
        <Route path="/applicant-confirmation" element={<ApplicantConfirmation />} />
        <Route path="/medical-screening" element={<MedicalScreeningPage />} />
        <Route path="/medical-summary" element={<MedicalSummaryPage />} />
        <Route path="/medical-confirmation" element={<MedicalConfirmation />} />
        <Route path="/travel-details" element={<TravelDetailsPage />} />
        <Route path="/travel-summary" element={<TravelSummaryPage />} />
        <Route path="/travel-confirmation" element={<TravelConfirmation />} />
        <Route path="/api-docs/" element={<ApiDocs />} />
      </Routes>
    </Router>
  );
}

export default App;
