import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profilePicture) {
            data.append('profilePicture', profilePicture);
        }

        try {
            await api.post('/api/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Registration successful! Please check your email and log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. The email may already be in use.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-gray-800 p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Create an Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
                    <input type="text" name="name" onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                    <input type="email" name="email" onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-400">Phone</label>
                    <input type="tel" name="phone" onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                    <input type="password" name="password" onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-400">Profile Picture</label>
                    <input type="file" name="profilePicture" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors">Register</button>
            </form>
             <p className="text-center text-gray-400 mt-6">
                Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
            </p>
        </div>
    );
};
export default RegisterPage;