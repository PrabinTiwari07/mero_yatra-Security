import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCog, FaGasPump, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Services = ({ showNavbar = true, standalone = true }) => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/services');
                setServices(res.data.services || []);
            } catch (err) {
                console.error('Error fetching services:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Generate features based on actual service data
    const getVehicleFeatures = (service) => {
        const features = [];
        if (service.airConditioning) {
            features.push('AC');
        }
        if (service.transmission) {
            features.push(service.transmission);
        } else {
            features.push('N/A Transmission');
        }
        if (service.fuelType) {
            features.push(service.fuelType);
        } else {
            features.push('N/A Fuel');
        }
        features.push('GPS', 'Insurance'); // Default features
        return features;
    };

    // Handle book now button click
    const handleBookNow = (service) => {
        // Navigate to rent page with vehicle details
        navigate('/vehicle-rent', {
            state: {
                selectedVehicle: service,
                vehicleId: service._id
            }
        });
    };

    return (
        <div className={standalone ? "min-h-screen bg-gradient-to-br from-gray-50" : "bg-gradient-to-br from-gray-50"}>
            {/* Add Navbar - only show if showNavbar is true */}
            {showNavbar && <Navbar />}

            <section className="py-8 px-4 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-red-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200/20 rounded-full translate-x-1/3 translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full text-black font-bold text-3xl">
                            Our Services
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                        </div>
                    ) : (
                        /* Services Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => {
                                return (
                                    <div
                                        key={service._id || index}
                                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                                    >
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={service.image || '/assets/car.jpg'}
                                                alt={service.name}
                                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Popular Badge */}
                                            {index < 2 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    Popular
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            {/* Category & Price */}
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-black-600 text-sm font-medium bg-red-50 px-2 py-1 rounded">
                                                    {service.category}
                                                </span>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-800">
                                                        Rs. {service.price || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">per day</div>
                                                </div>
                                            </div>

                                            {/* Vehicle Name */}
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                {service.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {getVehicleFeatures(service).map((feature, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                                <div className="flex items-center">
                                                    <FaUsers className="mr-1" />
                                                    <span>{service.seats || 'N/A'} seats</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaCog className="mr-1" />
                                                    <span>{service.transmission || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaGasPump className="mr-1" />
                                                    <span>{service.fuelType || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* Additional Vehicle Info - Always show with N/A fallbacks */}
                                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center">
                                                    <span className="mr-1">🚪</span>
                                                    <span>{service.doors || 'N/A'} doors</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">🧳</span>
                                                    <span>{service.luggage || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-1">❄️</span>
                                                    <span>{service.airConditioning ? 'AC' : 'No AC'}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => handleBookNow(service)}
                                                className="w-full bg-black text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
                                            >
                                                <span>Book Now</span>
                                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && services.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🚗</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vehicles Available</h3>
                            <p className="text-gray-600">We're working on adding more vehicles to our fleet.</p>
                        </div>
                    )}


                </div>
            </section>
        </div>
    );
};

export default Services;
