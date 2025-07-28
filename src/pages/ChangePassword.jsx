import { useState } from 'react';
import { FiArrowLeft, FiCheck, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import SecurePasswordInput from '../../components/SecurePasswordInput';
// import { validatePassword } from '../../utils/passwordSecurity';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedFields, setFocusedFields] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFocus = (fieldName) => {
        setFocusedFields({ ...focusedFields, [fieldName]: true });
    };

    const handleBlur = (fieldName) => {
        setFocusedFields({ ...focusedFields, [fieldName]: false });
    };

    const isLabelFloated = (fieldName) => {
        return formData[fieldName] || focusedFields[fieldName];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrors({ general: 'All fields are required.' });
            setLoading(false);
            return;
        }

        // Validate new password against policy
        const validatePassword = (password) => {
            const errors = [];
            if (password.length < 8) errors.push('Password must be at least 8 characters long');
            if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
            if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
            if (!/\d/.test(password)) errors.push('Password must contain at least one number');
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
            return errors;
        };

        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            setErrors({ newPassword: passwordErrors[0] });
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match.' });
            setLoading(false);
            return;
        }

        if (currentPassword === newPassword) {
            setErrors({ newPassword: 'New password cannot be the same as current password.' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:3000/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Password changed successfully!', {
                    position: 'top-right'
                });

                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                // Handle specific password reuse error
                if (data.message.includes('cannot reuse') || data.message.includes('reuse')) {
                    setErrors({ newPassword: data.message });
                } else if (data.message.includes('current password') || data.message.includes('incorrect')) {
                    setErrors({ currentPassword: data.message });
                } else {
                    setErrors({ general: data.message });
                }
            }
        } catch (error) {
            console.error('Change password error:', error);
            setErrors({ general: 'Failed to change password. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center mb-6">
                    <Link
                        to="/home"
                        className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
                        <p className="text-gray-600 text-sm">Update your password for better security</p>
                    </div>
                </div>

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <FiX className="h-4 w-4 mr-2" />
                            <span className="text-sm">{errors.general}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            onFocus={() => handleFocus('currentPassword')}
                            onBlur={() => handleBlur('currentPassword')}
                            className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer ${errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            placeholder=" "
                            id="currentPassword"
                        />
                        <label
                            htmlFor="currentPassword"
                            className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                            style={{
                                top: isLabelFloated('currentPassword') ? '-8px' : '12px',
                                fontSize: isLabelFloated('currentPassword') ? '12px' : '16px',
                                color: isLabelFloated('currentPassword') ? '#374151' : '#6B7280'
                            }}
                        >
                            Current Password
                        </label>
                        <div
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </div>
                        {errors.currentPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FiX className="h-3 w-3 mr-1" />
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            onFocus={() => handleFocus('newPassword')}
                            onBlur={() => handleBlur('newPassword')}
                            className={`w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.newPassword ? 'border-red-500 bg-red-50' : ''}`}
                            placeholder=" "
                            id="newPassword"
                        />
                        <label
                            htmlFor="newPassword"
                            className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                            style={{
                                top: isLabelFloated('newPassword') ? '-8px' : '12px',
                                fontSize: isLabelFloated('newPassword') ? '12px' : '16px',
                                color: isLabelFloated('newPassword') ? '#374151' : '#6B7280'
                            }}
                        >
                            New Password
                        </label>
                        <div
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-2 flex items-center">
                                <FiX className="h-3 w-3 mr-1" />
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => handleFocus('confirmPassword')}
                            onBlur={() => handleBlur('confirmPassword')}
                            className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
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
                        <div
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FiX className="h-3 w-3 mr-1" />
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {formData.confirmPassword && (
                        <div className="mt-2">
                            <div className={`flex items-center text-sm ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {formData.newPassword === formData.confirmPassword ? (
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
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${loading
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-900 transform hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        <Link to="/home" className="text-gray-700 font-semibold hover:text-gray-900 hover:underline transition-colors">
                            ← Back to Dashboard
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
