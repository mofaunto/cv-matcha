import { apiClient } from './client';

export interface Rule {
  attributeId: number;
  operator: string;
  value: string;
}

export interface Position {
  id: number;
  title: string;
  shortDescription: string;
  accessRules: Rule[];
  maxProjects: number;
  attributeIds: number[];
  projectTags: string[];
  createdAt: string;
  updatedAt: string;
  candidateCount: number;
}

export const fetchPositions = () =>
  apiClient.get<Position[]>('/api/positions').then(r => r.data);

export const fetchPosition = (id: number) =>
  apiClient.get<Position>(`/api/positions/${id}`).then(r => r.data);

export const createPosition = (data: {
  title: string;
  shortDescription: string;
  accessRules: Rule[];
  maxProjects: number;
  attributeIds: number[];
  projectTags: string[];
}) => apiClient.post<Position>('/api/positions', data).then(r => r.data);

export const updatePosition = (id: number, data: Partial<typeof createPosition>) =>
  apiClient.patch(`/api/positions/${id}`, data).then(r => r.data);

export const deletePosition = (id: number) =>
  apiClient.delete(`/api/positions/${id}`).then(r => r.data);

export const duplicatePosition = (id: number) =>
  apiClient.post<Position>(`/api/positions/${id}/duplicate`).then(r => r.data);