import { apiClient } from './client';

export interface Project {
  id: number;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const fetchProjects = () =>
  apiClient.get<Project[]>('/api/projects').then(r => r.data);

export const createProject = (data: {
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  tags: string[];
}) => apiClient.post<Project>('/api/projects', data).then(r => r.data);

export const updateProject = (id: number, data: any) =>
  apiClient.patch(`/api/projects/${id}`, data).then(r => r.data);

export const deleteProject = (id: number) =>
  apiClient.delete(`/api/projects/${id}`).then(r => r.data);

export const fetchTagSuggestions = (search: string) =>
  apiClient.get<string[]>('/api/projects/tags', { params: { search } }).then(r => r.data);
