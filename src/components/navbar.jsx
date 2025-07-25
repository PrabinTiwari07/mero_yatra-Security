import { useEffect, useState } from 'react';
import { FaBars, FaBell, FaTimes } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userProfile, setUserProfile] = useState(null);
    const [profileImage, setProfileImage] = useState('/assets/profile.png');
    const navigate = useNavigate();

    // Updated navItems to ensure consistency
    const navItems = ['Home', 'Services', 'Self Drive', 'Hire a Driver', 'Contact'];

    const routeMap = {
        'Home': '/home',
        'Contact': '/contact',
        'Self Drive': '/self-drive',
        'Hire a Driver': '/hire-driver',
        'Services': '/services',  // Verified this route
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleProfile = () => setProfileOpen(!profileOpen);

    // Fetch unread notifications count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:3000/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.notifications) {
                        const unread = data.notifications.filter(notif => !notif.isRead).length;
                        setUnreadCount(unread);
                    }
                }
            } catch (error) {
                console.log('Error fetching notifications:', error);
            }
        };

        fetchUnreadCount();

        // Listen for notification updates from other components
        const handleNotificationUpdate = () => {
            fetchUnreadCount();
        };

        window.addEventListener('notificationUpdate', handleNotificationUpdate);

        // Refresh count every 30 seconds for more real-time updates
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationUpdate', handleNotificationUpdate);
        };
    }, []);

    // Fetch user profile data including profile image
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

                    // Set profile image if available
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

    const handleNotificationClick = () => {
        navigate('/notifications');
        // Reset count when user opens notifications
        setUnreadCount(0);
    };

    return (
        <header className="sticky top-0 z-50 w-full px-4 py-4 bg-transparent backdrop-blur-md">

            <div className="bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center justify-between relative">
                {/* Logo and Name */}
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className="h-12 w-12 bg-white p-1 rounded-full object-cover shadow-md"
                    />
                    <span className="font-bold text-xl hidden sm:block">YatriK</span>
                </div>

                {/* Desktop Navigation */}
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

                {/* Right side: Bell, Profile, Hamburger */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Bell Icon */}
                    <div className="relative cursor-pointer group" onClick={handleNotificationClick}>
                        <FaBell className="text-white/80 text-lg hover:text-white transition-all duration-200 group-hover:scale-110" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border border-white rounded-full text-xs font-semibold text-white flex items-center justify-center animate-pulse shadow-sm">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>

                    {/* Profile Image */}
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
                                {/* User Info Section */}
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

                                {/* Menu Items */}
                                <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                    My Profile
                                </NavLink>
                                <NavLink to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">
                                    Booking History
                                </NavLink>
                                <NavLink to="/change-password" className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Change Password
                                </NavLink>
                                <NavLink to="/help" className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Help
                                </NavLink>
                                <NavLink to="/login" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-t border-gray-200">
                                    Log Out
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Hamburger for Mobile */}
                    <button className="md:hidden text-xl" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
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
