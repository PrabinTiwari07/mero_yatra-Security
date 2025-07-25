import { lazy, Suspense, useState } from 'react';
import { FaMapMarkerAlt, FaMountain, FaRoute, FaSearchLocation } from 'react-icons/fa';

// Dynamically import MapPicker
const MapPicker = lazy(() => import('./mapPicker'));

const ExploreNepal = () => {
    const [showMap, setShowMap] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        setShowMap(true);
    };

    const handleLocationSelect = (location) => {
        setSearchTerm(location);
        setShowMap(false);
        // You can add additional logic here to handle the selected location
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-grey-50 to-indigo-100 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full -translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full text-black text-3xl font-semibold">
                        EXPLORE NEPAL
                    </div>
                </div>

                {/* Interactive Map Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    {/* Map Container */}
                    <div className="flex justify-center mb-8">
                        <div className="relative max-w-[600px] w-full group">
                            <img
                                src="/assets/map.png"
                                alt="Nepal Map"
                                className="w-full rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Map Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-2xl px-6 py-4 transition-colors duration-300 border-2 border-transparent focus-within:border-black focus-within:bg-white">
                                <FaSearchLocation className="text-2xl text-black mr-4" />
                                <input
                                    type="text"
                                    placeholder="Search destinations in Nepal..."
                                    className="bg-transparent outline-none flex-grow text-gray-700 font-medium placeholder-gray-500 text-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl transition-colors duration-300 font-semibold ml-4"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    {[
                        {
                            icon: <FaMapMarkerAlt className="text-2xl text-blue-500" />,
                            title: 'Easy Location Search',
                            description: 'Find and book vehicles for any destination across Nepal'
                        },
                        {
                            icon: <FaRoute className="text-2xl text-green-500" />,
                            title: 'Best Routes',
                            description: 'Get recommendations for the most scenic and safe routes'
                        },
                        {
                            icon: <FaMountain className="text-2xl text-purple-500" />,
                            title: 'Mountain Adventures',
                            description: 'Special vehicles equipped for high-altitude mountain trips'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Picker Modal */}
            {showMap && (
                <Suspense fallback={
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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

export default ExploreNepal;