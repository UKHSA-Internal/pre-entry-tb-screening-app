import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';
import TravelDetailsPage from './pages/travel-details';
import TravelSummaryPage from './pages/travel-summary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/travel-details" element={<TravelDetailsPage />} />
        <Route path="/travel-summary" element={<TravelSummaryPage />} />
      </Routes>
    </Router>
  )
}

export default App
