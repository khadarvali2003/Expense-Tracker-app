import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../config/constants';

// Create axios instance
const api = axios.create({
  baseURL: Constants.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Token expired
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ============================================
// EXPENSE API
// ============================================

export const expenseAPI = {
  create: (data) => api.post('/expenses', data),
  getAll: (params = {}) => api.get('/expenses', { params }),
  getOne: (id) => api.get(`/expenses/${id}`),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardAPI = {
  getSummary: (params = {}) => api.get('/dashboard/summary', { params }),
  getCategoryBreakdown: (params = {}) =>
    api.get('/dashboard/category-breakdown', { params }),
  getDailyTrend: (params = {}) =>
    api.get('/dashboard/daily-trend', { params }),
};

export default api;
