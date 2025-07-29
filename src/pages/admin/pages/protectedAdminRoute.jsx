import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

const getUserRole = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decoded = jwtDecode(token);
        console.log('Decoded JWT token:', decoded);
        return decoded.role || decoded.userRole || (decoded.user && decoded.user.role);
    } catch (err) {
        console.error('Error decoding JWT token:', err);
        return null;
    }
};

const ProtectedAdminRoute = () => {
    const role = getUserRole();
    console.log('Current user role:', role);

    // Check localStorage directly as a fallback
    const userRole = localStorage.getItem('userRole');
    console.log('User role from localStorage:', userRole);

    if (role !== 'admin' && userRole !== 'admin') {
        console.log('Not admin, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    console.log('Admin access granted');
    return <Outlet />;
};

export default ProtectedAdminRoute;
