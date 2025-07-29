import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaShieldAlt, FaStar, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import PasswordStatusCard from '../../components/PasswordStatusCard';
import SessionManager from '../../components/SessionManager';
const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(data.user);
        } catch (err) {
            toast.error('Error fetching profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-blue-100 opacity-25 animate-pulse"></div>
                </div>
                <p className="mt-6 text-gray-600 font-medium">Loading your profile...</p>
                <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-lg text-gray-600">Manage your account and security settings</p>
                        <div className="mt-4 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Profile Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                                {/* Profile Header with Enhanced Gradient */}
                                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-12">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                        }}></div>
                                    </div>

                                    <div className="relative flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                                        <div className="relative group">
                                            <img
                                                src={
                                                    user.profileImage
                                                        ? `http://localhost:3000${user.profileImage}`
                                                        : '/default.png'
                                                }
                                                alt="Profile"
                                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300"
                                            />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        <div className="text-center sm:text-left text-white flex-1">
                                            <h1 className="text-3xl sm:text-4xl font-bold mb-3 drop-shadow-lg">{user.fullName}</h1>
                                            <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                                                <div className="flex items-center bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                    <FaStar className="text-yellow-300 mr-1" />
                                                    <span className="text-yellow-100 font-semibold">4.3</span>
                                                </div>
                                                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                                                    <FaUser className="inline mr-1" />
                                                    Verified Traveler
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-center sm:justify-start text-blue-100">
                                                <FaCalendarAlt className="mr-2" />
                                                <span>Member since 2024</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative mt-8 flex justify-center sm:justify-end">
                                        <button
                                            onClick={() => navigate('/edit-profile')}
                                            className="group bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                                        >
                                            <FaEdit className="group-hover:rotate-12 transition-transform duration-300" />
                                            <span>Edit Profile</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Enhanced Profile Information */}
                                <div className="p-8">
                                    <div className="flex items-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <FaUser className="text-blue-600" />
                                            </div>
                                            Contact Information
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                            <div className="flex items-center mb-3">
                                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                                    <FaMapMarkerAlt className="text-white" />
                                                </div>
                                                <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Address</div>
                                            </div>
                                            <div className="text-gray-800 font-medium text-lg">{user.address}</div>
                                            <div className="mt-2 text-xs text-blue-500 opacity-75">Primary Location</div>
                                        </div>

                                        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                            <div className="flex items-center mb-3">
                                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                                    <FaPhone className="text-white" />
                                                </div>
                                                <div className="text-green-600 text-sm font-semibold uppercase tracking-wide">Contact</div>
                                            </div>
                                            <div className="text-gray-800 font-medium text-lg">{user.phone}</div>
                                            <div className="mt-2 text-xs text-green-500 opacity-75">Verified Number</div>
                                        </div>

                                        <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                            <div className="flex items-center mb-3">
                                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                                    <FaEnvelope className="text-white" />
                                                </div>
                                                <div className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Email</div>
                                            </div>
                                            <div className="text-gray-800 font-medium text-lg break-all">{user.email}</div>
                                            <div className="mt-2 text-xs text-purple-500 opacity-75">Primary Email</div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* Enhanced Security Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Security Header */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaShieldAlt className="text-2xl text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Security Center</h3>
                                    <p className="text-gray-600 text-sm">Manage your account security and active sessions</p>
                                </div>
                            </div>

                            {/* Password Status Card */}
                            <div className="transform hover:scale-[1.02] transition-all duration-300">
                                <PasswordStatusCard />
                            </div>

                            {/* Session Manager */}
                            <div className="transform hover:scale-[1.02] transition-all duration-300">
                                <SessionManager />
                            </div>

                            {/* Security Tips */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-yellow-200">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                                        <span className="text-white text-xs">💡</span>
                                    </div>
                                    Security Tips
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Use strong, unique passwords
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Enable two-factor authentication
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Review active sessions regularly
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Log out from public devices
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}


        </>
    );
};

export default Profile;
