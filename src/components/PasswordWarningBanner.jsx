import { useState } from 'react';
import { FiAlertTriangle, FiLock, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PasswordWarningBanner = ({ passwordStatus, onDismiss }) => {
    const navigate = useNavigate();
    const [isDismissed, setIsDismissed] = useState(false);

    if (!passwordStatus || isDismissed) return null;

    const { daysUntilExpiry, showWarning, isExpired, mustChangePassword } = passwordStatus;

    // Don't show banner if no warning needed
    if (!showWarning && !isExpired && !mustChangePassword) return null;

    const handleDismiss = () => {
        setIsDismissed(true);
        if (onDismiss) onDismiss();
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    // Critical - Password expired or must change
    if (isExpired || mustChangePassword) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FiLock className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                            Password Action Required
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                            {isExpired
                                ? 'Your password has expired. You must change it to continue using your account.'
                                : 'You must change your password before proceeding.'
                            }
                        </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                        <button
                            onClick={handleChangePassword}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Change Password Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Warning - Password expiring soon
    if (showWarning && daysUntilExpiry > 0) {
        const urgencyLevel = daysUntilExpiry <= 3 ? 'high' : daysUntilExpiry <= 7 ? 'medium' : 'low';

        const colors = {
            high: {
                bg: 'bg-red-50',
                border: 'border-red-400',
                icon: 'text-red-400',
                title: 'text-red-800',
                text: 'text-red-700',
                button: 'bg-red-600 hover:bg-red-700'
            },
            medium: {
                bg: 'bg-orange-50',
                border: 'border-orange-400',
                icon: 'text-orange-400',
                title: 'text-orange-800',
                text: 'text-orange-700',
                button: 'bg-orange-600 hover:bg-orange-700'
            },
            low: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-400',
                icon: 'text-yellow-400',
                title: 'text-yellow-800',
                text: 'text-yellow-700',
                button: 'bg-yellow-600 hover:bg-yellow-700'
            }
        };

        const theme = colors[urgencyLevel];

        return (
            <div className={`${theme.bg} border-l-4 ${theme.border} p-4 mb-6 relative`}>
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FiAlertTriangle className={`h-5 w-5 ${theme.icon}`} />
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className={`text-sm font-medium ${theme.title}`}>
                            Password Expiry Warning
                        </h3>
                        <p className={`mt-1 text-sm ${theme.text}`}>
                            Your password will expire in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}.
                            Change it now to avoid being locked out of your account.
                        </p>
                    </div>
                    <div className="ml-3 flex-shrink-0 flex items-center space-x-2">
                        <button
                            onClick={handleChangePassword}
                            className={`${theme.button} text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleDismiss}
                            className={`${theme.text} hover:${theme.title} p-1 rounded-md transition-colors`}
                        >
                            <FiX className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default PasswordWarningBanner;
