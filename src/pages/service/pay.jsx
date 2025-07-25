import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCar, FaCheck, FaCreditCard, FaMoneyBillWave, FaTimes, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';

const Pay = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setBookingData(location.state);
        } else {
            toast.error('No booking data found');
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleKhaltiPayment = async () => {
        if (!bookingData) return;

        setIsProcessing(true);

        try {
            const paymentData = {
                amount: bookingData.totalPrice * 100, // Convert to paisa
                purchase_order_id: `VEHICLE_RENTAL_${Date.now()}`,
                purchase_order_name: `Vehicle Rental - ${bookingData.vehicle.name}`,
                customer_info: {
                    name: 'Vehicle Rental Customer',
                    email: 'customer@example.com',
                    phone: '9800000001'
                },
                amount_breakdown: [
                    {
                        label: `Vehicle rental for ${bookingData.totalDays} day(s)`,
                        amount: bookingData.vehicle.price * bookingData.totalDays * 100
                    },
                    ...(bookingData.includeDriver ? [{
                        label: `Driver service for ${bookingData.totalDays} day(s)`,
                        amount: 500 * bookingData.totalDays * 100
                    }] : [])
                ]
            };

            console.log('🚀 Initiating Vehicle Rental Khalti Payment:', paymentData);

            // ✅ Call YOUR backend instead of Khalti directly
            const response = await fetch('http://localhost:3000/api/payment/khalti/initiate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    return_url: `${window.location.origin}/pay-success`,
                    website_url: window.location.origin,
                    amount: paymentData.amount,
                    purchase_order_id: paymentData.purchase_order_id,
                    purchase_order_name: paymentData.purchase_order_name,
                    customer_info: paymentData.customer_info,
                    amount_breakdown: paymentData.amount_breakdown
                })
            });

            const khaltiData = await response.json();
            console.log('✅ Vehicle Rental Khalti Response:', khaltiData);

            if (khaltiData.payment_url) {
                toast.success('Payment URL generated! Redirecting to Khalti...');

                // Store booking data for later use
                localStorage.setItem('pendingVehicleBooking', JSON.stringify({
                    ...bookingData,
                    pidx: khaltiData.pidx
                }));

                console.log('🔗 Vehicle Rental Payment URL:', khaltiData.payment_url);

                // 🚀 Redirect to Khalti
                setTimeout(() => {
                    window.location.href = khaltiData.payment_url;
                }, 2000);
            } else {
                throw new Error('No payment URL received: ' + JSON.stringify(khaltiData));
            }
        } catch (error) {
            console.error('❌ Vehicle rental payment initiation failed:', error);
            toast.error('Failed to initialize payment: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCashPayment = async () => {
        if (!bookingData) return;

        setIsProcessing(true);

        try {
            // Handle cash payment (book directly)
            await handlePaymentSuccess(null, 'cash');
        } catch (error) {
            console.error('Cash payment error:', error);
            toast.error('Booking failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = async (paymentPayload, method) => {
        try {
            if (method === 'cash') {
                // For cash payment, save booking directly
                const bookingPayload = {
                    vehicle: bookingData.vehicle._id,
                    vehicleName: bookingData.vehicle.name,
                    pickupLocation: bookingData.pickupLocation,
                    dropoffLocation: bookingData.dropoffLocation,
                    pickupCoords: bookingData.pickupCoords,
                    dropoffCoords: bookingData.dropoffCoords,
                    pickupDate: bookingData.pickupDate,
                    dropoffDate: bookingData.dropoffDate,
                    pickupTime: bookingData.pickupTime,
                    dropoffTime: bookingData.dropoffTime,
                    totalDays: bookingData.totalDays,
                    includeDriver: bookingData.includeDriver,
                    totalPrice: bookingData.totalPrice,
                    rentalType: bookingData.rentalType,
                    paymentMethod: method,
                    paymentStatus: 'pending',
                    paymentDetails: null,
                    bookingDate: new Date().toISOString(),
                    status: 'confirmed'
                };

                // Save booking to backend
                const response = await axios.post('http://localhost:3000/api/services/vehicle-booking', bookingPayload, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    setBookingSuccess(true);
                    toast.success('Booking confirmed successfully! Pay cash at pickup.', {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });

                    // Show success message for 3 seconds before redirecting
                    setTimeout(() => {
                        navigate('/my-bookings', {
                            state: {
                                booking: bookingData,
                                paymentMethod: method,
                                bookingSuccess: true
                            }
                        });
                    }, 3000); // 3 second delay
                } else {
                    throw new Error(response.data.message || 'Booking failed');
                }
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading booking details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
            <Navbar />

            {/* Back and Cancel buttons */}
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        disabled={isProcessing}
                    >
                        <FaArrowLeft className="mr-2" />
                        Back
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                        disabled={isProcessing}
                    >
                        <FaTimes className="mr-2" />
                        Cancel
                    </button>
                </div>
            </div>

            <main className="flex-grow max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Section - Booking Summary */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>

                        {/* Vehicle Details */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <img
                                    src={bookingData.vehicle.image || '/assets/car.jpg'}
                                    alt={bookingData.vehicle.name}
                                    className="w-20 h-20 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{bookingData.vehicle.name}</h3>
                                    <p className="text-gray-600">{bookingData.vehicle.category}</p>
                                    <div className="flex items-center mt-1">
                                        {bookingData.includeDriver ? (
                                            <><FaUser className="text-blue-600 mr-1 text-sm" /> With Driver</>
                                        ) : (
                                            <><FaCar className="text-blue-600 mr-1 text-sm" /> Self Drive</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pickup Location:</span>
                                <span className="font-medium text-right max-w-xs">{bookingData.pickupLocation}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Dropoff Location:</span>
                                <span className="font-medium text-right max-w-xs">{bookingData.dropoffLocation}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pickup Date & Time:</span>
                                <span className="font-medium">
                                    {new Date(bookingData.pickupDate).toLocaleDateString()} at {new Date(bookingData.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Dropoff Date & Time:</span>
                                <span className="font-medium">
                                    {new Date(bookingData.dropoffDate).toLocaleDateString()} at {new Date(bookingData.dropoffTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium">{bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t pt-4">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vehicle ({bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''}):</span>
                                    <span className="font-medium">Rs. {bookingData.vehicle.price * bookingData.totalDays}</span>
                                </div>
                                {bookingData.includeDriver && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Driver ({bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''}):</span>
                                        <span className="font-medium">Rs. {500 * bookingData.totalDays}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between text-xl font-bold text-blue-600 border-t pt-4">
                                <span>Total Amount:</span>
                                <span>Rs. {bookingData.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Payment Options */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>

                        {/* Success Banner */}
                        {bookingSuccess && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                                <div className="flex items-center">
                                    <FaCheck className="text-green-600 text-xl mr-3" />
                                    <div>
                                        <h3 className="text-green-800 font-semibold">Booking Confirmed!</h3>
                                        <p className="text-green-700 text-sm">Redirecting to your bookings in a moment...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Online Payment (Khalti) */}
                            <div
                                onClick={() => !bookingSuccess && setPaymentMethod('online')}
                                className={`p-6 border-2 rounded-xl transition-all ${bookingSuccess
                                    ? 'cursor-not-allowed opacity-50 border-gray-200 bg-gray-50'
                                    : paymentMethod === 'online'
                                        ? 'border-blue-500 bg-blue-50 cursor-pointer'
                                        : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FaCreditCard className="text-blue-600 text-2xl mr-4" />
                                        <div>
                                            <h3 className="text-lg font-semibold">Online Payment</h3>
                                            <p className="text-gray-600">Pay securely with Khalti, eSewa, or Banking</p>
                                            <div className="flex items-center mt-2">
                                                <img src="/assets/khalti-logo.png" alt="Khalti" className="h-6 mr-2" />
                                                <span className="text-sm text-gray-500">Khalti, eSewa, Mobile Banking</span>
                                            </div>
                                        </div>
                                    </div>
                                    {paymentMethod === 'online' && <FaCheck className="text-blue-600 text-xl" />}
                                </div>
                            </div>

                            {/* Cash Payment */}
                            <div
                                onClick={() => !bookingSuccess && setPaymentMethod('cash')}
                                className={`p-6 border-2 rounded-xl transition-all ${bookingSuccess
                                    ? 'cursor-not-allowed opacity-50 border-gray-200 bg-gray-50'
                                    : paymentMethod === 'cash'
                                        ? 'border-green-500 bg-green-50 cursor-pointer'
                                        : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FaMoneyBillWave className="text-green-600 text-2xl mr-4" />
                                        <div>
                                            <h3 className="text-lg font-semibold">Cash Payment</h3>
                                            <p className="text-gray-600">Pay in cash when you pick up the vehicle</p>
                                            <p className="text-sm text-orange-600 mt-1">
                                                Note: You'll need to pay at pickup location
                                            </p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cash' && <FaCheck className="text-green-600 text-xl" />}
                                </div>
                            </div>
                        </div>

                        {/* Payment Button */}
                        <div className="mt-8">
                            {paymentMethod === 'online' && (
                                <button
                                    onClick={handleKhaltiPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaCreditCard className="mr-2" />
                                            Pay Rs. {bookingData.totalPrice} Online
                                        </>
                                    )}
                                </button>
                            )}

                            {paymentMethod === 'cash' && (
                                <button
                                    onClick={handleCashPayment}
                                    disabled={isProcessing || bookingSuccess}
                                    className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${bookingSuccess
                                        ? 'bg-green-700 text-white cursor-default'
                                        : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white'
                                        }`}
                                >
                                    {bookingSuccess ? (
                                        <>
                                            <FaCheck className="mr-2" />
                                            Booking Confirmed! Redirecting...
                                        </>
                                    ) : isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                                            Confirming Booking...
                                        </>
                                    ) : (
                                        <>
                                            <FaMoneyBillWave className="mr-2" />
                                            Confirm Booking (Pay Cash Later)
                                        </>
                                    )}
                                </button>
                            )}

                            {!paymentMethod && (
                                <div className="text-center text-gray-500 py-4">
                                    Please select a payment method above
                                </div>
                            )}
                        </div>

                        {/* Payment Security Info */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Secure Payment</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Your payment information is encrypted and secure</li>
                                <li>• No hidden fees or charges</li>
                                <li>• Instant booking confirmation</li>
                                <li>• 24/7 customer support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                toastStyle={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                progressStyle={{ background: 'rgba(59, 130, 246, 0.7)' }}
            />
        </div>
    );
};

export default Pay;
