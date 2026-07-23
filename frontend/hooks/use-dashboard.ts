import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/lib/api/dashboard';

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60,
  });