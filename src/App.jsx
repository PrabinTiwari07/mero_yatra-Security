import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/authentication/login';
import LandingPage from './pages/landing'; // Fixed import path to match actual file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
