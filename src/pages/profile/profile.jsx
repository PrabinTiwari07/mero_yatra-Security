import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import PasswordStatusCard from '../../components/PasswordStatusCard';
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Profile Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                        <img
                                            src={
                                                user.profileImage
                                                    ? `http://localhost:3000${user.profileImage}`
                                                    : '/default.png'
                                            }
                                            alt="Profile"
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                        <div className="text-center sm:text-left text-white">
                                            <h1 className="text-2xl sm:text-3xl font-bold">{user.fullName}</h1>
                                            <div className="flex items-center justify-center sm:justify-start mt-2">
                                                <p className="text-yellow-300 text-lg mr-2">★ 4.3</p>
                                                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                                    Traveler
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-center sm:justify-end">
                                        <button
                                            onClick={() => navigate('/edit-profile')}
                                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 shadow-md"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Information */}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-gray-500 text-sm font-medium mb-1">Address</div>
                                            <div className="text-gray-800 font-medium">{user.address}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-gray-500 text-sm font-medium mb-1">Contact</div>
                                            <div className="text-gray-800 font-medium">{user.phone}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-gray-500 text-sm font-medium mb-1">Email</div>
                                            <div className="text-gray-800 font-medium">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Sidebar */}
                        <div className="lg:col-span-1">
                            <PasswordStatusCard />
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}


        </>
    );
};

export default Profile;
