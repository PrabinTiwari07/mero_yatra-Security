import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import AboutUs from '../components/aboutUs';
import ChooseUs from '../components/chooseUs';
import ExploreNepal from '../components/exploreNepal';
import Footer from '../components/footer';
import Hero from '../components/hero';
import HowItWorks from '../components/howItWorks';
import Services from './service/Services';

const LandingPage = () => {
    return (
        <div className="font-sans text-gray-800">
            <nav className="sticky top-0 z-50 bg-[#971C30] text-white px-6 py-4 mx-4 rounded-full flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="YatriK Logo" className="h-10 w-10 rounded-full object-cover bg-white p-1" />
                </div>
                <div className="flex gap-6 text-sm font-medium">
                    <Link to="/" className="text-white hover:text-gray-300 font-bold">Home</Link>
                    <Link to="/contact" className="hover:text-gray-300">Contact</Link>
                    <Link to="/self-drive" className="hover:text-gray-300">Self Drive</Link>
                    <Link to="/hire-driver" className="hover:text-gray-300">Hire a Driver</Link>
                </div>
                <Link to="/login" className="bg-white text-[#971C30] px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100">Sign In</Link>
            </nav>

            <Hero />
            <HowItWorks />
            <Services showNavbar={false} standalone={false} />
            <ChooseUs />
            <ExploreNepal />
            <AboutUs />
            <Footer />
        </div>
    );
};

export default LandingPage;
