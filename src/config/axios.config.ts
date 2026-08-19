import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../constants';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('festeva_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    console.error('❌ Axios API Error:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  },
);
