import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMyCVs,
  fetchCVsForPosition,
  fetchAssembledCV,
  createCV,
  deleteCV,
  fetchPositionApplications,
  publishCV
} from '@/lib/api/cvs';

export const useMyCVs = () =>
  useQuery({ queryKey: ['myCVs'], queryFn: fetchMyCVs });

export const useCVsForPosition = (positionId: number) =>
  useQuery({
    queryKey: ['cvs', 'position', positionId],
    queryFn: () => fetchCVsForPosition(positionId),
    enabled: !!positionId,
  });

export const useAssembledCV = (cvId: number) =>
  useQuery({
    queryKey: ['assembledCV', cvId],
    queryFn: () => fetchAssembledCV(cvId),
    enabled: !!cvId,
  });

export const useCreateCV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCVs'] });
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
};

export const useDeleteCV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCVs'] });
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
};

export const usePositionApplications = (positionId: number) =>
  useQuery({
    queryKey: ['positionApplications', positionId],
    queryFn: () => fetchPositionApplications(positionId),
    enabled: !!positionId,
  });

export const usePublishCV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCVs'] });
      queryClient.invalidateQueries({ queryKey: ['assembledCV'] });
    },
  });
};