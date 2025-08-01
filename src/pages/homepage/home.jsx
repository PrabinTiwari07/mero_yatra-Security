import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUs from '../../components/aboutUs';
import ChooseUs from '../../components/chooseUs';
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
            {!loading && passwordStatus && (
                <PasswordWarningBanner
                    passwordStatus={passwordStatus}
                />
            )}
            <Hero />
            <HowItWorks />
            <Services showNavbar={false} standalone={false} />
            <ChooseUs />
            <AboutUs />
            <Footer />
        </div>
    );
};

export default Home;
