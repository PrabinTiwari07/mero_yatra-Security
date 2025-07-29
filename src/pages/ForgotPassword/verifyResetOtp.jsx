import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const VerifyResetOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error('Email not found. Please go back and try again.');
            return;
        }

        setIsResending(true);
        try {
            // Use forgot-password endpoint instead of resend-otp for password reset scenarios
            const res = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to resend OTP');
            }

            toast.success('OTP resent to your email!', {
                position: 'top-right',
                autoClose: 3000,
            });

            // Clear current OTP
            setOtp(['', '', '', '']);
            setError('');

            // Focus first input
            const firstInput = document.getElementById('otp-0');
            firstInput?.focus();

        } catch (err) {
            toast.error(err.message || 'Failed to resend OTP', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsResending(false);
        }
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join('');
        if (finalOtp.length !== 4) {
            setError('Enter complete OTP');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const res = await fetch('/api/users/verify-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: finalOtp }),
            });

            const contentType = res.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = { message: await res.text() };
            }

            if (!res.ok) throw new Error(data.message);

            toast.success('OTP verified! Set a new password.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
            });

            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 1000);

        } catch (err) {
            setError(err.message || 'OTP verification failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative px-4 py-6">
            <ToastContainer />

            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg relative">
                {/* Back Button Inside Container */}
                <Link
                    to="/forgot-password"
                    className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft size={18} />
                    <span className="text-sm font-medium">Back</span>
                </Link>

                <div className="text-center mb-8 mt-10">
                    <img src="/assets/logo.png" alt="YatriK Logo" className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Enter OTP</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Check your email for a 4-digit verification code
                    </p>
                    {email && (
                        <p className="text-gray-500 text-xs">
                            Code sent to: {email}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-56 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Verify OTP
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-56 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Resend OTP Section */}
                    <div className="text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="text-black font-semibold hover:text-gray-700 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isResending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyResetOtp;
