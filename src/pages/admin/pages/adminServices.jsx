import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:3000/api/services';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        name: '',
        category: '',
        description: '',
        image: '',
        seats: '',
        luggage: '',
        doors: '',
        transmission: '',
        fuelType: '',
        airConditioning: false,
        price: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const fetchServices = async () => {
        try {
            const res = await axios.get(API_BASE_URL);
            setServices(res.data?.services || []);
        } catch (err) {
            toast.error('Failed to fetch vehicles');
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === 'image') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result });
            };
            reader.readAsDataURL(file);
        } else if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.description || !form.price) {
            return toast.error('Name, category, description, and price are required');
        }

        try {
            if (editingId) {
                await axios.put(`${API_BASE_URL}/${editingId}`, form, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('Vehicle updated');
            } else {
                await axios.post(API_BASE_URL, form, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('Vehicle created');
            }

            setForm({
                name: '',
                category: '',
                description: '',
                image: '',
                seats: '',
                luggage: '',
                doors: '',
                transmission: '',
                fuelType: '',
                airConditioning: false,
                price: '',
            });
            setEditingId(null);
            setShowForm(false);
            fetchServices();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error submitting form');
        }
    };

    const handleEdit = (service) => {
        setForm(service);
        setEditingId(service._id);
        setShowForm(true);
    };

    const confirmDelete = (id) => {
        setServiceToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteService = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/${serviceToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Vehicle deleted');
            fetchServices();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting vehicle');
        } finally {
            setShowDeleteModal(false);
            setServiceToDelete(null);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Vehicle Management</h2>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setForm({
                                name: '',
                                category: '',
                                description: '',
                                image: '',
                                seats: '',
                                luggage: '',
                                doors: '',
                                transmission: '',
                                fuelType: '',
                                airConditioning: false,
                                price: '',
                            });
                            setEditingId(null);
                        }}
                        className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FaPlus /> Add Vehicle
                    </button>
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-2xl rounded shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingId ? 'Edit' : 'Add'} Vehicle
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                    }}
                                    className="text-xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Vehicle Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Vehicle Name"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Seats</label>
                                    <input
                                        type="number"
                                        name="seats"
                                        value={form.seats}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Seats"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Luggage</label>
                                    <input
                                        type="text"
                                        name="luggage"
                                        value={form.luggage}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Luggage"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Doors</label>
                                    <input
                                        type="number"
                                        name="doors"
                                        value={form.doors}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Doors"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Transmission</label>
                                    <input
                                        type="text"
                                        name="transmission"
                                        value={form.transmission}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Transmission"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Fuel Type</label>
                                    <input
                                        type="text"
                                        name="fuelType"
                                        value={form.fuelType}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Fuel Type"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="airConditioning"
                                            checked={form.airConditioning}
                                            onChange={handleChange}
                                        />
                                        Air Conditioning
                                    </label>
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Price"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Category"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block mb-1 text-sm">Vehicle Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                    {form.image && (
                                        <img
                                            src={form.image}
                                            alt="preview"
                                            className="w-24 h-24 mt-2 object-cover rounded"
                                        />
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-sm">Vehicle Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border p-2 rounded"
                                        placeholder="Vehicle Description"
                                    />
                                </div>

                                <div className="col-span-2 flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingId(null);
                                            setForm({
                                                name: '',
                                                category: '',
                                                description: '',
                                                image: '',
                                                seats: '',
                                                luggage: '',
                                                doors: '',
                                                transmission: '',
                                                fuelType: '',
                                                airConditioning: false,
                                                price: '',
                                            });
                                        }}
                                        className="bg-gray-300 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-black text-white px-4 py-2 rounded"
                                    >
                                        {editingId ? 'Update' : 'Add'} Vehicle
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg text-center w-96">
                            <p className="text-lg font-semibold mb-6">
                                Do you really want to delete this vehicle?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={deleteService}
                                    className="px-6 py-2 bg-green-100 text-green-700 border border-green-500 rounded hover:bg-green-200"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setServiceToDelete(null);
                                    }}
                                    className="bg-red-100 text-red-600 px-4 py-2 rounded border border-red-400"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Services Table */}
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-200 text-left">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Seats</th>
                                <th className="p-3">Doors</th>
                                <th className="p-3">Transmission</th>
                                <th className="p-3">Fuel Type</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">AC</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(services) &&
                                services.map((service) => (
                                    <tr
                                        key={service._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3">
                                            {service.image ? (
                                                <img
                                                    src={service.image}
                                                    alt="service"
                                                    className="w-12 h-12 object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                                            )}
                                        </td>
                                        <td className="p-3">{service.name}</td>
                                        <td className="p-3">{service.category}</td>
                                        <td className="p-3">{service.seats || 'N/A'}</td>
                                        <td className="p-3">{service.doors || 'N/A'}</td>
                                        <td className="p-3">{service.transmission || 'N/A'}</td>
                                        <td className="p-3">{service.fuelType || 'N/A'}</td>
                                        <td className="p-3">${service.price || 'N/A'}</td>
                                        <td className="p-3">
                                            {service.airConditioning ? (
                                                <span className="text-green-600">Yes</span>
                                            ) : (
                                                <span className="text-red-600">No</span>
                                            )}
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="text-blue-600"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(service._id)}
                                                className="text-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="p-4 text-center text-gray-500">
                                        No vehicles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;
