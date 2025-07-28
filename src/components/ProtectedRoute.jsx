import { Navigate } from 'react-router-dom';

// Example: Replace with your actual authentication logic
const isAuthenticated = () => {
    // Check for token saved by login
    return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;
