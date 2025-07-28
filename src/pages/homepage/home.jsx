import AboutUs from '../../components/aboutUs';
import ChooseUs from '../../components/chooseUs';
import ExploreNepal from '../../components/exploreNepal';
import Footer from '../../components/footer';
import Hero from '../../components/hero';
import HowItWorks from '../../components/howItWorks';
import Navbar from '../../components/navbar';
import Services from '../service/Services';

const Home = () => {
    return (
        <div className="bg-gray-100">
            <Navbar />
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
