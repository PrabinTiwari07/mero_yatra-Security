import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaUserAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Customer = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        email: "",
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users);
            setFilteredUsers(res.data.users);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchTerm) {
            const filtered = users.filter(
                (user) =>
                    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phone.includes(searchTerm) ||
                    user.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    // ESC key closes modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setEditingUser(null);
                setShowDeleteModal(false);
            }
        };
        if (editingUser || showDeleteModal) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [editingUser, showDeleteModal]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/admin/users/${userToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User deleted successfully");
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setEditFormData({
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
            email: user.email,
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:3000/api/admin/users/${editingUser}`,
                {
                    fullName: editFormData.fullName,
                    phone: editFormData.phone,
                    address: editFormData.address,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("User updated successfully");
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update user");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <ToastContainer position="top-right" autoClose={2000} />

            {/* Header with Title and Stats */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <FaUserAlt className="text-blue-600 text-xl mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
                </div>
                <div className="bg-blue-50 py-2 px-4 rounded-lg">
                    <span className="font-medium text-blue-700">{users.length}</span>
                    <span className="text-gray-600 ml-1">Total Customers</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search customers by name, email, phone or address..."
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <FaUserAlt className="mx-auto text-gray-300 text-4xl mb-3" />
                    <p className="text-gray-500 text-lg">No customers found</p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="mt-3 text-blue-600 hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600">
                                <th className="py-3 px-4 font-semibold border-b">Name</th>
                                <th className="py-3 px-4 font-semibold border-b">Email</th>
                                <th className="py-3 px-4 font-semibold border-b">Phone</th>
                                <th className="py-3 px-4 font-semibold border-b">Address</th>
                                <th className="py-3 px-4 font-semibold border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-50 transition duration-150">
                                    <td className="py-3 px-4 border-b">
                                        <div className="font-medium text-gray-800">{user.fullName}</div>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="text-gray-600">{user.email}</div>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="text-gray-600">{user.phone || "—"}</div>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="text-gray-600">{user.address || "—"}</div>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-full transition duration-150"
                                                title="Edit User"
                                            >
                                                <FiEdit className="text-lg" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setUserToDelete(user._id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full transition duration-150"
                                                title="Delete User"
                                            >
                                                <FaTrash className="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative animate-fade-in"
                        style={{
                            animation: "fadeIn 0.3s ease-out forwards",
                        }}
                    >
                        {/* Close (X) Button */}
                        <button
                            onClick={() => setEditingUser(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold p-1 rounded-full hover:bg-gray-100 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-semibold mb-6 text-center text-blue-700">
                            Edit Customer Information
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                                    value={editFormData.fullName}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, fullName: e.target.value })
                                    }
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                                    value={editFormData.phone}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, phone: e.target.value })
                                    }
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                                    value={editFormData.address}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, address: e.target.value })
                                    }
                                    placeholder="Enter address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Email (Read-Only)</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                                    value={editFormData.email}
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center"
                        style={{
                            animation: "fadeIn 0.3s ease-out forwards",
                        }}
                    >
                        <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5">
                            <FaTrash className="text-red-600 text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setUserToDelete(null);
                                }}
                                className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all flex-1 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Customer;
