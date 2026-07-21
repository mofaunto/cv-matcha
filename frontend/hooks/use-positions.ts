import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPositions,
  fetchPosition,
  createPosition,
  updatePosition,
  deletePosition,
  duplicatePosition,
} from '@/lib/api/positions';

export const usePositions = () =>
  useQuery({ queryKey: ['positions'], queryFn: fetchPositions });

export const usePosition = (id: number) =>
  useQuery({ queryKey: ['positions', id], queryFn: () => fetchPosition(id), enabled: !!id });

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  });
};

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updatePosition(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  });
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePosition,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  });
};

export const useDuplicatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: duplicatePosition,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  });
};
