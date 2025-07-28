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
        // License fields
        licenseNumber: '',
        licenseFullName: '',
        licenseExpiryDate: '',
    });

    const [preview, setPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [licenseImageFile, setLicenseImageFile] = useState(null);
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
                // License fields
                licenseNumber: data.user.license?.licenseNumber || '',
                licenseFullName: data.user.license?.fullName || '',
                licenseExpiryDate: data.user.license?.expiryDate ?
                    new Date(data.user.license.expiryDate).toISOString().split('T')[0] : '',
            });

            setPreview(`http://localhost:3000${data.user.profileImage}`);
            if (data.user.license?.licenseImage) {
                setLicensePreview(`http://localhost:3000${data.user.license.licenseImage}`);
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

    const handleLicenseImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLicenseImageFile(file);
        setLicensePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();
        updatedData.append('fullName', formData.fullName);
        updatedData.append('address', formData.address);
        updatedData.append('phone', formData.phone);

        // License data
        updatedData.append('licenseNumber', formData.licenseNumber);
        updatedData.append('licenseFullName', formData.licenseFullName);
        updatedData.append('licenseExpiryDate', formData.licenseExpiryDate);

        // File uploads
        if (imageFile) {
            updatedData.append('profileImage', imageFile);
        }
        if (licenseImageFile) {
            updatedData.append('licenseImage', licenseImageFile);
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
            <div className="max-w-6xl mx-auto mt-10 bg-white border rounded-lg shadow p-8 font-sans">
                <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column - Personal Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

                        {/* Profile Image + Upload */}
                        <div className="flex flex-col items-center">
                            <img
                                src={preview || '/default.png'}
                                alt="Profile Preview"
                                className="w-32 h-32 rounded-full object-cover border mb-4"
                            />
                            <label className="cursor-pointer px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 text-sm text-center">
                                Upload New Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Personal Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full border rounded px-4 py-2 bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - License Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">License Information</h3>

                        {/* License Image Upload */}
                        <div className="flex flex-col items-center">
                            <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                                {licensePreview ? (
                                    <img
                                        src={licensePreview}
                                        alt="License Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <div className="text-2xl mb-2">📄</div>
                                        <p className="text-sm">License Image</p>
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer px-4 py-2 bg-black text-white rounded shadow hover:bg-blue-700 text-sm text-center">
                                Upload License
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLicenseImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* License Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your license number"
                                    className="w-full border rounded px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name (as on license)</label>
                                <input
                                    type="text"
                                    name="licenseFullName"
                                    value={formData.licenseFullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name as on license"
                                    className="w-full border rounded px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    name="licenseExpiryDate"
                                    value={formData.licenseExpiryDate}
                                    onChange={handleChange}
                                    className="w-full border rounded px-4 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons - Full Width at Bottom */}
                    <div className="lg:col-span-2 flex space-x-4 mt-6 pt-6 border-t">
                        <button
                            type="submit"
                            className="w-48 py-2 bg-black text-white rounded hover:bg-gray-800 font-semibold"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="w-48 border rounded hover:bg-gray-100 font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
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
