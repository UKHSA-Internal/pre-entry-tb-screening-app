import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page';
import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';
import MedicalScreeningPage from './pages/medical-screening';
import ApplicantConfirmation from './pages/applicant-confirmation';
import TravelDetailsPage from './pages/travel-details';
import TravelSummaryPage from './pages/travel-summary';
import TravelConfirmation from './pages/travel-confirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/applicant-confirmation" element={<ApplicantConfirmation />} />
        <Route path="/medical-screening" element={<MedicalScreeningPage />} />
        <Route path="/travel-details" element={<TravelDetailsPage />} />
        <Route path="/travel-summary" element={<TravelSummaryPage />} />
        <Route path="/travel-confirmation" element={<TravelConfirmation />} />
      </Routes>
    </Router>
  )
}

export default App
