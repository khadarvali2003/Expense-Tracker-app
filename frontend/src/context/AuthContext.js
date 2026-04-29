import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.register({ name, email, password });
      const { user: userData, token: authToken } = response.data.data;

      await AsyncStorage.setItem('token', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = response.data.data;

      await AsyncStorage.setItem('token', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateUser = async (data) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data.data.user;
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Update failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        isAuthenticated: !!token,
        register,
        login,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
