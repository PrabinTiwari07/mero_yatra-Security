import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [profileImage, setProfileImage] = useState('/assets/profile.png');
    const navigate = useNavigate();

    const navItems = ['Home', 'Services', 'Self Drive', 'Hire a Driver', 'Contact'];

    const routeMap = {
        'Home': '/home',
        'Contact': '/contact',
        'Self Drive': '/self-drive',
        'Hire a Driver': '/hire-driver',
        'Services': '/services',
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleProfile = () => setProfileOpen(!profileOpen);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:3000/api/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserProfile(data.user);

                    if (data.user.profileImage) {
                        setProfileImage(`http://localhost:3000${data.user.profileImage}`);
                    }
                }
            } catch (error) {
                console.log('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full px-4 py-4 bg-transparent backdrop-blur-md">
            <div className="bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className="h-12 w-12 bg-white p-1 rounded-full object-cover shadow-md"
                    />
                    <span className="font-bold text-xl hidden sm:block">MeroYatra</span>
                </div>

                <nav className="hidden md:flex gap-6 lg:gap-10 text-sm font-semibold">
                    {navItems.map((item, i) => (
                        <NavLink
                            key={i}
                            to={routeMap[item]}
                            className={({ isActive }) =>
                                `relative px-1 transition-all duration-200 ${isActive
                                    ? 'text-white font-bold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white'
                                    : 'text-white/80 hover:text-white hover:after:absolute hover:after:-bottom-1 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-white hover:after:transition-all hover:after:duration-300'
                                }`
                            }
                        >
                            {item}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="relative">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer"
                            onClick={toggleProfile}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/profile.png';
                            }}
                        />
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/assets/profile.png';
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {userProfile?.fullName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {userProfile?.email || 'user@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                    My Profile
                                </NavLink>
                                <NavLink to="/session-settings" className="block px-4 py-2 hover:bg-gray-100">
                                    Session Management
                                </NavLink>
                                <NavLink to="/change-password" className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Change Password
                                </NavLink>
                                <LogoutButton
                                    variant="dropdown-item"
                                    className="border-t border-gray-200 text-red-600"
                                    onLogoutSuccess={() => setProfileOpen(false)}
                                />
                            </div>
                        )}
                    </div>

                    <button className="md:hidden text-xl" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden mt-2 bg-black text-white rounded-xl shadow-md px-4 py-3 space-y-3">
                    {navItems.map((item, i) => (
                        <NavLink
                            key={i}
                            to={routeMap[item]}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block text-sm ${isActive ? 'font-bold text-white' : 'text-white/90'}`
                            }
                        >
                            {item}
                        </NavLink>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Navbar;
