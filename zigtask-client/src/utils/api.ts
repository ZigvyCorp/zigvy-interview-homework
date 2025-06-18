import axios from 'axios';
import type { SignupData, SigninData, CreateTaskData, UpdateTaskData, FilterTaskData } from '../types';
import { TaskStatus } from '../types';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: SignupData) => api.post('/auth/signup', data),
  signin: (data: SigninData) => api.post('/auth/signin', data),
};

// Tasks API
export const tasksApi = {
  create: (data: CreateTaskData) => api.post('/tasks', data),
  update: (id: string, data: UpdateTaskData) => api.patch(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  getGrouped: () => api.get('/tasks/grouped'),
  updateStatus: (id: string, status: TaskStatus) => 
    api.patch(`/tasks/${id}/status`, { status }),
  search: (filters: FilterTaskData) => api.get('/tasks', { params: filters }),
};

// AI API
export const aiApi = {
  suggestTasks: (query: string) => api.post('/ai/suggest-tasks', { query }),
};

export default api;
