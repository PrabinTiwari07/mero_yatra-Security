import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCar, FaCheck, FaMapMarkerAlt, FaTimes, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/footer';
import MapPicker from '../../components/mapPicker';
import Navbar from '../../components/navbar';

const VehicleRent = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [pickupDate, setPickupDate] = useState(null);
    const [dropoffDate, setDropoffDate] = useState(null);
    const [pickupTime, setPickupTime] = useState(null);
    const [dropoffTime, setDropoffTime] = useState(null);
    const [showPickupMap, setShowPickupMap] = useState(false);
    const [showDropoffMap, setShowDropoffMap] = useState(false);
    const [totalDays, setTotalDays] = useState(0);
    const [includeDriver, setIncludeDriver] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedVehicle) {
            setSelectedVehicle(location.state.selectedVehicle);
        }
    }, [location.state]);

    // Calculating total days and price
    useEffect(() => {
        if (pickupDate && dropoffDate) {
            const start = dayjs(pickupDate);
            const end = dayjs(dropoffDate);
            const days = end.diff(start, 'day');
            const calculatedDays = days > 0 ? days : 1;
            setTotalDays(calculatedDays);

            if (selectedVehicle?.price) {
                let basePrice = selectedVehicle.price * calculatedDays;
                // driver cost if selected 
                if (includeDriver) {
                    basePrice += 500 * calculatedDays;
                }
                setTotalPrice(basePrice);
            }
        }
    }, [pickupDate, dropoffDate, selectedVehicle, includeDriver]);

    const handlePickupLocationSelect = (address, coords) => {
        setPickupLocation(address);
        setPickupCoords(coords);
        setShowPickupMap(false);
    };

    const handleDropoffLocationSelect = (address, coords) => {
        setDropoffLocation(address);
        setDropoffCoords(coords);
        setShowDropoffMap(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedVehicle) return toast.error('No vehicle selected.');
        if (!pickupLocation.trim()) return toast.error('Please select a valid pickup location.');
        if (!dropoffLocation.trim()) return toast.error('Please select a valid dropoff location.');
        if (!pickupDate || !pickupTime) return toast.error('Please select pickup date & time.');
        if (!dropoffDate || !dropoffTime) return toast.error('Please select dropoff date & time.');

        const pickup = dayjs(pickupDate).hour(dayjs(pickupTime).hour()).minute(dayjs(pickupTime).minute());
        const dropoff = dayjs(dropoffDate).hour(dayjs(dropoffTime).hour()).minute(dayjs(dropoffTime).minute());

        if (pickup.isAfter(dropoff)) return toast.error('Drop-off date and time must be after pickup date and time.');
        if (pickup.isBefore(dayjs())) return toast.error('Pickup date and time cannot be in the past.');

        const bookingData = {
            vehicle: selectedVehicle,
            pickupLocation,
            dropoffLocation,
            pickupCoords,
            dropoffCoords,
            pickupDate: pickupDate.toString(),
            dropoffDate: dropoffDate.toString(),
            pickupTime: pickupTime.toString(),
            dropoffTime: dropoffTime.toString(),
            totalDays,
            includeDriver,
            totalPrice,
            rentalType: includeDriver ? 'with-driver' : 'self-drive'
        };

        navigate('/pay', { state: bookingData });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
            <Navbar />

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-black hover:text-gray-800 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back
                    </button>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Vehicle Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            {selectedVehicle ? (
                                <>
                                    <div className="mb-4">
                                        <img
                                            src={selectedVehicle.image || '/assets/car.jpg'}
                                            alt={selectedVehicle.name}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVehicle.name}</h3>
                                    <p className="text-gray-600 mb-4">{selectedVehicle.description}</p>

                                    {/* Vehicle Specs */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium">{selectedVehicle.category}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Seats:</span>
                                            <span className="font-medium">{selectedVehicle.seats || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Transmission:</span>
                                            <span className="font-medium">{selectedVehicle.transmission || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Fuel Type:</span>
                                            <span className="font-medium">{selectedVehicle.fuelType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">AC:</span>
                                            <span className="font-medium">{selectedVehicle.airConditioning ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Base Price (per day):</span>
                                            <span className="font-medium">Rs. {selectedVehicle.price}</span>
                                        </div>
                                        {includeDriver && (
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Driver (per day):</span>
                                                <span className="font-medium">Rs. 500</span>
                                            </div>
                                        )}
                                        {totalDays > 0 && (
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Duration:</span>
                                                <span className="font-medium">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-bold text-black border-t pt-2">
                                            <span>Total:</span>
                                            <span>Rs. {totalPrice}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <FaCar className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicle Selected</h3>
                                    <p className="text-gray-500">Please select a vehicle from the catalog</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Rental Details</h2>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* Rental Type Selection */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">Rental Type</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div
                                                onClick={() => setIncludeDriver(false)}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${!includeDriver
                                                    ? 'border-black bg-gray-100'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <FaCar className="text-black mr-3" />
                                                    <div>
                                                        <h3 className="font-medium">Self Drive</h3>
                                                        <p className="text-sm text-gray-500">Drive yourself</p>
                                                    </div>
                                                    {!includeDriver && <FaCheck className="ml-auto text-black" />}
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setIncludeDriver(true)}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${includeDriver
                                                    ? 'border-black bg-gray-100'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <FaUser className="text-black mr-3" />
                                                    <div>
                                                        <h3 className="font-medium">With Driver</h3>
                                                        <p className="text-sm text-gray-500">+Rs. 500/day</p>
                                                    </div>
                                                    {includeDriver && <FaCheck className="ml-auto text-black" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pickup Location */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Pick-up Location</label>
                                        <div className="relative" onClick={() => setShowPickupMap(true)}>
                                            <input
                                                type="text"
                                                value={pickupLocation}
                                                placeholder="Click to select pickup location"
                                                readOnly
                                                className="w-full pr-10 pl-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            />
                                            <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
                                        </div>
                                    </div>

                                    {/* Dropoff Location */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Drop-off Location</label>
                                        <div className="relative" onClick={() => setShowDropoffMap(true)}>
                                            <input
                                                type="text"
                                                value={dropoffLocation}
                                                placeholder="Click to select drop-off location"
                                                readOnly
                                                className="w-full pr-10 pl-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            />
                                            <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
                                        </div>
                                    </div>

                                    {/* Dates & Times */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Pick-up Date</label>
                                            <DatePicker
                                                value={pickupDate}
                                                onChange={setPickupDate}
                                                format="MM/DD/YYYY"
                                                minDate={dayjs()}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        placeholder: "Select date",
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                backgroundColor: '#f9fafb',
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#000'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Drop-off Date</label>
                                            <DatePicker
                                                value={dropoffDate}
                                                onChange={setDropoffDate}
                                                format="MM/DD/YYYY"
                                                minDate={pickupDate || dayjs()}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        placeholder: "Select date",
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                backgroundColor: '#f9fafb',
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#000'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Pick-up Time</label>
                                            <TimePicker
                                                value={pickupTime}
                                                onChange={setPickupTime}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        placeholder: "Select time",
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                backgroundColor: '#f9fafb',
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#000'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Drop-off Time</label>
                                            <TimePicker
                                                value={dropoffTime}
                                                onChange={setDropoffTime}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        placeholder: "Select time",
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                backgroundColor: '#f9fafb',
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#000'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </LocalizationProvider>

                                {/* Submit Button */}
                                <div className="pt-2 space-y-3">
                                    <button
                                        type="submit"
                                        className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                    >
                                        Proceed to Payment - Rs. {totalPrice}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-full flex items-center justify-center text-red-600 hover:text-red-800 font-semibold py-3 px-6 rounded-lg border border-red-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 "
                                    >
                                        <FaTimes className="mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Map Modals */}
            {showPickupMap && (
                <MapPicker
                    onSelect={handlePickupLocationSelect}
                    onClose={() => setShowPickupMap(false)}
                />
            )}
            {showDropoffMap && (
                <MapPicker
                    onSelect={handleDropoffLocationSelect}
                    onClose={() => setShowDropoffMap(false)}
                />
            )}

            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                toastStyle={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                progressStyle={{ background: 'rgba(59, 130, 246, 0.7)' }}
            />
        </div>
    );
};

export default VehicleRent;
