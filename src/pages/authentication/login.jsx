import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedFields, setFocusedFields] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (location.state?.success) {
            toast.success(location.state.success, { position: 'top-right' });
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('All fields are required.', { position: 'top-right' });
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Login failed', { position: 'top-right' });
                return;
            }

            // Save token and role
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userRole', data.user?.role || 'user');

            toast.success('Login successful!', { position: 'top-right' });

            setTimeout(() => {
                if (data.user?.role === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/home';
                }
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error('Server error. Try again later.', { position: 'top-right' });
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            <div className="w-full max-w-5xl h-[85vh] flex rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="w-1/2 flex flex-col justify-center items-center px-8 py-8">
                    <div className="flex flex-col items-center mb-6">
                        <img src="/assets/logo.png" alt="YatriK Logo" className="h-16 mb-3" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
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
                                onClick={handleTogglePassword}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </div>
                        </div>

                        <div className="w-full flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-black hover:text-gray-700 hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-48 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>

                    <p className="text-sm mt-6 font-medium">
                        Don’t have an account?{' '}
                        <Link to="/register" className="text-red-700 font-semibold hover:text-gray-700 hover:underline transition-colors">
                            Register here!
                        </Link>
                    </p>
                </div>

                <div className="w-1/2 h-full">
                    <img
                        src="/assets/car.jpg"
                        alt="Login car"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
