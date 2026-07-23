import { apiClient } from './client';

export interface CV {
  id: number;
  candidateId: string;
  positionId: number;
  positionTitle: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface AssembledCV {
  cvId: number;
  positionTitle: string;
  positionShortDescription: string;
  positionId: number;
  attributes: {
    attributeId: number;
    name: string;
    type: string;
    value: any | null;
  }[];
  projects: any[];
  published: boolean;
}

export interface PositionApplication {
  cvId: number;
  candidateId: string;
  createdAt: string;
  candidateName: string;
  candidateEmail: string;
}

export const fetchMyCVs = () =>
  apiClient.get<CV[]>('/api/cvs/my').then(r => r.data);

export const fetchCVsForPosition = (positionId: number) =>
  apiClient.get<CV[]>(`/api/cvs/position/${positionId}`).then(r => r.data);

export const fetchAssembledCV = (cvId: number) =>
  apiClient.get<AssembledCV>(`/api/cvs/${cvId}`).then(r => r.data);

export const createCV = (positionId: number) =>
  apiClient.post<CV>('/api/cvs', { positionId }).then(r => r.data);

export const deleteCV = (cvId: number) =>
  apiClient.delete(`/api/cvs/${cvId}`).then(r => r.data);

export const fetchPositionApplications = (positionId: number) =>
  apiClient.get<PositionApplication[]>(`/api/cvs/position/${positionId}`).then(r => r.data);

export const publishCV = (cvId: number) =>
  apiClient.patch(`/api/cvs/${cvId}/publish`).then(r => r.data);
