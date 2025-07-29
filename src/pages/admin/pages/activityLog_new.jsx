// admin/pages/activityLog.jsx
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaChartBar, FaDownload, FaFilter, FaList, FaTrash } from 'react-icons/fa';

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('list'); // 'list' or 'stats'
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        userId: '',
        action: '',
        severity: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [actionTypes, setActionTypes] = useState([]);
    const [statsPeriod, setStatsPeriod] = useState('7d');

    const API_URL = 'http://localhost:3000/api/activities';

    // Fetch activities
    const fetchActivities = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();

            // Add all filters to query params
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await axios.get(`${API_URL}?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            setActivities(response.data.activities);
            setPagination({
                currentPage: Number(response.data.currentPage),
                totalPages: Number(response.data.totalPages),
                total: Number(response.data.total)
            });

            // Extract unique action types for filter dropdown
            if (response.data.activities.length > 0) {
                const actions = [...new Set(response.data.activities.map(a => a.action))];
                setActionTypes(actions);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(err.response?.data?.message || 'Failed to fetch activities');
            setLoading(false);
        }
    };

    // Get activity statistics
    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/stats?period=${statsPeriod}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError(err.response?.data?.message || 'Failed to fetch statistics');
            setLoading(false);
        }
    };

    // Export activities to CSV
    const exportToCsv = async () => {
        try {
            const token = localStorage.getItem('token');
            // Prepare query params for export
            const queryParams = new URLSearchParams();

            // Add filters to export query
            if (filters.userId) queryParams.append('userId', filters.userId);
            if (filters.action) queryParams.append('action', filters.action);
            if (filters.severity) queryParams.append('severity', filters.severity);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            // Create a link to download the CSV
            const link = document.createElement('a');
            link.href = `${API_URL}/export?${queryParams.toString()}`;
            link.setAttribute('download', `activities-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);

            // Set auth header for the download
            const xhr = new XMLHttpRequest();
            xhr.open('GET', link.href);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                const blob = new Blob([xhr.response], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            };
            xhr.send();
        } catch (err) {
            console.error('Error exporting to CSV:', err);
            setError('Failed to export activities');
        }
    };

    // Cleanup old activities
    const cleanupActivities = async () => {
        try {
            if (window.confirm('Are you sure you want to delete old activity logs? This action cannot be undone.')) {
                const days = prompt('Delete activities older than how many days?', '90');

                if (days && !isNaN(days) && Number(days) > 0) {
                    setLoading(true);
                    const token = localStorage.getItem('token');

                    const response = await axios.delete(`${API_URL}/cleanup`, {
                        data: { days: Number(days) },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true
                    });

                    alert(`Deleted ${response.data.deletedCount} old activities`);
                    fetchActivities(); // Refresh the list
                }
            }
        } catch (err) {
            console.error('Error cleaning up activities:', err);
            setError(err.response?.data?.message || 'Failed to cleanup activities');
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 })); // Reset to first page on filter change
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    // Apply filters
    const applyFilters = (e) => {
        e.preventDefault();
        fetchActivities();
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 20,
            userId: '',
            action: '',
            severity: '',
            startDate: '',
            endDate: '',
            search: ''
        });
    };

    // Handle view toggle
    const toggleView = (newView) => {
        setView(newView);
        if (newView === 'stats' && !stats) {
            fetchStats();
        }
    };

    // Effect to fetch activities on component mount and filter changes
    useEffect(() => {
        if (view === 'list') {
            fetchActivities();
        } else if (view === 'stats') {
            fetchStats();
        }
    }, [filters.page, view, statsPeriod]);

    // Get severity class for styling
    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'LOW': return 'bg-blue-100 text-blue-800';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
            case 'HIGH': return 'bg-orange-100 text-orange-800';
            case 'CRITICAL': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Activity Logs</h2>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => toggleView('list')}
                        className={`p-2 rounded-md ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        title="List View"
                    >
                        <FaList />
                    </button>
                    <button
                        onClick={() => toggleView('stats')}
                        className={`p-2 rounded-md ${view === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        title="Statistics View"
                    >
                        <FaChartBar />
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                        title="Filter"
                    >
                        <FaFilter />
                    </button>
                    <button
                        onClick={exportToCsv}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                        title="Export to CSV"
                    >
                        <FaDownload />
                    </button>
                    <button
                        onClick={cleanupActivities}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        title="Cleanup Old Logs"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Filters</h3>
                    <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search username or description"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Action Type</label>
                            <select
                                name="action"
                                value={filters.action}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">All Actions</option>
                                {actionTypes.map(action => (
                                    <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Severity</label>
                            <select
                                name="severity"
                                value={filters.severity}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">All Severities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Results Per Page</label>
                            <select
                                name="limit"
                                value={filters.limit}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Statistics View */}
            {view === 'stats' && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Activity Statistics</h3>
                        <div>
                            <select
                                value={statsPeriod}
                                onChange={(e) => setStatsPeriod(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md"
                            >
                                <option value="1d">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Summary Cards */}
                            <div className="bg-blue-50 p-4 rounded-lg shadow">
                                <h4 className="text-lg font-medium mb-3">Summary</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">Total Activities</div>
                                        <div className="text-2xl font-bold">{stats.totalActivities}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">Unique Users</div>
                                        <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Severity Distribution */}
                            <div className="bg-yellow-50 p-4 rounded-lg shadow">
                                <h4 className="text-lg font-medium mb-3">Severity Distribution</h4>
                                <div className="space-y-2">
                                    {stats.severityStats && stats.severityStats.map(item => (
                                        <div key={item._id} className="flex items-center">
                                            <div className={`px-2 py-1 rounded text-xs ${getSeverityClass(item._id)}`}>
                                                {item._id}
                                            </div>
                                            <div className="ml-2 flex-grow">
                                                <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item._id === 'LOW' ? 'bg-blue-500' :
                                                                item._id === 'MEDIUM' ? 'bg-yellow-500' :
                                                                    item._id === 'HIGH' ? 'bg-orange-500' :
                                                                        'bg-red-500'
                                                            }`}
                                                        style={{ width: `${(item.count / stats.totalActivities) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="ml-2 text-sm w-16 text-right">{item.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Types */}
                            <div className="bg-green-50 p-4 rounded-lg shadow md:col-span-2">
                                <h4 className="text-lg font-medium mb-3">Common Actions</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {stats.actionStats && stats.actionStats.slice(0, 8).map(item => (
                                        <div key={item._id} className="bg-white p-3 rounded shadow-sm">
                                            <div className="text-sm text-gray-500">{item._id.replace(/_/g, ' ')}</div>
                                            <div className="text-xl font-bold">{item.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Most Active Users */}
                            <div className="bg-purple-50 p-4 rounded-lg shadow">
                                <h4 className="text-lg font-medium mb-3">Most Active Users</h4>
                                <div className="space-y-2">
                                    {stats.userStats && stats.userStats.slice(0, 5).map((user, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                                            <span>{user.username}</span>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                                {user.count} activities
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Trend */}
                            <div className="bg-indigo-50 p-4 rounded-lg shadow">
                                <h4 className="text-lg font-medium mb-3">Daily Activity Trend</h4>
                                <div className="h-40 flex items-end space-x-1">
                                    {stats.dailyStats && stats.dailyStats.map((day, index) => {
                                        const maxCount = Math.max(...stats.dailyStats.map(d => d.count));
                                        const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                                        return (
                                            <div key={index} className="flex flex-col items-center flex-grow">
                                                <div
                                                    className="bg-indigo-500 w-full rounded-t"
                                                    style={{ height: `${height}%` }}
                                                    title={`${day._id.year}-${day._id.month}-${day._id.day}: ${day.count} activities`}
                                                ></div>
                                                <div className="text-xs mt-1">
                                                    {day._id.month}/{day._id.day}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">No statistics available</div>
                    )}
                </div>
            )}

            {/* Activities List View */}
            {view === 'list' && (
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : activities.length > 0 ? (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activities.map((activity) => (
                                        <tr key={activity._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDateTime(activity.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{activity.username}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{activity.action.replace(/_/g, ' ')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{activity.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {activity.ipAddress}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getSeverityClass(activity.severity)}`}>
                                                    {activity.severity}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <span>Showing {activities.length} of {pagination.total} activities</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className={`px-3 py-1 rounded ${pagination.currentPage === 1 ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className={`px-3 py-1 rounded ${pagination.currentPage === pagination.totalPages ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">No activities found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityLog;
