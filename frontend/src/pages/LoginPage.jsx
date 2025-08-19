import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/auth/login', formData);
            login(data.token);
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-gray-800 p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Login to FinTrack</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                    <input type="email" name="email" onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                    <input type="password" name="password" onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors">Login</button>
            </form>
            <p className="text-center text-gray-400 mt-6">
                Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;