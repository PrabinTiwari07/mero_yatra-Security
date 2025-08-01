import { lazy, Suspense, useEffect, useState } from 'react';
import { FiCalendar, FiMapPin, FiSearch, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MapPicker = lazy(() => import('./mapPicker'));

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPassengers, setSelectedPassengers] = useState('1');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setShowMap(false);
    };

    const handleBookNow = () => {
        navigate('/services');
    };

    const handleQuickSearch = () => {
        navigate('/self-drive');
    };

    return (
        <section className="relative w-full h-screen bg-gray-100">
            <div className="absolute inset-0">
                <img
                    src="/assets/car.png"
                    alt="Car"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center h-full px-6">
                <div className="text-center text-white max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Your Journey Starts Here
                    </h1>

                    <p className="text-xl mb-8 text-gray-200">
                        Rent premium cars for your next adventure in Nepal
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={handleBookNow}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Book Now
                        </button>

                        <button
                            onClick={handleQuickSearch}
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
                        >
                            View Cars
                        </button>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Quick Search
                        </h3>

                        <div className="space-y-4">
                            <div className="relative">
                                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Pick-up location"
                                    value={selectedLocation}
                                    onClick={() => setShowMap(true)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
                                    readOnly
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
                                    />
                                </div>

                                <div className="relative">
                                    <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <select
                                        value={selectedPassengers}
                                        onChange={(e) => setSelectedPassengers(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Person' : 'People'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleBookNow}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                            >
                                <FiSearch className="mr-2" />
                                Search Cars
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showMap && (
                <Suspense fallback={
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading map...</p>
                        </div>
                    </div>
                }>
                    <MapPicker
                        onSelect={handleLocationSelect}
                        onClose={() => setShowMap(false)}
                    />
                </Suspense>
            )}
        </section>
    );
};

export default Hero;
