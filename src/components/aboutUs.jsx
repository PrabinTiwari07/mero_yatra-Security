import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaShieldAlt, FaUsers } from 'react-icons/fa';

const AboutUs = () => {
    const features = [
        {
            icon: <FaCheckCircle className="text-green-500" />,
            text: "All types of vehicles — bikes, cars, jeeps, buses & more"
        },
        {
            icon: <FaShieldAlt className="text-blue-500" />,
            text: "Verified drivers and instant self-drive bookings"
        },
        {
            icon: <FaMapMarkerAlt className="text-red-500" />,
            text: "Service coverage across Nepal"
        },
        {
            icon: <FaClock className="text-purple-500" />,
            text: "Transparent pricing and 24/7 support"
        }
    ];

    const stats = [
        { number: '500+', label: 'Happy Customers', icon: <FaUsers className="text-blue-500" /> },
        { number: '50+', label: 'Vehicle Types', icon: <FaCheckCircle className="text-green-500" /> },
        { number: '24/7', label: 'Customer Support', icon: <FaClock className="text-purple-500" /> },
        { number: '100%', label: 'Verified Fleet', icon: <FaShieldAlt className="text-orange-500" /> }
    ];

    return (
        <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-grey-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full -translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full text-black text-4xl font-semibold">
                        <span className="mr-2"></span>
                        ABOUT US
                    </div>

                    <h2 className="text-3xl md:text-2xl font-bold text-gray-800 mb-4">
                        Learn About <span className="text-[#A53041]">YatriK</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover how we're reshaping travel across Nepal with our innovative vehicle rental platform.
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Image */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="/assets/car.png"
                                alt="About YatriK"
                                className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#A53041]"></div>
                                <div className="text-sm text-gray-600">Years of Experience</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Your Trusted Travel Partner in Nepal
                            </h3>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                                YatriK is a comprehensive platform for renting reliable vehicles — whether you're heading to the mountains, exploring the city, or planning a business trip. We make travel accessible and convenient for everyone.
                            </p>

                            {/* Enhanced Features List */}
                            <div className="space-y-4 mb-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {feature.icon}
                                        </div>
                                        <span className="text-gray-700 leading-relaxed">
                                            {feature.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                                We believe travel should be safe, flexible, and accessible for everyone — and that's exactly what
                                <span className="font-semibold text-[#A53041]"> YatriK</span> delivers.
                            </p>
                        </div>
                    </motion.div>
                </div>




            </div>
        </section>
    );
};

export default AboutUs;
