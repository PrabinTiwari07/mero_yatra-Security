import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import usePasswordStatus from '../hooks/usePasswordStatus';

// Example: Replace with your actual authentication logic
const isAuthenticated = () => {
    // Check for token saved by login
    return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }) => {
    const { passwordStatus, loading } = usePasswordStatus();
    const location = useLocation();
    const [shouldCheckPassword, setShouldCheckPassword] = useState(true);

    // Don't check password status for certain routes
    useEffect(() => {
        const exemptRoutes = ['/change-password', '/forgot-password', '/reset-password'];
        setShouldCheckPassword(!exemptRoutes.includes(location.pathname));
    }, [location.pathname]);

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Show loading while checking password status
    if (loading && shouldCheckPassword) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking security status...</p>
                </div>
            </div>
        );
    }

    // Redirect to reset password if expired (but not for change-password route)
    if (shouldCheckPassword && passwordStatus && (passwordStatus.isExpired || passwordStatus.mustChangePassword)) {
        const user = JSON.parse(localStorage.getItem('user'));
        return (
            <Navigate
                to="/forgot-password"
                state={{
                    expired: true,
                    email: user?.email,
                    message: passwordStatus.isExpired
                        ? 'Your password has expired. Please reset it to continue.'
                        : 'You must change your password before proceeding.'
                }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
