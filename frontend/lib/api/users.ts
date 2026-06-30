import { apiClient } from './client';

export async function getMe() {
  try {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info', error);
    return null;
  }
}