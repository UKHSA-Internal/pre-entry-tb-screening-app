import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ContactDetailsPage from './pages/contact-details';
import ApplicantSearchPage from './pages/applicant-search';
import ApplicantConfirmation from './pages/applicant-confirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactDetailsPage />} />
        <Route path="/applicant-search" element={<ApplicantSearchPage />} />
        <Route path="/applicant-confirmation" element={<ApplicantConfirmation />} />
      </Routes>
    </Router>
  )
}

export default App
