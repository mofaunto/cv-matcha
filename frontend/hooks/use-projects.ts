import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchTagSuggestions,
} from '@/lib/api/projects';

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projectTags'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateProject(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useTagSuggestions = (search: string) =>
  useQuery({
    queryKey: ['projectTags', search],
    queryFn: () => fetchTagSuggestions(search),
    enabled: search.length > 0,
  });
