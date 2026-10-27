import apiClient from './axiosClient.js';

// Fake Store API demo authentication endpoint.
export async function authenticate(username, password) {
  const response = await apiClient.post('/auth/login', { username, password }, { skipAuth: true });
  if (!response.data?.token) {
    throw new Error('The authentication API did not return a token. Please try again.');
  }
  return response.data;
}
