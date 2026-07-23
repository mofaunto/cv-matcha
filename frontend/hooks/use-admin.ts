import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUsers,
  updateUserRole,
  toggleUserBlock,
  deleteUserAccount,
} from '@/lib/api/admin';

export const useAdminUsers = () =>
  useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useToggleUserBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      toggleUserBlock(id, isBlocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
