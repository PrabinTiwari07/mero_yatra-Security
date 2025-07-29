import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    FaCalendar,
    FaCheck,
    FaClock,
    FaEnvelope,
    FaEye,
    FaFilter,
    FaIdCard,
    FaMapMarkerAlt,
    FaPhone,
    FaSearch,
    FaTimes,
    FaUser
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProfileDetails = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAllProfiles();
    }, []);

    const fetchAllProfiles = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/profile/all', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setProfiles(data.profiles);
                console.log(`Loaded ${data.count} profiles`);
            } else {
                throw new Error(data.message || 'Failed to fetch profiles');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch profiles');
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateLicenseStatus = async (userId, status) => {
        try {
            const { data } = await axios.put(
                `http://localhost:3000/api/profile/license-status/${userId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchAllProfiles(); // Refresh the data
                console.log(`License status updated: ${status} for user ${userId}`);
            } else {
                throw new Error(data.message || 'Failed to update license status');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update license status';
            toast.error(errorMessage);
            console.error('Error updating license status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-300';
            default:
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
                return <FaCheck className="text-green-600" />;
            case 'rejected':
                return <FaTimes className="text-red-600" />;
            default:
                return <FaClock className="text-yellow-600" />;
        }
    };

    // Filter profiles based on search and status
    const filteredProfiles = profiles.filter(profile => {
        const matchesSearch = profile.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.license?.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || profile.license?.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openProfileModal = (profile) => {
        setSelectedProfile(profile);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
                    <p className="text-gray-600">Manage user profiles and license verification</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <FaUser className="text-blue-600 text-2xl mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold">{profiles.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <FaCheck className="text-green-600 text-2xl mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Verified Licenses</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {profiles.filter(p => p.license?.status === 'verified').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <FaClock className="text-yellow-600 text-2xl mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Pending Licenses</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {profiles.filter(p => p.license?.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <FaTimes className="text-red-600 text-2xl mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Rejected Licenses</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {profiles.filter(p => p.license?.status === 'rejected').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or license number..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-400" />
                            <select
                                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Profiles Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        License Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        License Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProfiles.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No profiles found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProfiles.map((profile) => (
                                        <tr key={profile._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={
                                                            profile.profileImage
                                                                ? `http://localhost:3000${profile.profileImage}`
                                                                : '/default.png'
                                                        }
                                                        alt="Profile"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {profile.user?.fullName || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {profile.user?.role || 'user'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center mb-1">
                                                        <FaEnvelope className="text-gray-400 mr-2" />
                                                        {profile.user?.email || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaPhone className="text-gray-400 mr-2" />
                                                        {profile.user?.phone || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(profile.license?.status)}
                                                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(profile.license?.status)}`}>
                                                        {profile.license?.status?.charAt(0).toUpperCase() + profile.license?.status?.slice(1) || 'Pending'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {profile.license?.licenseNumber || 'Not provided'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openProfileModal(profile)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center"
                                                    >
                                                        <FaEye className="mr-1" />
                                                        View
                                                    </button>
                                                    {profile.license?.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateLicenseStatus(profile.user._id, 'verified')}
                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center"
                                                            >
                                                                <FaCheck className="mr-1" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateLicenseStatus(profile.user._id, 'rejected')}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center"
                                                            >
                                                                <FaTimes className="mr-1" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {profile.license?.status === 'verified' && (
                                                        <button
                                                            onClick={() => updateLicenseStatus(profile.user._id, 'rejected')}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center"
                                                        >
                                                            <FaTimes className="mr-1" />
                                                            Reject
                                                        </button>
                                                    )}
                                                    {profile.license?.status === 'rejected' && (
                                                        <button
                                                            onClick={() => updateLicenseStatus(profile.user._id, 'verified')}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center"
                                                        >
                                                            <FaCheck className="mr-1" />
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Profile Detail Modal */}
            {showModal && selectedProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

                                    <div className="flex items-center justify-center mb-4">
                                        <img
                                            src={
                                                selectedProfile.profileImage
                                                    ? `http://localhost:3000${selectedProfile.profileImage}`
                                                    : '/default.png'
                                            }
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <FaUser className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Full Name</p>
                                                <p className="font-medium">{selectedProfile.user?.fullName || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaEnvelope className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{selectedProfile.user?.email || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaPhone className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{selectedProfile.user?.phone || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="font-medium">{selectedProfile.user?.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* License Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">License Information</h3>

                                    {selectedProfile.license?.licenseImage && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">License Image</p>
                                            <img
                                                src={`http://localhost:3000${selectedProfile.license.licenseImage}`}
                                                alt="License"
                                                className="w-full max-w-sm h-40 object-cover border rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <FaIdCard className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">License Number</p>
                                                <p className="font-medium">{selectedProfile.license?.licenseNumber || 'Not provided'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaUser className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Name on License</p>
                                                <p className="font-medium">{selectedProfile.license?.fullName || 'Not provided'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <FaCalendar className="text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Expiry Date</p>
                                                <p className="font-medium">
                                                    {selectedProfile.license?.expiryDate
                                                        ? new Date(selectedProfile.license.expiryDate).toLocaleDateString()
                                                        : 'Not provided'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {getStatusIcon(selectedProfile.license?.status)}
                                            <div className="ml-3">
                                                <p className="text-sm text-gray-500">Status</p>
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedProfile.license?.status)}`}>
                                                    {selectedProfile.license?.status?.charAt(0).toUpperCase() + selectedProfile.license?.status?.slice(1) || 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedProfile.license?.uploadedAt && (
                                            <div className="flex items-center">
                                                <FaCalendar className="text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Uploaded On</p>
                                                    <p className="font-medium">
                                                        {new Date(selectedProfile.license.uploadedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedProfile.license?.verifiedAt && (
                                            <div className="flex items-center">
                                                <FaCalendar className="text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Verified On</p>
                                                    <p className="font-medium">
                                                        {new Date(selectedProfile.license.verifiedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t space-y-2">
                                        {selectedProfile.license?.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        updateLicenseStatus(selectedProfile.user._id, 'verified');
                                                        setShowModal(false);
                                                    }}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center"
                                                >
                                                    <FaCheck className="mr-2" />
                                                    Approve License
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        updateLicenseStatus(selectedProfile.user._id, 'rejected');
                                                        setShowModal(false);
                                                    }}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center"
                                                >
                                                    <FaTimes className="mr-2" />
                                                    Reject License
                                                </button>
                                            </div>
                                        )}

                                        {selectedProfile.license?.status === 'verified' && (
                                            <button
                                                onClick={() => {
                                                    updateLicenseStatus(selectedProfile.user._id, 'rejected');
                                                    setShowModal(false);
                                                }}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center"
                                            >
                                                <FaTimes className="mr-2" />
                                                Reject License
                                            </button>
                                        )}

                                        {selectedProfile.license?.status === 'rejected' && (
                                            <button
                                                onClick={() => {
                                                    updateLicenseStatus(selectedProfile.user._id, 'verified');
                                                    setShowModal(false);
                                                }}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center"
                                            >
                                                <FaCheck className="mr-2" />
                                                Approve License
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfileDetails;
