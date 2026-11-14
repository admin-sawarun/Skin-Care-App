import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 on the login request itself just means a wrong email or password:
    // let the login form show it. Any other 401 means the saved session
    // expired, so sign out and go to the login page.
    const isLoginRequest = error.config?.url?.includes('/auth/admin/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Something went wrong';
}
