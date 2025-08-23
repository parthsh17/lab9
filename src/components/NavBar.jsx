import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white">💸 FinTrack</Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <NavLink to="/" className={({ isActive }) => isActive ? "text-white font-semibold" : "text-gray-400 hover:text-white"}>Dashboard</NavLink>
                            <NavLink to="/history" className={({ isActive }) => isActive ? "text-white font-semibold" : "text-gray-400 hover:text-white"}>History</NavLink>
                            <NavLink to="/users" className={({ isActive }) => isActive ? "text-white font-semibold" : "text-gray-400 hover:text-white"}>Users</NavLink>
                            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="text-gray-300 hover:text-white">Login</NavLink>
                            <NavLink to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Register</NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;