import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const inputRefs = useRef([]);

    const [resendLoading, setResendLoading] = useState(false);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join('');
        if (finalOtp.length !== 4 || !email) {
            setError('Please enter the complete OTP');
            setTimeout(() => setError(''), 3000);
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/users/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: finalOtp }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Invalid OTP');
                setTimeout(() => setError(''), 3000);
                return;
            }
            navigate('/login', {
                state: { success: 'Account Created Successfully!' },
            });
        } catch (err) {
            setError('Server error.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleResendOtp = async () => {
        if (!email) return toast.error('Email not found!', { position: 'top-right' });
        setResendLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/users/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || 'Failed to resend OTP', { position: 'top-right' });
            } else {
                toast.success(data.message || 'OTP resent successfully!', { position: 'top-right' });
            }
        } catch (err) {
            toast.error('Server error.', { position: 'top-right' });
        }
        setResendLoading(false);
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            {error && (
                <div className="absolute top-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium z-10 border border-red-600">
                    {error}
                </div>
            )}

            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="mb-8">
                        <img src="/assets/logo.png" alt="YatriK Logo" className="h-16 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600 text-sm">
                            We've sent a 4-digit verification code to
                        </p>
                        <p className="text-gray-800 font-medium text-sm mt-1">{email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Verify OTP
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resendLoading}
                                className={`w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 ${resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
                            >
                                {resendLoading ? 'Resending...' : 'Resend OTP'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Didn't receive the code? Check your spam folder or try resending.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
