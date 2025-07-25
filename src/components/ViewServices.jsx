// import { motion } from 'framer-motion';
// import { FaArrowRight, FaCar } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const ViewServices = () => {
//     const navigate = useNavigate();

//     return (
//         <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
//             {/* Background Decorations */}
//             <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full translate-x-1/3 translate-y-1/3"></div>

//             <div className="max-w-7xl mx-auto relative z-10">
//                 <motion.div
//                     className="text-center"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 text-black text-sm font-semibold">
//                         Our Vehicle Services
//                     </div>

//                     <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
//                         Choose Your Perfect Ride
//                     </h2>

//                     <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
//                         Discover our premium fleet of vehicles available for rent. From compact cars to luxury SUVs,
//                         find the perfect vehicle for your journey.
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                         <motion.button
//                             onClick={() => navigate('/services')}
//                             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             <FaCar className="mr-2" />
//                             <span>View All Vehicles</span>
//                             <FaArrowRight className="ml-2" />
//                         </motion.button>

//                         <motion.button
//                             onClick={() => navigate('/vehicle-rent')}
//                             className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 flex items-center"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             <span>Quick Book</span>
//                             <FaArrowRight className="ml-2" />
//                         </motion.button>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
//                         <motion.div
//                             className="text-center"
//                             initial={{ opacity: 0, y: 20 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, delay: 0.1 }}
//                             viewport={{ once: true }}
//                         >
//                             <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
//                             <div className="text-gray-600">Vehicles Available</div>
//                         </motion.div>

//                         <motion.div
//                             className="text-center"
//                             initial={{ opacity: 0, y: 20 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, delay: 0.2 }}
//                             viewport={{ once: true }}
//                         >
//                             <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
//                             <div className="text-gray-600">Customer Support</div>
//                         </motion.div>

//                         <motion.div
//                             className="text-center"
//                             initial={{ opacity: 0, y: 20 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, delay: 0.3 }}
//                             viewport={{ once: true }}
//                         >
//                             <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
//                             <div className="text-gray-600">Satisfaction Rate</div>
//                         </motion.div>
//                     </div>
//                 </motion.div>
//             </div>
//         </section>
//     );
// };

// export default ViewServices;
