import { useState } from 'react';
import { FiClock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MFAVerification from '../../components/MFAVerification';
import { useSecurity } from '../../contexts/SecurityContext';
import { showPasswordExpiredToast, showPasswordWarningToast } from '../../utils/passwordWarnings.jsx';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedFields, setFocusedFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showMFA, setShowMFA] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const {
        recordFailedLogin,
        clearFailedAttempts,
        getRemainingAttempts,
        isAccountLocked,
        logSecurityEvent,
        updateActivity,
        isLoaded
    } = useSecurity();

    const handleFocus = (field) => setFocusedFields((prev) => ({ ...prev, [field]: true }));
    const handleBlur = (field) => setFocusedFields((prev) => ({ ...prev, [field]: false }));
    const isLabelFloated = (field) => focusedFields[field] || formData[field] !== '';
    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle successful MFA verification
    const handleMFASuccess = (userData) => {
        clearFailedAttempts(formData.email);
        updateActivity();

        logSecurityEvent('LOGIN_SUCCESS', {
            email: formData.email,
            role: userData.user?.role,
            mfaVerified: true
        });

        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('userRole', userData.user?.role || 'user');

        toast.success('Login successful!', { position: 'top-right' });
        setTimeout(() => {
            navigate(userData.user?.role === 'admin' ? '/admin/dashboard' : '/home');
        }, 1000);
    };

    // Handle back to login from MFA
    const handleBackToLogin = () => {
        setShowMFA(false);
        setUserEmail('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('All fields are required.', { position: 'top-right' });
            return;
        }

        if (!isLoaded) {
            toast.error('Loading security data, please wait...', { position: 'top-right' });
            return;
        }

        const lockStatus = isAccountLocked(formData.email);
        if (lockStatus.locked) {
            toast.error(`Account is locked. Try again in ${lockStatus.remainingTime} minutes.`, {
                position: 'top-right'
            });
            logSecurityEvent('LOGIN_ATTEMPT_LOCKED_ACCOUNT', { email: formData.email });
            return;
        }

        setIsLoading(true);

        try {
            logSecurityEvent('LOGIN_ATTEMPT', { email: formData.email });

            const res = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.passwordExpired || data.mustChangePassword) {
                    logSecurityEvent('LOGIN_BLOCKED_PASSWORD_EXPIRED', {
                        email: formData.email,
                        reason: data.message
                    });
                    showPasswordExpiredToast(
                        data.message,
                        () => navigate('/forgot-password', {
                            state: { message: data.message, email: formData.email, expired: true }
                        })
                    );
                    return;
                }

                const currentRemaining = getRemainingAttempts(formData.email);
                const accountLocked = recordFailedLogin(formData.email);

                logSecurityEvent('LOGIN_FAILED', {
                    email: formData.email,
                    reason: data.message || 'Invalid credentials',
                    accountLocked
                });

                if (accountLocked) {
                    toast.error('Too many failed attempts. Account has been locked for 5 minutes.', {
                        position: 'top-right'
                    });
                } else {
                    const remaining = currentRemaining - 1;
                    toast.error(
                        `${data.message || 'Login failed'}. ${remaining} attempts remaining.`,
                        { position: 'top-right' }
                    );
                }
                return;
            }

            // Check if MFA is required
            if (data.requireMFA) {
                setUserEmail(data.email);
                setShowMFA(true);
                toast.info('Please enter your MFA code to complete login.', { position: 'top-right' });
                return;
            }

            clearFailedAttempts(formData.email);
            updateActivity();

            logSecurityEvent('LOGIN_SUCCESS', {
                email: formData.email,
                role: data.user?.role
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userRole', data.user?.role || 'user');

            if (data.passwordWarning) {
                setTimeout(() => {
                    showPasswordWarningToast(
                        data.passwordWarning,
                        () => navigate('/change-password')
                    );
                }, 2000);
            }

            toast.success('Login successful!', { position: 'top-right' });
            setTimeout(() => {
                navigate(data.user?.role === 'admin' ? '/admin/dashboard' : '/home');
            }, 1000);

        } catch (err) {
            console.error(err);
            logSecurityEvent('LOGIN_ERROR', { email: formData.email, error: err.message });
            toast.error('Server error. Try again later.', { position: 'top-right' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            {/* Show MFA verification if required */}
            {showMFA ? (
                <MFAVerification
                    email={userEmail}
                    onMFASuccess={handleMFASuccess}
                    onBack={handleBackToLogin}
                />
            ) : (
                /* Regular login form */
                <div className="w-full max-w-5xl h-[85vh] flex rounded-2xl overflow-hidden shadow-2xl bg-white">
                    {/* Image Section - Now on the left */}
                    <div className="w-1/2 h-full">
                        <img src="/assets/siii.jpg" alt="Login car" className="w-full h-full object-cover" />
                    </div>

                    {/* Login Form Section - Now on the right */}
                    <div className="w-1/2 flex flex-col justify-center items-center px-8 py-8">
                        <div className="flex flex-col items-center mb-6">
                            <img src="/assets/logoo.png" alt="MeroYatra Logo" className="h-16 mb-3" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                            <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('email')}
                                    onBlur={() => handleBlur('email')}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="email"
                                />
                                <label htmlFor="email" className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('email') ? '-8px' : '12px',
                                        fontSize: isLabelFloated('email') ? '12px' : '16px',
                                        color: isLabelFloated('email') ? '#374151' : '#6B7280'
                                    }}>
                                    Email Address
                                </label>
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={() => handleBlur('password')}
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="password"
                                />
                                <label htmlFor="password" className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('password') ? '-8px' : '12px',
                                        fontSize: isLabelFloated('password') ? '12px' : '16px',
                                        color: isLabelFloated('password') ? '#374151' : '#6B7280'
                                    }}>
                                    Password
                                </label>
                                <div
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                    onClick={handleTogglePassword}
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-black hover:text-gray-700 hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Status bar */}
                            {formData.email && isLoaded && (() => {
                                const lockStatus = isAccountLocked(formData.email);
                                const remainingAttempts = getRemainingAttempts(formData.email);

                                if (lockStatus.locked) {
                                    return (
                                        <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <FiShield className="text-red-500 mr-2" />
                                            <span className="text-sm text-red-700">
                                                Account locked for {lockStatus.remainingTime} minutes
                                            </span>
                                        </div>
                                    );
                                }

                                if (remainingAttempts < 5 && remainingAttempts > 0) {
                                    return (
                                        <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <FiClock className="text-yellow-500 mr-2" />
                                            <span className="text-sm text-yellow-700">
                                                {remainingAttempts} login attempts remaining
                                            </span>
                                        </div>
                                    );
                                }

                                return null;
                            })()}

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={isLoading || !isLoaded || (formData.email && isAccountLocked(formData.email).locked)}
                                    className={`w-48 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading || !isLoaded || (formData.email && isAccountLocked(formData.email).locked)
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-900 transform hover:scale-[1.02]'
                                        }`}
                                >
                                    {isLoading ? 'Signing In...' : !isLoaded ? 'Loading...' : 'Sign In'}
                                </button>
                            </div>

                            <p className="text-sm mt-6 font-medium text-center">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-red-700 font-semibold hover:text-gray-700 hover:underline transition-colors">
                                    Register here!
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
