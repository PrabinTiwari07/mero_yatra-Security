// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { FaArrowRight, FaCog, FaGasPump, FaUsers } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const PopularServices = () => {
//     const [services, setServices] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const res = await axios.get('http://localhost:3000/api/services');
//                 setServices(res.data.services || []);
//             } catch (err) {
//                 console.error('Error fetching services:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchServices();
//     }, []);

//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1,
//                 delayChildren: 0.2
//             }
//         }
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 30 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.6,
//                 ease: "easeOut"
//             }
//         }
//     };

//     // Generate features based on actual service data
//     const getVehicleFeatures = (service) => {
//         const features = [];
//         if (service.airConditioning) {
//             features.push('AC');
//         }
//         if (service.transmission) {
//             features.push(service.transmission);
//         } else {
//             features.push('N/A Transmission');
//         }
//         if (service.fuelType) {
//             features.push(service.fuelType);
//         } else {
//             features.push('N/A Fuel');
//         }
//         features.push('GPS', 'Insurance'); // Default features
//         return features;
//     };

//     // Handle book now button click
//     const handleBookNow = (service) => {
//         // Navigate to rent page with vehicle details
//         navigate('/vehicle-rent', {
//             state: {
//                 selectedVehicle: service,
//                 vehicleId: service._id
//             }
//         });
//     };

//     return (
//         <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
//             {/* Background Decorations */}
//             <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full translate-x-1/3 translate-y-1/3"></div>

//             <div className="max-w-7xl mx-auto relative z-10">
//                 {/* Header */}
//                 <motion.div
//                     className="text-center mb-16"
//                     initial={{ opacity: 0, y: -20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 text-black text-sm font-semibold">
//                         Our Services
//                     </div>

//                     <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
//                         Choose Your Perfect Ride
//                     </h2>


//                 </motion.div>

//                 {/* Loading State */}
//                 {isLoading ? (
//                     <div className="flex justify-center items-center py-20">
//                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : (
//                     /* Services Grid */
//                     <motion.div
//                         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
//                         variants={containerVariants}
//                         initial="hidden"
//                         whileInView="visible"
//                         viewport={{ once: true }}
//                     >
//                         {services.map((service, index) => {
//                             return (
//                                 <motion.div
//                                     key={service._id || index}
//                                     className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
//                                     variants={itemVariants}
//                                     whileHover={{ scale: 1.02 }}
//                                 >
//                                     {/* Image Container */}
//                                     <div className="relative overflow-hidden">
//                                         <img
//                                             src={service.image || '/assets/car.jpg'}
//                                             alt={service.name}
//                                             className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//                                         />
//                                         {/* Overlay */}
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                                         {/* Popular Badge */}
//                                         {index < 2 && (
//                                             <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//                                                 Popular
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Content */}
//                                     <div className="p-6">
//                                         {/* Category & Price */}
//                                         <div className="flex justify-between items-start mb-3">
//                                             <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded">
//                                                 {service.category}
//                                             </span>
//                                             <div className="text-right">
//                                                 <div className="text-lg font-bold text-gray-800">
//                                                     Rs. {service.price || 'N/A'}
//                                                 </div>
//                                                 <div className="text-xs text-gray-500">per day</div>
//                                             </div>
//                                         </div>

//                                         {/* Vehicle Name */}
//                                         <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
//                                             {service.name}
//                                         </h3>

//                                         {/* Description */}
//                                         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                                             {service.description}
//                                         </p>

//                                         {/* Features */}
//                                         <div className="flex flex-wrap gap-2 mb-4">
//                                             {getVehicleFeatures(service).map((feature, i) => (
//                                                 <span
//                                                     key={i}
//                                                     className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
//                                                 >
//                                                     {feature}
//                                                 </span>
//                                             ))}
//                                         </div>

//                                         {/* Stats */}
//                                         <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                                             <div className="flex items-center">
//                                                 <FaUsers className="mr-1" />
//                                                 <span>{service.seats || 'N/A'} seats</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <FaCog className="mr-1" />
//                                                 <span>{service.transmission || 'N/A'}</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <FaGasPump className="mr-1" />
//                                                 <span>{service.fuelType || 'N/A'}</span>
//                                             </div>
//                                         </div>

//                                         {/* Additional Vehicle Info - Always show with N/A fallbacks */}
//                                         <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4">
//                                             <div className="flex items-center">
//                                                 <span className="mr-1">🚪</span>
//                                                 <span>{service.doors || 'N/A'} doors</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <span className="mr-1">🧳</span>
//                                                 <span>{service.luggage || 'N/A'}</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <span className="mr-1">❄️</span>
//                                                 <span>{service.airConditioning ? 'AC' : 'No AC'}</span>
//                                             </div>
//                                         </div>

//                                         {/* Action Button */}
//                                         <button
//                                             onClick={() => handleBookNow(service)}
//                                             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
//                                         >
//                                             <span>Book Now</span>
//                                             <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                                         </button>
//                                     </div>
//                                 </motion.div>
//                             );
//                         })}
//                     </motion.div>
//                 )}

//                 {/* Empty State */}
//                 {!isLoading && services.length === 0 && (
//                     <motion.div
//                         className="text-center py-16"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.6 }}
//                     >
//                         <div className="text-6xl mb-4">🚗</div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vehicles Available</h3>
//                         <p className="text-gray-600">We're working on adding more vehicles to our fleet.</p>
//                     </motion.div>
//                 )}

//                 {/* Call to Action */}
//                 {!isLoading && services.length > 0 && (
//                     <motion.div
//                         className="text-center mt-16"
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, delay: 0.5 }}
//                         viewport={{ once: true }}
//                     >

//                     </motion.div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default PopularServices;
