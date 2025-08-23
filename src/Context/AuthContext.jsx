import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded.user);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                logout(); // Invalid token
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        setUser(decoded.user);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const value = { user, token, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};