import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
      </Routes>
    </Router>
  )
}

export default App
