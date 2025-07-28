import { FiAlertTriangle, FiCalendar, FiClock, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import usePasswordStatus from '../hooks/usePasswordStatus';

const PasswordStatusCard = () => {
    const { passwordStatus, loading, error } = usePasswordStatus();
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (daysUntilExpiry) => {
        if (daysUntilExpiry <= 0) return 'text-red-600';
        if (daysUntilExpiry <= 7) return 'text-orange-600';
        if (daysUntilExpiry <= 14) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getStatusBadge = (daysUntilExpiry, isExpired) => {
        if (isExpired) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <FiAlertTriangle className="mr-1 h-3 w-3" />
                    Expired
                </span>
            );
        }

        if (daysUntilExpiry <= 7) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <FiClock className="mr-1 h-3 w-3" />
                    Expires Soon
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiShield className="mr-1 h-3 w-3" />
                Active
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiShield className="mr-2" />
                    Password Security
                </h3>
                <div className="text-red-600 text-sm">
                    Failed to load password status: {error}
                </div>
            </div>
        );
    }

    if (!passwordStatus) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiShield className="mr-2" />
                    Password Security
                </h3>
                {getStatusBadge(passwordStatus.daysUntilExpiry, passwordStatus.isExpired)}
            </div>

            <div className="space-y-4">
                {/* Last Password Change */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Last Changed:</span>
                    </div>
                    <span className="text-sm text-gray-900">
                        {formatDate(passwordStatus.lastPasswordChange)}
                    </span>
                </div>

                {/* Password Expiry */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiClock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Expires On:</span>
                    </div>
                    <span className="text-sm text-gray-900">
                        {formatDate(passwordStatus.passwordExpiresAt)}
                    </span>
                </div>

                {/* Days Remaining */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiAlertTriangle className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(passwordStatus.daysUntilExpiry)}`}>
                        {passwordStatus.isExpired
                            ? 'Expired'
                            : `${passwordStatus.daysUntilExpiry} days remaining`
                        }
                    </span>
                </div>

                {/* Security Recommendations */}
                {(passwordStatus.showWarning || passwordStatus.isExpired) && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start">
                            <FiAlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-800">Security Recommendation</p>
                                <p className="text-yellow-700 mt-1">
                                    {passwordStatus.isExpired
                                        ? 'Your password has expired. Change it immediately to secure your account.'
                                        : `Your password expires in ${passwordStatus.daysUntilExpiry} days. Consider changing it soon.`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/change-password')}
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${passwordStatus.isExpired || passwordStatus.showWarning
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {passwordStatus.isExpired ? 'Change Password Now' : 'Change Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordStatusCard;
