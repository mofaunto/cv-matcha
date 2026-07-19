import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAttributes,
  fetchRecentAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  fetchCategories,
} from '@/lib/api/attributes';

export const useAttributes = (filters: { categoryId?: number; search?: string }) =>
  useQuery({
    queryKey: ['attributes', filters],
    queryFn: () => fetchAttributes(filters),
  });

export const useRecentAttributes = () =>
  useQuery({
    queryKey: ['recentAttributes'],
    queryFn: fetchRecentAttributes,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // categories don't change
  });

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      queryClient.invalidateQueries({ queryKey: ['recentAttributes'] });
    },
  });
};

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAttribute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      queryClient.invalidateQueries({ queryKey: ['recentAttributes'] });
    },
  });
};
