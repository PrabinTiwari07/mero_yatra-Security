import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUs from '../../components/aboutUs';
import ChooseUs from '../../components/chooseUs';
import ExploreNepal from '../../components/exploreNepal';
import Footer from '../../components/footer';
import Hero from '../../components/hero';
import HowItWorks from '../../components/howItWorks';
import Navbar from '../../components/navbar';
import PasswordWarningBanner from '../../components/PasswordWarningBanner';
import usePasswordStatus from '../../hooks/usePasswordStatus';
import Services from '../service/Services';

const Home = () => {
    const { passwordStatus, loading } = usePasswordStatus();
    const navigate = useNavigate();

    // Redirect to change password if expired
    useEffect(() => {
        if (passwordStatus && (passwordStatus.isExpired || passwordStatus.mustChangePassword)) {
            navigate('/forgot-password', {
                state: {
                    expired: true,
                    email: JSON.parse(localStorage.getItem('user'))?.email,
                    message: passwordStatus.isExpired
                        ? 'Your password has expired. Please reset it to continue.'
                        : 'You must change your password before proceeding.'
                }
            });
        }
    }, [passwordStatus, navigate]);

    return (
        <div className="bg-gray-100">
            <Navbar />
            {/* Password Warning Banner */}
            {!loading && passwordStatus && (
                <PasswordWarningBanner
                    passwordStatus={passwordStatus}
                />
            )}
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

export default Home;
