import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { SecurityProvider } from './contexts/SecurityContext';
// import VerifyResetOtp from './pages/ForgotPassword/verifyResetOtp';
import Login from './pages/authentication/login';
import Register from './pages/authentication/register';
import VerifyOtp from './pages/authentication/verifyOtp';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword/forgotPassword';
import ResetPassword from './pages/ForgotPassword/resetPassword';
import VerifyResetOtp from './pages/ForgotPassword/verifyResetOtp';
import Home from './pages/homepage/home';
import LandingPage from './pages/landing';
import EditProfile from './pages/profile/editprofile';
import Profile from './pages/profile/profile';
import Pay from './pages/service/pay';
import PaySuccess from './pages/service/paySuccess';
import Services from './pages/service/Services';

function App() {
  return (
    <SecurityProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />

          <Route path="/services" element={<Services />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/pay-success" element={<PaySuccess />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </Router>
    </SecurityProvider>
  );
}

export default App;
