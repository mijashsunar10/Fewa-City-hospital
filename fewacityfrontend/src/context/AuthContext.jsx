import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set API base URL
  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('fewa_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login User
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const data = response.data;
      
      setUser(data);
      localStorage.setItem('fewa_admin_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  // Register User
  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role: role || 'admin' // Default to admin for convenient setup
      });
      const data = response.data;
      
      // If registerer is not logged in, log them in as this user
      if (!user) {
        setUser(data);
        localStorage.setItem('fewa_admin_user', JSON.stringify(data));
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  // Logout User
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fewa_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
