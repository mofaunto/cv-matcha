import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/users/me');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: string) => apiClient.patch('/api/users/me/role', { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};