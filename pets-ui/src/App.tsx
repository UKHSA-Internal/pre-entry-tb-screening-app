import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ContactDetailsPage from './pages/contact-details';
import TestPage from './pages/test-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactDetailsPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  )
}

export default App
