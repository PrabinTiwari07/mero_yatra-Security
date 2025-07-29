import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    return (
        <div className="flex justify-between items-center bg-white p-4 shadow-sm">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex gap-4 items-center">
                <FaSearch className="w-5 h-5 cursor-pointer" />
                <FaUserCircle className="w-6 h-6 cursor-pointer" />
            </div>
        </div>
    );
};

export default Navbar;
