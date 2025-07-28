import { useState } from 'react';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SecurePasswordInput from '../../components/SecurePasswordInput';
import { useSecurity } from '../../contexts/SecurityContext';
import { validatePassword } from '../../utils/passwordSecurity';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logSecurityEvent, addPasswordToHistory, isPasswordInHistory } = useSecurity();

    const email = location.state?.email;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focusedFields, setFocusedFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleFocus = (fieldName) => {
        setFocusedFields({ ...focusedFields, [fieldName]: true });
    };

    const handleBlur = (fieldName) => {
        setFocusedFields({ ...focusedFields, [fieldName]: false });
    };

    const isLabelFloated = (fieldName) => {
        const value = fieldName === 'newPassword' ? newPassword : confirmPassword;
        return value || focusedFields[fieldName];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error('All fields are required.', { position: 'top-right' });
            return;
        }

        // Validate password against policy
        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            toast.error(passwordErrors[0], { position: 'top-right' });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.', { position: 'top-right' });
            return;
        }

        if (!email) {
            toast.error('Something went wrong. Email not found in state.', { position: 'top-right' });
            return;
        }

        setIsLoading(true);
        logSecurityEvent('PASSWORD_RESET_ATTEMPT', { email });

        try {
            const res = await fetch('http://localhost:3000/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword, confirmPassword }),
            });

            const contentType = res.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = { message: await res.text() };
            }

            if (!res.ok) {
                logSecurityEvent('PASSWORD_RESET_FAILED', {
                    email,
                    reason: data.message
                });
                throw new Error(data.message);
            }

            // Log successful password reset and add to history
            logSecurityEvent('PASSWORD_RESET_SUCCESS', { email });
            addPasswordToHistory(email, newPassword); // In real app, this would be a hash

            // toast.success('Password reset successful!', { position: 'top-right' });
            setTimeout(() => {
                navigate('/login', {
                    state: { success: 'Password reset successful! Please log in.' },
                });
            }, 1500);

        } catch (err) {
            logSecurityEvent('PASSWORD_RESET_ERROR', {
                email,
                error: err.message
            });
            toast.error(err.message || 'Something went wrong.', { position: 'top-right' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                {/* Back Button Inside Container */}
                <Link
                    to="/verify-reset-otp"
                    state={{ email }}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft size={18} />
                    <span className="text-sm font-medium">Back</span>
                </Link>

                <div className="text-center mb-6 mt-8">
                    <img src="/assets/logo.png" alt="YatriK Logo" className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Reset Your Password</h2>
                    <p className="text-gray-600 text-sm">
                        Please enter and confirm your new password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <SecurePasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => handleFocus('newPassword')}
                        onBlur={() => handleBlur('newPassword')}
                        placeholder="New Password"
                        id="newPassword"
                        name="newPassword"
                        isLabelFloated={isLabelFloated('newPassword')}
                        showRequirements={true}
                        showStrengthIndicator={true}
                    />

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => handleFocus('confirmPassword')}
                            onBlur={() => handleBlur('confirmPassword')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                            placeholder=" "
                            id="confirmPassword"
                        />
                        <label
                            htmlFor="confirmPassword"
                            className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                            style={{
                                top: isLabelFloated('confirmPassword') ? '-8px' : '12px',
                                fontSize: isLabelFloated('confirmPassword') ? '12px' : '16px',
                                color: isLabelFloated('confirmPassword') ? '#374151' : '#6B7280'
                            }}
                        >
                            Confirm New Password
                        </label>
                    </div>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                        <div className="mt-2">
                            <div className={`flex items-center text-sm ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {newPassword === confirmPassword ? (
                                    <><FiCheck className="mr-2" /> Passwords match</>
                                ) : (
                                    <><FiX className="mr-2" /> Passwords do not match</>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-48 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-900 transform hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => navigate('/verify-reset-otp', { state: { email } })}
                            className="w-48 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
