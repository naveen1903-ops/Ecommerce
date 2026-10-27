import axios from 'axios';

export const AUTH_TOKEN_KEY = 'shopease-auth-token';
export const AUTH_USER_KEY = 'shopease-auth-user';
export const ORDERS_KEY = 'shopease-order-history';
export const API_ORIGIN = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: API_ORIGIN,
  timeout: 12000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  maxContentLength: 2 * 1024 * 1024,
  maxBodyLength: 256 * 1024,
});

// Never attach a saved token to public endpoints. Only explicitly protected API
// calls receive the Bearer header, reducing accidental credential exposure.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (config.requiresAuth && !token) {
      return Promise.reject(new Error('Your session is missing. Please log in again.'));
    }
    if (config.requiresAuth && token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (error.config?.requiresAuth && (status === 401 || status === 403)) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem('shopease-demo-user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shopease:auth-expired', {
          detail: { message: 'Your login token is invalid or has expired. Please log in again.' },
        }));
      }
      error.message = 'Your login token is invalid or has expired. Please log in again.';
    } else if (!error.response) {
      error.message = 'Network error. Check your internet connection and try again.';
    } else if (status >= 500) {
      error.message = 'The API server is temporarily unavailable. Please try again.';
    } else if (!error.message || error.message === 'Network Error') {
      // Do not print raw server bodies; display a bounded plain-text message only.
      const serverMessage = error.response?.data?.message;
      error.message = typeof serverMessage === 'string' && serverMessage.length <= 200
        ? serverMessage
        : `Request failed (${status}).`;
    }
    return Promise.reject(error);
  },
);

export default apiClient;
