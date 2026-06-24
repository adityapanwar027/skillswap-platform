import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.put('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProfile: () => api.delete('/users/profile'),
  toggleFavorite: (id) => api.post(`/users/${id}/favorite`),
  getDashboard: () => api.get('/users/dashboard'),
  getPublicStats: () => api.get('/users/stats/public'),
};

export const skillAPI = {
  getSkills: (params) => api.get('/skills', { params }),
  getSkill: (id) => api.get(`/skills/${id}`),
  getCategories: () => api.get('/skills/meta/categories'),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export const swapAPI = {
  getRequests: (params) => api.get('/swaps', { params }),
  createRequest: (data) => api.post('/swaps', data),
  respond: (id, status) => api.put(`/swaps/${id}/respond`, { status }),
  cancel: (id) => api.put(`/swaps/${id}/cancel`),
  complete: (id) => api.put(`/swaps/${id}/complete`),
};

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId, params) => api.get(`/messages/${userId}`, { params }),
  sendMessage: (data) => api.post('/messages', data),
};

export const reviewAPI = {
  getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
  getMyReviews: () => api.get('/reviews/me'),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  moderateReview: (id, data) => api.put(`/admin/reviews/${id}`, data),
  getActivity: (params) => api.get('/admin/activity', { params }),
  broadcast: (data) => api.post('/admin/notifications/broadcast', data),
};
