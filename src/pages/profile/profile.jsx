import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
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

    if (loading || !user) return <div className="p-4">Loading...</div>;

    return (
        <>
            <Navbar /> {/* ✅ OUTSIDE the profile card */}

            <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-10 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={
                                user.profileImage
                                    ? `http://localhost:3000${user.profileImage}`
                                    : '/default.png'
                            }
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{user.fullName}</h2>
                            <p className="text-yellow-600 text-lg">★ 4.3</p>
                            <span className="text-sm border border-gray-400 px-2 py-1 rounded bg-gray-100">
                                Traveler
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/edit-profile')}
                        className="px-4 py-2 border rounded shadow hover:bg-gray-200"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-3 text-center border-t border-b py-4 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium">Address</p>
                        <p>{user.address}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Contact</p>
                        <p>{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Email</p>
                        <p>{user.email}</p>
                    </div>
                </div>

                {/* License Section */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">License Information</h3>
                        {user.license?.status && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.license.status === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : user.license.status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {user.license.status.charAt(0).toUpperCase() + user.license.status.slice(1)}
                            </span>
                        )}
                    </div>

                    {user.license?.licenseNumber || user.license?.licenseImage ? (
                        <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-lg bg-gray-50">
                            {/* License Image */}
                            {user.license.licenseImage && (
                                <div>
                                    <h4 className="font-medium mb-2 text-gray-700">License Image</h4>
                                    <img
                                        src={`http://localhost:3000${user.license.licenseImage}`}
                                        alt="License"
                                        className="w-full max-w-sm h-40 object-cover border rounded-lg shadow-sm"
                                    />
                                </div>
                            )}

                            {/* License Details */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">License Details</h4>

                                {user.license.licenseNumber && (
                                    <div>
                                        <p className="text-sm text-gray-500">License Number</p>
                                        <p className="font-medium">{user.license.licenseNumber}</p>
                                    </div>
                                )}

                                {user.license.fullName && (
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name (as on license)</p>
                                        <p className="font-medium">{user.license.fullName}</p>
                                    </div>
                                )}

                                {user.license.expiryDate && (
                                    <div>
                                        <p className="text-sm text-gray-500">Expiry Date</p>
                                        <p className="font-medium">
                                            {new Date(user.license.expiryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {user.license.uploadedAt && (
                                    <div>
                                        <p className="text-sm text-gray-500">Uploaded On</p>
                                        <p className="font-medium">
                                            {new Date(user.license.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {user.license.verifiedAt && user.license.status === 'verified' && (
                                    <div>
                                        <p className="text-sm text-gray-500">Verified On</p>
                                        <p className="font-medium">
                                            {new Date(user.license.verifiedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-gray-100 p-8 rounded-lg text-gray-500">
                            <div className="text-center">
                                <div className="text-3xl mb-2">📄</div>
                                <p className="text-sm">No license information uploaded</p>
                                <p className="text-xs mt-1">Upload your license in the edit profile section</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* <Footer /> */}


        </>
    );
};

export default Profile;
