import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProfileAttributes,
  addProfileAttribute,
  updateProfileAttributeValue,
  removeProfileAttribute,
} from '@/lib/api/profile-attributes';

export const useProfileAttributes = () =>
  useQuery({
    queryKey: ['profileAttributes'],
    queryFn: fetchProfileAttributes,
  });

export const useAddProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProfileAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileAttributes'] });
    },
  });
};

export const useUpdateProfileAttributeValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version, value }: { id: number; version: number; value: any }) =>
      updateProfileAttributeValue(id, version, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileAttributes'] });
    },
  });
};

export const useRemoveProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeProfileAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileAttributes'] });
    },
  });
};
