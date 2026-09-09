import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../constants';
import { storage } from '../utils';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout for heavy requests (e.g. OCR)
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = storage.get<string>('festeva_token', 'local');
    if (token) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
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
