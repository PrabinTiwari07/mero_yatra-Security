import { useEffect, useState } from 'react';
import { FiCheck, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import {
    PASSWORD_POLICY,
    assessPasswordStrength,
    calculatePasswordEntropy,
    getPasswordSuggestions,
    getTimeToCrack
} from '../utils/passwordSecurity';

const SecurePasswordInput = ({
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder = "Password",
    id = "password",
    name = "password",
    isLabelFloated = false,
    showRequirements = true,
    showStrengthIndicator = true,
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
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

    // Update password strength when value changes
    useEffect(() => {
        if (value) {
            setPasswordStrength(assessPasswordStrength(value));
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
    }, [value]);

    const handleFocus = (e) => {
        setShowPasswordRequirements(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setShowPasswordRequirements(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className="space-y-2">
            {/* Password Input Field */}
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all peer ${className}`}
                    placeholder=" "
                    id={id}
                />
                <label
                    htmlFor={id}
                    className="absolute left-3 bg-gray-50 px-1 text-gray-500 transition-all duration-200 pointer-events-none"
                    style={{
                        top: isLabelFloated ? '-8px' : '12px',
                        fontSize: isLabelFloated ? '12px' : '16px',
                        color: isLabelFloated ? '#374151' : '#6B7280'
                    }}
                >
                    {placeholder}
                </label>
                <div
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
            </div>

            {/* Password Strength Indicator */}
            {showStrengthIndicator && value && (
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
                        <span>Entropy: {Math.round(calculatePasswordEntropy(value))} bits</span>
                        <span>Time to crack: {getTimeToCrack(value)}</span>
                    </div>
                </div>
            )}

            {/* Password Requirements */}
            {showRequirements && (showPasswordRequirements || value) && (
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
                    {value && passwordStrength.score < 6 && (
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
        </div>
    );
};

export default SecurePasswordInput;
