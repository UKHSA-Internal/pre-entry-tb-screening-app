import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ContactDetailsPage from './pages/contact-details';
import ApplicantForm from './sections/applicant-form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactDetailsPage />} />
        <Route path="/form" element={<ApplicantForm />} />
      </Routes>
    </Router>
  )
}

export default App
