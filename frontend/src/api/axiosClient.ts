import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 10000
});

axiosClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token') ??
    sessionStorage.getItem('access_token') ??
    undefined;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
