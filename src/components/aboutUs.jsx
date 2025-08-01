import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
    const features = [
        {
            icon: <FaCheckCircle className="text-black" />,
            text: "All types of vehicles — bikes, cars, jeeps, buses & more"
        },
        {
            icon: <FaShieldAlt className="text-black" />,
            text: "Verified drivers and instant self-drive bookings"
        },
        {
            icon: <FaMapMarkerAlt className="text-black" />,
            text: "Service coverage across Nepal"
        },
        {
            icon: <FaClock className="text-black" />,
            text: "Transparent pricing and 24/7 support"
        }
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        About Us
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover how we're reshaping travel across Nepal with our innovative vehicle rental platform.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-lg">
                            <img
                                src="/assets/bmw.jpg"
                                alt="About YatriK"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 rounded-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Your Trusted Travel Partner in Nepal
                            </h3>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                                YatriK is a comprehensive platform for renting reliable vehicles — whether you're heading to the mountains, exploring the city, or planning a business trip. We make travel accessible and convenient for everyone.
                            </p>

                            <div className="space-y-4 mb-6">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {feature.icon}
                                        </div>
                                        <span className="text-gray-700 leading-relaxed">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                                We believe travel should be safe, flexible, and accessible for everyone — and that's exactly what
                                <span className="font-semibold text-black"> YatriK</span> delivers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
