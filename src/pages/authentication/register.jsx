import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FiCheck, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    assessPasswordStrength,
    getPasswordSuggestions,
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
    const [captchaValue, setCaptchaValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);

        // Sanitize user input
        const fullName = DOMPurify.sanitize(formData.fullName);
        const phone = DOMPurify.sanitize(formData.phone);
        const address = DOMPurify.sanitize(formData.address);
        const email = DOMPurify.sanitize(formData.email);
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!fullName || !phone || !address || !email || !password || !confirmPassword) {
            toast.error('All fields are required.', { position: 'top-right' });
            setIsLoading(false);
            return;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            toast.error(passwordErrors[0], { position: 'top-right' });
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.', { position: 'top-right' });
            setIsLoading(false);
            return;
        }

        if (passwordStrength.score < 4) {
            toast.error('Password is too weak. Please choose a stronger password.', { position: 'top-right' });
            setIsLoading(false);
            return;
        }

        if (!captchaValue) {
            toast.error('Please verify that you are not a robot.', { position: 'top-right' });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, phone, address, email, password, confirmPassword, captchaToken: captchaValue }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Registration failed.', { position: 'top-right' });
                setIsLoading(false);
                return;
            }

            toast.success('Registration successful! Please check your email for verification.', { position: 'top-right' });

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
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            <div className="w-full max-w-6xl h-[90vh] flex rounded-2xl overflow-hidden shadow-2xl bg-white">
                {/* Image Section - Left Side */}
                <div className="w-1/2 h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent z-10"></div>
                    <img
                        src="/assets/bmw.jpg"
                        alt="Registration - Join your journey"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-8 left-8 z-20 text-white max-w-sm">
                        <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
                        <p className="text-lg opacity-90">Join thousands of travelers who trust YatriK for their adventures.</p>
                    </div>
                </div>

                {/* Registration Form Section - Right Side */}
                <div className="w-1/2 flex flex-col h-full bg-gray-50">
                    {/* Header - Fixed */}
                    <div className="flex-shrink-0 text-center pt-8 pb-6 px-8 bg-white">
                        <div className="flex flex-col items-center mb-4">
                            <img src="/assets/logo.png" alt="YatriK Logo" className="h-12 mb-3" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        </div>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8 bg-white" style={{ scrollbarWidth: 'thin' }}>
                        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-5">
                            {/* Full Name Field */}
                            <div className="relative mt-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('fullName')}
                                    onBlur={() => handleBlur('fullName')}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="fullName"
                                />
                                <label
                                    htmlFor="fullName"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('fullName') ? '-10px' : '12px',
                                        fontSize: isLabelFloated('fullName') ? '12px' : '16px',
                                        color: isLabelFloated('fullName') ? '#374151' : '#6B7280',
                                        zIndex: 10
                                    }}
                                >
                                    Full Name
                                </label>
                            </div>

                            {/* Phone Field */}
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('phone')}
                                    onBlur={() => handleBlur('phone')}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="phone"
                                />
                                <label
                                    htmlFor="phone"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('phone') ? '-10px' : '12px',
                                        fontSize: isLabelFloated('phone') ? '12px' : '16px',
                                        color: isLabelFloated('phone') ? '#374151' : '#6B7280',
                                        zIndex: 10
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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="address"
                                />
                                <label
                                    htmlFor="address"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('address') ? '-10px' : '12px',
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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('email') ? '-10px' : '12px',
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
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('password') ? '-10px' : '12px',
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
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strengthLevel === 'very-weak' ? 'bg-red-600 w-1/5' :
                                                passwordStrength.strengthLevel === 'weak' ? 'bg-red-500 w-2/5' :
                                                    passwordStrength.strengthLevel === 'moderate' ? 'bg-yellow-500 w-3/5' :
                                                        passwordStrength.strengthLevel === 'strong' ? 'bg-green-500 w-4/5' :
                                                            'bg-green-600 w-full'
                                                }`}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Password Requirements */}
                            {(showPasswordRequirements || formData.password) && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                                    <div className="grid grid-cols-1 gap-1">
                                        <div className={`flex items-center text-xs ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordStrength.checks.length ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
                                            {PASSWORD_POLICY.minLength}-{PASSWORD_POLICY.maxLength} characters long
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordStrength.checks.uppercase ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
                                            At least one uppercase letter
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordStrength.checks.lowercase ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
                                            At least one lowercase letter
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordStrength.checks.number ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
                                            At least one number
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordStrength.checks.special ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
                                            At least one special character
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordStrength.checks.noRepeating ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordStrength.checks.noRepeating ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
                                            No consecutive identical characters
                                        </div>
                                    </div>

                                    {/* Password Suggestions */}
                                    {formData.password && passwordStrength.score < 6 && (
                                        <div className="mt-3 pt-3 border-t border-blue-200">
                                            <h5 className="text-xs font-medium text-blue-700 mb-1">Suggestions:</h5>
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
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                                    placeholder=" "
                                    id="confirmPassword"
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                                    style={{
                                        top: isLabelFloated('confirmPassword') ? '-10px' : '12px',
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

                            {/* reCAPTCHA Widget */}
                            <div className="flex justify-center my-6">
                                <ReCAPTCHA
                                    sitekey="6LfKjpMrAAAAAH5D2XQ2StoHV3Us67hh8SEwMJZP"
                                    onChange={setCaptchaValue}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full max-w-xs py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-900 transform hover:scale-[1.02]'
                                        }`}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="mt-6 text-center pb-4">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                                        Sign in here!
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
