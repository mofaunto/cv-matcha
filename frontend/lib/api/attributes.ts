import { apiClient } from './client';

export type AttributeType =
  'string' | 'text' | 'image' | 'numeric' | 'date' | 'boolean' | 'one_of_many';

export interface Attribute {
  id: number;
  categoryId: number;
  name: string;
  type: AttributeType;
  options: any;
  isBuiltIn: boolean;
  maxLength: number | null;
  regex: string | null;
  min: number | null;
  max: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export const fetchAttributes = (params: { categoryId?: number; search?: string }) =>
  apiClient.get<Attribute[]>('/api/attributes', { params }).then(res => res.data);

export const fetchRecentAttributes = () =>
  apiClient.get<Attribute[]>('/api/attributes/recent').then(res => res.data);

export const createAttribute = (data: { categoryId: number; name: string; type: string; options?: any }) =>
  apiClient.post<Attribute>('/api/attributes', data).then(res => res.data);

export const updateAttribute = (id: number, data: { name?: string; type?: string; options?: any }) =>
  apiClient.patch<Attribute>(`/api/attributes/${id}`, data).then(res => res.data);

export const deleteAttribute = (id: number) =>
  apiClient.delete(`/api/attributes/${id}`).then(res => res.data);

export const fetchCategories = () =>
  apiClient.get<Category[]>('/api/categories').then(res => res.data);