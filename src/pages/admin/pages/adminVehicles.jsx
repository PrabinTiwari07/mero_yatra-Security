import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialForm = {
        name: '',
        seats: '',
        luggage: '',
        doors: '',
        transmission: '',
        fuel: '',
        airConditioning: false,
        price: '',
        description: '',
        image: null,
    };
    const [formData, setFormData] = useState(initialForm);

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/vehicles/all');
            setVehicles(Array.isArray(res.data) ? res.data : []);
        } catch {
            toast.error('Failed to fetch vehicles');
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, image: files[0] });
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const openAddModal = () => {
        setEditMode(false);
        setFormData(initialForm);
        setShowModal(true);
    };

    const openEditModal = (vehicle) => {
        setEditMode(true);
        setEditId(vehicle._id);
        setFormData({
            name: vehicle.name,
            seats: vehicle.seats,
            luggage: vehicle.luggage,
            doors: vehicle.doors,
            transmission: vehicle.transmission,
            fuel: vehicle.fuel,
            airConditioning: vehicle.airConditioning,
            price: vehicle.price,
            description: vehicle.description || '',  // Add this line

            image: null,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) data.append(key, value);
        });

        try {
            if (editMode) {
                await axios.put(`http://localhost:3000/api/vehicles/${editId}`, data);
                toast.success('Vehicle updated');
            } else {
                await axios.post('http://localhost:3000/api/vehicles/add', data);
                toast.success('Vehicle added');
            }
            setShowModal(false);
            fetchVehicles();
            setFormData(initialForm);
        } catch {
            toast.error(editMode ? 'Update failed' : 'Add failed');
        }
    };

    const deleteVehicle = async (id) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await axios.delete(`http://localhost:3000/api/vehicles/${id}`);
                toast.success('Vehicle deleted');
                fetchVehicles();
            } catch {
                toast.error('Delete failed');
            }
        }
    };

    const toggleBooking = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/api/vehicles/${id}/book`);
            toast.success('Status updated');
            fetchVehicles();
        } catch {
            toast.error('Failed to update');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Vehicle Management</h2>
                <button
                    className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800"
                    onClick={openAddModal}
                >
                    <FaPlus /> Add Vehicle
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-800 font-semibold">
                        <tr>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Seats</th>
                            <th className="py-3 px-4">Luggage</th>
                            <th className="py-3 px-4">Doors</th>
                            <th className="py-3 px-4">Transmission</th>
                            <th className="py-3 px-4">Fuel</th>
                            <th className="py-3 px-4">AC</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((v) => (
                            <tr key={v._id} className="border-t hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <img
                                        src={`http://localhost:3000/uploads/${v.image}`}
                                        alt={v.name}
                                        className="w-14 h-14 rounded object-cover"
                                    />
                                </td>
                                <td className="py-3 px-4">{v.name}</td>
                                <td className="py-3 px-4">{v.seats}</td>
                                <td className="py-3 px-4">{v.luggage}</td>
                                <td className="py-3 px-4">{v.doors}</td>
                                <td className="py-3 px-4">{v.transmission}</td>
                                <td className="py-3 px-4">{v.fuel}</td>
                                <td className="py-3 px-4">{v.airConditioning ? 'Yes' : 'No'}</td>
                                <td className="py-3 px-4">Rs. {v.price}</td>
                                <td className="py-3 px-4">
                                    <span
                                        onClick={() => toggleBooking(v._id)}
                                        className={`cursor-pointer text-sm font-semibold px-2 py-1 rounded ${v.isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
                                    >
                                        {v.isBooked ? 'Booked' : 'Available'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(v)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => deleteVehicle(v._id)} className="text-red-600 hover:text-red-800" title="Delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {vehicles.length === 0 && (
                            <tr>
                                <td colSpan="11" className="text-center text-gray-500 py-6">No vehicles found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
                        <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <input name="name" placeholder="Vehicle Name" className="border p-2" value={formData.name} onChange={handleInputChange} required />
                            <input name="seats" placeholder="Seats" type="number" className="border p-2" value={formData.seats} onChange={handleInputChange} required />
                            <input name="luggage" placeholder="Luggage" type="number" className="border p-2" value={formData.luggage} onChange={handleInputChange} required />
                            <input name="doors" placeholder="Doors" type="number" className="border p-2" value={formData.doors} onChange={handleInputChange} required />
                            <input name="transmission" placeholder="Transmission" className="border p-2" value={formData.transmission} onChange={handleInputChange} required />
                            <input name="fuel" placeholder="Fuel Type" className="border p-2" value={formData.fuel} onChange={handleInputChange} required />
                            <label className="flex items-center gap-2 col-span-2">
                                <input type="checkbox" name="airConditioning" checked={formData.airConditioning} onChange={handleInputChange} />
                                Air Conditioning
                            </label>
                            <input name="price" placeholder="Price" type="number" className="border p-2" value={formData.price} onChange={handleInputChange} required />
                            <input name="image" type="file" accept="image/*" className="border p-2 col-span-2" onChange={handleInputChange} />
                            <textarea
                                name="description"
                                placeholder="Vehicle Description"
                                className="border p-2 col-span-2"
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                            />

                            <div className="col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                                    {editMode ? 'Update Vehicle' : 'Add Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AdminVehicles;
