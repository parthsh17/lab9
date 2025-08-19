import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../Context/AuthContext';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const { user: currentUser, logout } = useAuth();

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action is irreversible.")) {
            try {
                await api.delete(`/api/users/${userId}`);
                // If the deleted user is the currently logged-in user, log them out
                if (currentUser.id === userId) {
                    logout();
                } else {
                    fetchUsers(); // Otherwise, just refresh the list
                }
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">All Registered Users</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-gray-700 rounded-lg p-5 flex flex-col items-center text-center">
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${user.profile_picture_path?.replace(/\\/g, '/')}`}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-600"
                            />
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            <p className="text-gray-400">{user.phone}</p>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersPage;