import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page';
import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';
import ApplicantSummaryPage from './pages/applicant-summary';
import MedicalScreeningPage from './pages/medical-screening';
import MedicalSummaryPage from './pages/medical-screening-summary';
import ApplicantConfirmation from './pages/applicant-confirmation';
import TravelDetailsPage from './pages/travel-details';
import TravelSummaryPage from './pages/travel-summary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/applicant-summary" element={<ApplicantSummaryPage />} />
        <Route path="/applicant-confirmation" element={<ApplicantConfirmation />} />
        <Route path="/medical-screening" element={<MedicalScreeningPage />} />
        <Route path="/medical-summary" element={<MedicalSummaryPage />} />
        <Route path="/travel-details" element={<TravelDetailsPage />} />
        <Route path="/travel-summary" element={<TravelSummaryPage />} />
      </Routes>
    </Router>
  )
}

export default App
