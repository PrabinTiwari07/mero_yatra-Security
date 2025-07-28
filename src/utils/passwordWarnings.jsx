import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const showPasswordWarningToast = (passwordWarning, navigateToChangePassword) => {
    if (!passwordWarning) return;

    const { daysUntilExpiry, message } = passwordWarning;

    const ToastContent = () => (
        <div className="flex items-center space-x-3 p-2">
            <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                    Password Expiry Warning
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    {message}
                </p>
            </div>
            <button
                onClick={() => {
                    toast.dismiss();
                    navigateToChangePassword();
                }}
                className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-600 transition-colors flex-shrink-0"
            >
                Change Now
            </button>
        </div>
    );

    const urgency = daysUntilExpiry <= 3 ? 'high' : daysUntilExpiry <= 7 ? 'medium' : 'low';

    const toastConfig = {
        high: {
            autoClose: 10000,
            hideProgressBar: false,
            style: {
                background: '#FEF2F2',
                border: '1px solid #F87171',
                borderLeft: '4px solid #EF4444'
            }
        },
        medium: {
            autoClose: 8000,
            hideProgressBar: false,
            style: {
                background: '#FFF7ED',
                border: '1px solid #FB923C',
                borderLeft: '4px solid #F97316'
            }
        },
        low: {
            autoClose: 6000,
            hideProgressBar: false,
            style: {
                background: '#FEFCE8',
                border: '1px solid #FACC15',
                borderLeft: '4px solid #EAB308'
            }
        }
    };

    toast(<ToastContent />, {
        position: 'top-right',
        type: 'warning',
        ...toastConfig[urgency]
    });
};

export const showPasswordExpiredToast = (message, navigateToReset) => {
    const ToastContent = () => (
        <div className="flex items-center space-x-3 p-2">
            <div className="flex-shrink-0">
                <FiLock className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                    Password Expired
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    {message}
                </p>
            </div>
            <button
                onClick={() => {
                    toast.dismiss();
                    navigateToReset();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors flex-shrink-0"
            >
                Reset Now
            </button>
        </div>
    );

    toast(<ToastContent />, {
        position: 'top-center',
        type: 'error',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        style: {
            background: '#FEF2F2',
            border: '2px solid #EF4444',
            borderLeft: '6px solid #DC2626'
        }
    });
};
