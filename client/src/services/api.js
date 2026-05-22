import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

export const agentAPI = {
  getAll: (params) => api.get('/agents', { params }),
  getOne: (id) => api.get(`/agents/${id}`),
};

export const tutorialAPI = {
  getAll: (params) => api.get('/tutorials', { params }),
  getOne: (id) => api.get(`/tutorials/${id}`),
  create: (formData) => api.post('/tutorials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/tutorials/${id}`, data),
  delete: (id) => api.delete(`/tutorials/${id}`),
  toggleLike: (id) => api.post(`/tutorials/${id}/like`),
  getComments: (id) => api.get(`/tutorials/${id}/comments`),
  addComment: (id, data) => api.post(`/tutorials/${id}/comments`, data),
  deleteComment: (tutorialId, commentId) => api.delete(`/tutorials/${tutorialId}/comments/${commentId}`),
};

export const adminAPI = {
  getTutorials: (params) => api.get('/admin/tutorials', { params }),
  reviewTutorial: (id, data) => api.put(`/admin/tutorials/${id}/review`, data),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
};

export default api;
