import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCar, FaChartBar, FaChartLine, FaDollarSign, FaUsers } from 'react-icons/fa';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        totalCustomers: 0,
        totalVehicles: 0,
        totalBookings: 0,
        pendingPayments: 0,
        monthlyRevenue: [],
        vehicleRentals: [],
        bookingStatus: [],
        paymentMethods: [],
        popularVehicles: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all required data in parallel
            const [
                vehicleBookingsRes,
                selfDriveBookingsRes,
                driverHireBookingsRes,
                vehiclesRes,
                usersRes
            ] = await Promise.all([
                axios.get('http://localhost:3000/api/services/admin/vehicle-bookings', { headers }).catch(() => ({ data: { bookings: [] } })),
                axios.get('http://localhost:3000/api/selfdrive/admin/all-bookings', { headers }).catch(() => ({ data: { bookings: [] } })),
                axios.get('http://localhost:3000/api/driver-hires/admin/all', { headers }).catch(() => ({ data: { bookings: [] } })),
                axios.get('http://localhost:3000/api/vehicles/all', { headers }).catch(() => ({ data: [] })),
                axios.get('http://localhost:3000/api/admin/users', { headers }).catch(() => ({ data: { users: [] } }))
            ]);

            // Process the data
            const allBookings = [
                ...(vehicleBookingsRes.data.bookings || []),
                ...(selfDriveBookingsRes.data.bookings || []),
                ...(driverHireBookingsRes.data.bookings || [])
            ];

            const vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : vehiclesRes.data.vehicles || [];
            const users = usersRes.data.users || [];

            // Calculate analytics
            const analytics = calculateAnalytics(allBookings, vehicles, users);
            setDashboardData(analytics);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateAnalytics = (bookings, vehicles, users) => {
        // Calculate total revenue and pending payments
        const totalRevenue = bookings.reduce((sum, booking) => {
            if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'completed') {
                return sum + (booking.totalPrice || 0);
            }
            return sum;
        }, 0);

        const pendingPayments = bookings.reduce((sum, booking) => {
            if (booking.paymentStatus === 'pending') {
                return sum + (booking.totalPrice || 0);
            }
            return sum;
        }, 0);

        // Monthly revenue data
        const monthlyRevenue = generateMonthlyRevenue(bookings);

        // Vehicle rental analytics
        const vehicleRentals = generateVehicleRentalData(bookings);

        // Booking status distribution
        const bookingStatus = generateBookingStatusData(bookings);

        // Payment methods distribution
        const paymentMethods = generatePaymentMethodData(bookings);

        // Popular vehicles
        const popularVehicles = generatePopularVehiclesData(bookings, vehicles);

        return {
            totalRevenue,
            totalCustomers: users.length,
            totalVehicles: vehicles.length,
            totalBookings: bookings.length,
            pendingPayments,
            monthlyRevenue,
            vehicleRentals,
            bookingStatus,
            paymentMethods,
            popularVehicles
        };
    };

    const generateMonthlyRevenue = (bookings) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyData = months.map(month => ({ month, revenue: 0, bookings: 0 }));

        bookings.forEach(booking => {
            if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'completed') {
                const bookingDate = new Date(booking.createdAt || booking.bookingDate);
                if (bookingDate.getFullYear() === currentYear) {
                    const monthIndex = bookingDate.getMonth();
                    monthlyData[monthIndex].revenue += booking.totalPrice || 0;
                    monthlyData[monthIndex].bookings += 1;
                }
            }
        });

        return monthlyData;
    };

    const generateVehicleRentalData = (bookings) => {
        const rentalTypes = {};

        bookings.forEach(booking => {
            const type = booking.rentalType || booking.category || 'Other';
            if (!rentalTypes[type]) {
                rentalTypes[type] = { name: type, count: 0, revenue: 0 };
            }
            rentalTypes[type].count += 1;
            if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'completed') {
                rentalTypes[type].revenue += booking.totalPrice || 0;
            }
        });

        return Object.values(rentalTypes);
    };

    const generateBookingStatusData = (bookings) => {
        const statusCounts = {};

        bookings.forEach(booking => {
            const status = booking.status || 'pending';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count
        }));
    };

    const generatePaymentMethodData = (bookings) => {
        const paymentCounts = {};

        bookings.forEach(booking => {
            const method = booking.paymentMethod || 'cash';
            paymentCounts[method] = (paymentCounts[method] || 0) + 1;
        });

        return Object.entries(paymentCounts).map(([method, count]) => ({
            name: method.charAt(0).toUpperCase() + method.slice(1),
            value: count
        }));
    };

    const generatePopularVehiclesData = (bookings, vehicles) => {
        const vehicleCounts = {};

        bookings.forEach(booking => {
            const vehicleName = booking.vehicleName || booking.vehicle?.name || 'Unknown';
            vehicleCounts[vehicleName] = (vehicleCounts[vehicleName] || 0) + 1;
        });

        return Object.entries(vehicleCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, bookings: count }));
    };

    const formatCurrency = (value) => {
        return `NRs. ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        }).format(value)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Overview of your vehicle rental business</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">
                                Failed to load dashboard data: {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</p>
                        </div>
                        <FaDollarSign className="text-3xl text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Customers</p>
                            <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
                        </div>
                        <FaUsers className="text-3xl text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Vehicles</p>
                            <p className="text-2xl font-bold">{dashboardData.totalVehicles}</p>
                        </div>
                        <FaCar className="text-3xl text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Bookings</p>
                            <p className="text-2xl font-bold">{dashboardData.totalBookings}</p>
                        </div>
                        <FaCalendarAlt className="text-3xl text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Side - Revenue Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Monthly Revenue & Payments</h2>
                        <FaChartLine className="text-blue-500 text-xl" />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pending Payments:</span>
                            <span className="font-semibold text-orange-600">{formatCurrency(dashboardData.pendingPayments)}</span>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dashboardData.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `Rs ${value / 1000}k`} />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === 'revenue' ? formatCurrency(value) : value,
                                    name === 'revenue' ? 'Revenue' : 'Bookings'
                                ]}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.3}
                                name="Revenue"
                            />
                            <Area
                                type="monotone"
                                dataKey="bookings"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.3}
                                name="Bookings"
                                yAxisId="right"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Right Side - Vehicle Analytics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Vehicle Rental Analytics</h2>
                        <FaChartBar className="text-green-500 text-xl" />
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.vehicleRentals}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === 'revenue' ? formatCurrency(value) : value,
                                    name === 'revenue' ? 'Revenue' : 'Bookings'
                                ]}
                            />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Bookings" />
                            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row - Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Status Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dashboardData.bookingStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {dashboardData.bookingStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dashboardData.paymentMethods}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {dashboardData.paymentMethods.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Popular Vehicles */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Vehicles</h3>
                    <div className="space-y-3">
                        {dashboardData.popularVehicles.map((vehicle, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 truncate">{vehicle.name}</span>
                                <div className="flex items-center">
                                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${(vehicle.bookings / Math.max(...dashboardData.popularVehicles.map(v => v.bookings))) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{vehicle.bookings}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
