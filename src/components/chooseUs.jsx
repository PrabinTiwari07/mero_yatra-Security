import { FaCarSide, FaHeadset, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const features = [
    {
        icon: <FaCarSide className="text-3xl" />,
        title: 'Wide Selection of Vehicles',
        description: 'Choose from our premium fleet of cars, bikes, and SUVs'
    },
    {
        icon: <FaShieldAlt className="text-3xl" />,
        title: 'Verified Vehicles & Drivers',
        description: 'All vehicles and drivers are thoroughly verified for your safety'
    },
    {
        icon: <FaMoneyBillWave className="text-3xl" />,
        title: 'Transparent Pricing',
        description: 'No hidden charges, clear pricing with upfront cost breakdown'
    },
    {
        icon: <FaHeadset className="text-3xl" />,
        title: '24/7 Customer Support',
        description: 'Round-the-clock assistance for all your travel needs'
    },
];

const ChooseUs = () => {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Why Choose Us?
                    </h2>
                    <p className="text-gray-600">
                        Discover what makes us the preferred choice for your travel needs
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white mx-auto">
                                {feature.icon}
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg mb-3">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default ChooseUs;
