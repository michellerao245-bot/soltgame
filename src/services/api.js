import axios from 'axios';

// API Instance create karo
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.yourgameplatform.com',
  timeout: 10000, // 10 seconds ka timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Har request mein token add karne ke liye
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Global error handling ke liye
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Yahan tum custom error handling logic likh sakte ho
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;