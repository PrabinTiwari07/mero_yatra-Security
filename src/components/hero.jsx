import { lazy, Suspense, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Dynamically import MapPicker with no SSR
const MapPicker = lazy(() => import('./mapPicker'));

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPassengers, setSelectedPassengers] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

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

    const handleSearchClick = () => {
        // Navigate to services page instead of search page
        navigate('/services');
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/car.png')",
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-6xl px-6 py-20 mx-auto">
                {/* Hero Text */}
                <div className="text-white mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Explore Nepal's
                        <br />
                        <span className="text-red-400">Beauty With Ease</span>
                    </h1>

                </div>

                {/* Search Section - Outside the box */}
                <div className="max-w-2xl mx-auto mb-12">
                    <button
                        className="w-full bg-white text-black font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center text-lg"
                        onClick={handleSearchClick}
                    >
                        <FiSearch className="mr-3" />
                        Browse Available Vehicles
                    </button>
                </div>



                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                    {[
                        { number: '500+', label: 'Happy Customers' },
                        { number: '50+', label: 'Premium Vehicles' },
                        { number: '50+', label: 'Destinations' },
                        { number: '24/7', label: 'Customer Support' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center text-white">
                            <div className="text-3xl font-bold mb-2">{stat.number}</div>
                            <div className="text-white/80 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Picker Modal */}
            {showMap && (
                <Suspense fallback={
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">                    <div className="bg-white rounded-lg p-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
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
