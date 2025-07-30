import { useState } from 'react';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const LogoutButton = ({
    className = "",
    variant = "button", // "button" or "dropdown-item"
    showText = true,
    onLogoutSuccess = null
}) => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const result = await authService.logout();
            if (result.success) {
                toast.success('Logged out successfully', {
                    position: 'top-right',
                    autoClose: 2000
                });

                // Clear any additional app state if needed
                if (onLogoutSuccess) {
                    onLogoutSuccess();
                }

                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                toast.error(result.message || 'Logout failed');
                navigate('/login'); // Navigate anyway to be safe
            }
        } catch (error) {
            console.error('❌ Logout error:', error);
            toast.error('Logout failed');
            navigate('/login'); // Navigate anyway to be safe
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (variant === "dropdown-item") {
        return (
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50 ${className}`}
            >
                {isLoggingOut ? (
                    <FaSpinner className="animate-spin mr-2" />
                ) : (
                    <FaSignOutAlt className="mr-2" />
                )}
                {showText && (isLoggingOut ? 'Logging out...' : 'Logout')}
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 ${className}`}
        >
            {isLoggingOut ? (
                <FaSpinner className="animate-spin mr-2" />
            ) : (
                <FaSignOutAlt className="mr-2" />
            )}
            {showText && (isLoggingOut ? 'Logging out...' : 'Logout')}
        </button>
    );
};

export default LogoutButton;
