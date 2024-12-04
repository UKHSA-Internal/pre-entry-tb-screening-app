import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page';
import ContactDetailsPage from './pages/contact-details';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
