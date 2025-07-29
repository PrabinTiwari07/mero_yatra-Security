import { useState } from 'react';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Check if coming from expired password
    const isExpired = location.state?.expired;
    const prefilledEmail = location.state?.email || '';
    const expiredMessage = location.state?.message;

    const [email, setEmail] = useState(prefilledEmail);
    const [error, setError] = useState('');
    const [focusedFields, setFocusedFields] = useState({});

    const handleFocus = (fieldName) => {
        setFocusedFields({ ...focusedFields, [fieldName]: true });
    };

    const handleBlur = (fieldName) => {
        setFocusedFields({ ...focusedFields, [fieldName]: false });
    };

    const isLabelFloated = (fieldName) => {
        return email || focusedFields[fieldName];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const res = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error sending OTP');

            navigate('/verify-reset-otp', { state: { email } });
        } catch (err) {
            setError(err.message || 'Server error');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                {/* Back Button Inside Container */}
                <Link
                    to="/login"
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft size={18} />
                    <span className="text-sm font-medium">Back</span>
                </Link>

                <div className="text-center mb-6 mt-8">
                    <img src="/assets/logo.png" alt="YatriK Logo" className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                        {isExpired ? 'Reset Expired Password' : 'Forgot Password'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {isExpired
                            ? 'Your password has expired. Please reset it to continue.'
                            : 'Please enter your email to reset your password'
                        }
                    </p>
                </div>

                {/* Password Expired Warning */}
                {isExpired && expiredMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <FiAlertTriangle className="h-5 w-5 mr-3 text-red-500" />
                            <div>
                                <p className="font-medium text-sm">Password Expired</p>
                                <p className="text-sm mt-1">{expiredMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field with Floating Label */}
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                            placeholder=" "
                            id="email"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                            style={{
                                top: isLabelFloated('email') ? '-8px' : '12px',
                                fontSize: isLabelFloated('email') ? '12px' : '16px',
                                color: isLabelFloated('email') ? '#374151' : '#6B7280'
                            }}
                        >
                            Email Address
                        </label>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-48 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Submit
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-48 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium text-center">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
