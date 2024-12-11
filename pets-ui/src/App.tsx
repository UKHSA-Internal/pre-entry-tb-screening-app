import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';
import TravelDetailsPage from './pages/travel-details';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/travel-details" element={<TravelDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
