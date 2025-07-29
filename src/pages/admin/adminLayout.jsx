import { Route, Routes } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';

import ActivityLog from './pages/activityLog';
import AdminProfileDetails from './pages/adminProfileDetails';
import AdminServices from './pages/adminServices';
import AdminVehicles from './pages/adminVehicles';

import Customer from './pages/customer';
import Dashboard from './pages/dashboard';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="customers" element={<Customer />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="vehicles" element={<AdminVehicles />} />
                        <Route path="booking" element={<Customer />} />
                        <Route path="user-profile" element={<AdminProfileDetails />} />
                        <Route path="activity-log" element={<ActivityLog />} />

                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
