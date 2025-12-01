import axios from 'axios';

// Use environment variable or default to production API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({ 
  baseURL: API_BASE_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
