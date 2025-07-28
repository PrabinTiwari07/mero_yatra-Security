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

    // Restore missing handlers
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
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100 relative px-4">
            <ToastContainer />

            {error && (
                <div className="absolute top-6 right-6 bg-red-800 text-white px-6 py-3 rounded-md shadow-lg font-medium z-10">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-xl p-10 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
                <p className="mb-6 text-gray-600">Please check your email for the 4-digit verification code.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center space-x-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-48 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900"
                    >
                        Verify
                    </button>
                </form>
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className={`mt-4 w-48 py-3 rounded-md font-semibold border border-black text-black bg-white hover:bg-gray-100 transition ${resendLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {resendLoading ? 'Resending...' : 'Resend OTP'}
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp;
