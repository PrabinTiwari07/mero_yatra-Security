
const Footer = () => {
    return (
        <footer className="bg-[#d4d4d4] text-gray-800 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <img
                            src="/assets/logo.png" // ✅ Make sure logo is in public/images/
                            alt="YatriK Logo"
                            className="h-10 w-10 rounded-full object-cover bg-white p-1"
                        />
                        <h3 className="text-xl font-bold">YatriK</h3>
                    </div>
                    <p className="text-sm">Nepal’s Trusted Vehicle Renting Platform</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Quick Links</h4>
                    <ul className="space-y-1 text-sm">
                        <li>Home</li>
                        <li>Vehicles</li>
                        <li>Contact</li>
                        <li>About</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Support</h4>
                    <ul className="space-y-1 text-sm">
                        <li>FAQs</li>
                        <li>Help Center</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Connect</h4>
                    <ul className="space-y-1 text-sm">
                        <li>yatrik@gmail.com</li>
                        <li>+977 9869028215</li>
                    </ul>
                    <div className="flex gap-3 mt-3 text-xl">
                        <a href="#"><i className="fab fa-facebook"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center text-sm text-black">
                <span className="inline-block bg-black text-white rounded-full w-6 h-6 leading-6 text-xs font-bold">C</span>
                <span className="ml-2 font-semibold">2025 YatriK. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
