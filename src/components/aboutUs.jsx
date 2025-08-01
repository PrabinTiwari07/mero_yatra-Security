import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
    const features = [
        {
            icon: <FaCheckCircle className="text-black" />,
            text: "Wide range of vehicles - cars, bikes, jeeps, and buses"
        },
        {
            icon: <FaShieldAlt className="text-black" />,
            text: "Safe and verified vehicles with trusted drivers"
        },
        {
            icon: <FaMapMarkerAlt className="text-black" />,
            text: "Available throughout Nepal"
        },
        {
            icon: <FaClock className="text-black" />,
            text: "Fair pricing and support anytime"
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
                        Making travel easy and affordable across Nepal.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-lg">
                            <img
                                src="/assets/bmw.jpg"
                                alt="About MeroYatra"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 rounded-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Your Travel Partner
                            </h3>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                                We help you rent vehicles easily. Whether you need a car for the city, a jeep for the mountains, or a bus for group travel, we have what you need.
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
                                Travel should be simple and worry-free. That's what we offer at
                                <span className="font-semibold text-black"> MeroYatra</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
