import axios from 'axios';

// Replace this with your backend base URL, e.g. Render deployment URL or localhost during dev
const BASE_URL = 'https://finewise1-backend.onrender.com/api/v1';


const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add JWT token from localStorage to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example export for auth-related API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Example export for expenses-related API calls
export const expensesAPI = {
  getExpenses: () => api.get('/expenses'),
  createExpense: (expense) => api.post('/expenses', expense),
  updateExpense: (id, expense) => api.put(`/expenses/${id}`, expense),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export default api;
