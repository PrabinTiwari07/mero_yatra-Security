import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedFields, setFocusedFields] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

        const { fullName, phone, address, email, password, confirmPassword } = formData;

        if (!fullName || !phone || !address || !email || !password || !confirmPassword) {
            toast.error('All fields are required.', { position: 'top-right' });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.', { position: 'top-right' });
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Registration failed.', { position: 'top-right' });
                return;
            }

            // toast.success('Registered successfully! Please verify OTP.', {
            //   position: 'top-right',
            // });

            setTimeout(() => {
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        success: 'Registered successfully! Please verify OTP.',
                    },
                });
            }, 1500);
        } catch (err) {
            console.error(err);
            toast.error('Server error. Try again later.', { position: 'top-right' });
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            <div className="w-full max-w-5xl h-[85vh] flex rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="w-1/2 flex flex-col justify-center items-center px-8 py-8 overflow-y-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600 text-sm">Join YatriK and start your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                        {/* Full Name Field */}
                        <div className="relative">
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                onFocus={() => handleFocus('fullName')}
                                onBlur={() => handleBlur('fullName')}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                                placeholder=" "
                                id="fullName"
                            />
                            <label
                                htmlFor="fullName"
                                className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                style={{
                                    top: isLabelFloated('fullName') ? '-8px' : '12px',
                                    fontSize: isLabelFloated('fullName') ? '12px' : '16px',
                                    color: isLabelFloated('fullName') ? '#374151' : '#6B7280'
                                }}
                            >
                                Full Name
                            </label>
                        </div>

                        {/* Phone Field */}
                        <div className="relative">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onFocus={() => handleFocus('phone')}
                                onBlur={() => handleBlur('phone')}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                                placeholder=" "
                                id="phone"
                            />
                            <label
                                htmlFor="phone"
                                className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                style={{
                                    top: isLabelFloated('phone') ? '-8px' : '12px',
                                    fontSize: isLabelFloated('phone') ? '12px' : '16px',
                                    color: isLabelFloated('phone') ? '#374151' : '#6B7280'
                                }}
                            >
                                Phone Number
                            </label>
                        </div>

                        {/* Address Field */}
                        <div className="relative">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onFocus={() => handleFocus('address')}
                                onBlur={() => handleBlur('address')}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
                                placeholder=" "
                                id="address"
                            />
                            <label
                                htmlFor="address"
                                className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                style={{
                                    top: isLabelFloated('address') ? '-8px' : '12px',
                                    fontSize: isLabelFloated('address') ? '12px' : '16px',
                                    color: isLabelFloated('address') ? '#374151' : '#6B7280'
                                }}
                            >
                                Address
                            </label>
                        </div>

                        {/* Email Field */}
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

                        {/* Password Field */}
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
                            <label
                                htmlFor="password"
                                className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                style={{
                                    top: isLabelFloated('password') ? '-8px' : '12px',
                                    fontSize: isLabelFloated('password') ? '12px' : '16px',
                                    color: isLabelFloated('password') ? '#374151' : '#6B7280'
                                }}
                            >
                                Password
                            </label>
                            <div
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => handleFocus('confirmPassword')}
                                onBlur={() => handleBlur('confirmPassword')}
                                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer"
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
                                Confirm Password
                            </label>
                            <div
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-48 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-red-700 font-semibold hover:text-gray-700 hover:underline transition-colors">
                                Sign in here!
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="w-1/2 h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
                    <img
                        src="/assets/bik.jpg"
                        alt="Registration bike"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-6 left-6 z-20 text-white">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
