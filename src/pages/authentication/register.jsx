import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FiCheck, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    assessPasswordStrength,
    calculatePasswordEntropy,
    getPasswordSuggestions,
    getTimeToCrack,
    PASSWORD_POLICY,
    validatePassword
} from '../../utils/passwordSecurity';

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
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: '',
        checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
            noRepeating: false
        }
    });
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.password) {
            setPasswordStrength(assessPasswordStrength(formData.password));
        } else {
            setPasswordStrength({
                score: 0,
                feedback: '',
                checks: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false,
                    noRepeating: false
                }
            });
        }
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const restrictFields = ['fullName', 'address', 'phone', 'email', 'password', 'confirmPassword'];
        let cleanedValue = value;
        let warningShown = false;

        if (restrictFields.includes(name)) {
            // Block <script> and </script>
            const scriptTagPattern = /<\/?script.*?>/gi;
            if (scriptTagPattern.test(cleanedValue)) {
                cleanedValue = cleanedValue.replace(scriptTagPattern, '');
                warningShown = true;
            }

            // Block < and > individually
            const angleBracketPattern = /[<>]/g;
            if (angleBracketPattern.test(cleanedValue)) {
                cleanedValue = cleanedValue.replace(angleBracketPattern, '');
                warningShown = true;
            }

            // Remove trailing /
            if (cleanedValue.endsWith('/')) {
                cleanedValue = cleanedValue.slice(0, -1);
            }

            // Show a single toast message if anything was removed
            if (warningShown) {
                toast.warn('Invalid characters (e.g., <, >, script tags) have been removed.', {
                    position: 'top-right',
                    autoClose: 3000,
                    pauseOnHover: false,
                    draggable: false,
                    closeOnClick: true,
                    theme: 'light'
                });
            }
        }

        const sanitizedValue = DOMPurify.sanitize(cleanedValue);

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: sanitizedValue
        }));
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

        // Sanitize user input
        const fullName = DOMPurify.sanitize(formData.fullName);
        const phone = DOMPurify.sanitize(formData.phone);
        const address = DOMPurify.sanitize(formData.address);
        const email = DOMPurify.sanitize(formData.email);
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!fullName || !phone || !address || !email || !password || !confirmPassword) {
            toast.error('All fields are required.', { position: 'top-right' });
            return;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            toast.error(passwordErrors[0], { position: 'top-right' });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.', { position: 'top-right' });
            return;
        }

        if (passwordStrength.score < 4) {
            toast.error('Password is too weak. Please choose a stronger password.', { position: 'top-right' });
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, phone, address, email, password, confirmPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Registration failed.', { position: 'top-right' });
                return;
            }

            setTimeout(() => {
                navigate('/verify-otp', {
                    state: {
                        email,
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
                                onFocus={() => {
                                    handleFocus('password');
                                    setShowPasswordRequirements(true);
                                }}
                                onBlur={() => {
                                    handleBlur('password');
                                    setShowPasswordRequirements(false);
                                }}
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

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Password Strength:</span>
                                    <span className={`text-sm font-medium ${passwordStrength.strengthLevel === 'very-weak' ? 'text-red-600' :
                                        passwordStrength.strengthLevel === 'weak' ? 'text-red-500' :
                                            passwordStrength.strengthLevel === 'moderate' ? 'text-yellow-500' :
                                                passwordStrength.strengthLevel === 'strong' ? 'text-green-500' :
                                                    'text-green-600'
                                        }`}>
                                        {passwordStrength.feedback}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strengthLevel === 'very-weak' ? 'bg-red-600 w-1/6' :
                                            passwordStrength.strengthLevel === 'weak' ? 'bg-red-500 w-2/6' :
                                                passwordStrength.strengthLevel === 'moderate' ? 'bg-yellow-500 w-3/6' :
                                                    passwordStrength.strengthLevel === 'strong' ? 'bg-green-500 w-5/6' :
                                                        'bg-green-600 w-full'
                                            }`}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Entropy: {Math.round(calculatePasswordEntropy(formData.password))} bits</span>
                                    <span>Time to crack: {getTimeToCrack(formData.password)}</span>
                                </div>
                            </div>
                        )}

                        {/* Password Requirements */}
                        {(showPasswordRequirements || formData.password) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                                <div className="space-y-1">
                                    <div className={`flex items-center text-xs ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.length ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                                        {PASSWORD_POLICY.minLength}-{PASSWORD_POLICY.maxLength} characters long
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.uppercase ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                                        At least one uppercase letter
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.lowercase ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                                        At least one lowercase letter
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.number ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                                        At least one number
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.special ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                                        At least one special character (!@#$%^&*...)
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordStrength.checks.noRepeating ? 'text-green-600' : 'text-gray-500'}`}>
                                        {passwordStrength.checks.noRepeating ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                                        No more than {PASSWORD_POLICY.maxRepeatingChars} consecutive identical characters
                                    </div>
                                </div>

                                {/* Password Suggestions */}
                                {formData.password && passwordStrength.score < 6 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <h5 className="text-xs font-medium text-gray-600 mb-1">Suggestions to improve:</h5>
                                        <div className="space-y-1">
                                            {getPasswordSuggestions(passwordStrength).map((suggestion, index) => (
                                                <div key={index} className="text-xs text-blue-600">
                                                    • {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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

                        {/* Password Match Indicator */}
                        {formData.confirmPassword && (
                            <div className="mt-2">
                                <div className={`flex items-center text-sm ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    {formData.password === formData.confirmPassword ? (
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
