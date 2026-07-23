import { apiClient } from './client';

export interface DashboardData {
  latestPositions: {
    id: number;
    title: string;
    shortDescription: string;
    updatedAt: string;
  }[];
  popularPositions: {
    id: number;
    title: string;
    shortDescription: string;
    cvCount: number;
  }[];
  stats: {
    totalPositions: number;
    totalCandidates: number;
    totalRecruiters: number;
    totalCVs: number;
    cvsLast24h: number;
  };
  tagCloud: { tag: string; count: number }[];
}

export const fetchDashboard = () =>
  apiClient.get<DashboardData>('/api/dashboard').then(r => r.data);
