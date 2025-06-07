// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://gympro-api.onrender.com/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor to add the authentication token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor to handle common errors, like session expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('Authentication error (401). Token may be invalid. Logging out.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;