import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Token management
const TOKEN_KEY = 'spotfix_token';
const USER_KEY = 'spotfix_user';
const TOKEN_EXPIRY_KEY = 'spotfix_token_expiry';

const setToken = (token, expiresIn = 7 * 24 * 60 * 60 * 1000) => { // Default 7 days
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, Date.now() + expiresIn);
};

const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
  
  return token;
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await auth.refreshToken();
        const { token, expiresIn } = response.data;
        
        // Store the new token with expiry
        setToken(token, expiresIn);
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear everything and redirect to login
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user, expiresIn } = response.data;
    setToken(token, expiresIn);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return response;
  },
  register: (userData) => api.post('/api/auth/register', userData),
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
  },
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    return response;
  },
  updateProfile: (profileData) => api.put('/api/auth/profile', profileData),
  changePassword: (data) => api.post('/api/auth/change-password', data),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
  refreshToken: () => api.post('/api/auth/refresh-token'),
  isAuthenticated: () => {
    const token = getToken();
    const user = localStorage.getItem(USER_KEY);
    return !!token && !!user;
  },
  getStoredUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
};

// Issues endpoints
export const issues = {
  getAll: (page = 1, limit = 10) => api.get('/api/issues', { params: { page, limit } }),
  getById: (id) => api.get(`/api/issues/${id}`),
  create: (data) => api.post('/api/issues', data),
  update: (id, data) => api.put(`/api/issues/${id}`, data),
  delete: (id) => api.delete(`/api/issues/${id}`),
  search: (query) => api.get('/api/issues/search', { params: { query } }),
  uploadImage: (formData) => api.post('/api/issues/upload', formData),
  getByUser: (userId, page = 1, limit = 10) => api.get(`/api/issues/user/${userId}`, { params: { page, limit } }),
  getByLocation: (lat, lng, radius) => api.get('/api/issues/nearby', { params: { lat, lng, radius } }),
  addComment: (issueId, comment) => api.post(`/api/issues/${issueId}/comments`, { comment }),
  getComments: (issueId) => api.get(`/api/issues/${issueId}/comments`),
  vote: (issueId, type) => api.post(`/api/issues/${issueId}/vote`, { type }),
};

export default api; 