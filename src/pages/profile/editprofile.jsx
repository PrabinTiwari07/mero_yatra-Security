import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        email: '',
        profileImage: '',
    });

    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFormData({
                fullName: data.user.fullName || '',
                address: data.user.address || '',
                phone: data.user.phone || '',
                email: data.user.email || '',
                profileImage: data.user.profileImage || '',
            });

            if (data.user.profileImage) {
                setPreview(`http://localhost:3000${data.user.profileImage}`);
            }
        } catch (err) {
            toast.error('Failed to load profile');
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();
        updatedData.append('fullName', formData.fullName);
        updatedData.append('address', formData.address);
        updatedData.append('phone', formData.phone);

        // File uploads
        if (imageFile) {
            updatedData.append('profileImage', imageFile);
        }

        try {
            await axios.put('http://localhost:3000/api/profile', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Profile updated successfully', {
                position: 'top-right',
                autoClose: 3000,
            });
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            toast.error('Profile update failed');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Edit Profile</h1>
                        </div>

                        {/* Form */}
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Profile Image Section */}
                                <div className="text-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <img
                                            src={preview || '/default.png'}
                                            alt="Profile Preview"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                                        />
                                        <label className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium">
                                            Upload New Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Enter your address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed text-gray-500"
                                                placeholder="Email cannot be changed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/profile')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold border border-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

export default EditProfile;
