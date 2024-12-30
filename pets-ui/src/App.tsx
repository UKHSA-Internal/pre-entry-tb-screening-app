import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page';
import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';
import MedicalScreeningPage from './pages/medical-screening';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/medical-screening" element={<MedicalScreeningPage />} />
      </Routes>
    </Router>
  )
}

export default App
