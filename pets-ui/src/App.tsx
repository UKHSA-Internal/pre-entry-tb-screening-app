import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page';
import ApplicantSearchPage from './pages/applicant-search';
import ApplicantResultsPage from './pages/applicant-results';
import ContactDetailsPage from './pages/contact-details';
import ApplicantSummaryPage from './pages/applicant-summary';
import ApplicantConfirmation from './pages/applicant-confirmation';
import MedicalScreeningPage from './pages/medical-screening';
import MedicalSummaryPage from './pages/medical-screening-summary';
import MedicalConfirmation from './pages/medical-screening-confirmation';
import TravelDetailsPage from './pages/travel-details';
import TravelSummaryPage from './pages/travel-summary';
import TravelConfirmation from './pages/travel-confirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/applicant-results" element={<ApplicantResultsPage />} />
        <Route path="/contact" element={<ContactDetailsPage />} />
        <Route path="/applicant-summary" element={<ApplicantSummaryPage />} />
        <Route path="/applicant-confirmation" element={<ApplicantConfirmation />} />
        <Route path="/medical-screening" element={<MedicalScreeningPage />} />
        <Route path="/medical-summary" element={<MedicalSummaryPage />} />
        <Route path="/medical-confirmation" element={<MedicalConfirmation />} />
        <Route path="/travel-details" element={<TravelDetailsPage />} />
        <Route path="/travel-summary" element={<TravelSummaryPage />} />
        <Route path="/travel-confirmation" element={<TravelConfirmation />} />
      </Routes>
    </Router>
  )
}

export default App
