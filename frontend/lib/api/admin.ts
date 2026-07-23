import { apiClient } from './client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

export const fetchUsers = () =>
  apiClient.get<AdminUser[]>('/api/users').then(r => r.data);

export const updateUserRole = (id: string, role: string) =>
  apiClient.patch(`/api/users/${id}/role`, { role });

export const toggleUserBlock = (id: string, isBlocked: boolean) =>
  apiClient.patch(`/api/users/${id}/block`, { isBlocked });

export const deleteUserAccount = (id: string) =>
  apiClient.patch(`/api/users/${id}/delete`);
