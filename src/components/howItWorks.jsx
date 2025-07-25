import { FaCalendarAlt, FaCar, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaCar className="text-3xl" />,
            title: 'Choose Vehicle',
            desc: 'Browse and select from our wide range of vehicles that suit your needs',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl" />,
            title: 'Add Location',
            desc: 'Select your pickup and drop-off locations for convenient service',
            color: 'bg-green-500',
            bgColor: 'bg-green-50'
        },
        {
            icon: <FaCalendarAlt className="text-3xl" />,
            title: 'Add Date & Time',
            desc: 'Choose your preferred pickup date and time that works best for you',
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50'
        },
        {
            icon: <FaCreditCard className="text-3xl" />,
            title: 'Payment',
            desc: 'Complete your booking with secure payment and get instant confirmation',
            color: 'bg-yellow-500',
            bgColor: 'bg-red-50'
        },
    ];

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-black-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-black-100 text-black-700 text-sm font-semibold">
                        <span className="mr-2"></span>
                        HOW IT WORKS
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Rent with Following 4 Simple Steps
                    </h2>


                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, i) => (
                        <div key={i} className="relative">
                            <div className={`relative ${step.bgColor} rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-shadow duration-300`}>
                                {/* Step Number */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50">
                                    <span className="text-sm font-bold text-gray-700">{i + 1}</span>
                                </div>

                                {/* Icon Container */}
                                <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-4 text-white mx-auto`}>
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Arrow Between Steps */}
                            {/* {i < steps.length - 1 && (
                                <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                    <div className="bg-white rounded-full p-2 shadow-md">
                                        <FaArrowRight className="text-gray-400 text-sm" />
                                    </div>
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Ready to Get Started?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Join thousands of satisfied customers who trust us for their travel needs.
                        </p>
                        <NavLink to="/services" className="inline-block bg-black text-white font-semibold py-3 px-8 rounded-xl ">
                            Start Booking Now
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
