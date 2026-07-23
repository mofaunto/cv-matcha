'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  ActionIcon,
  Select,
  Switch,
  Modal,
  Text,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  useAdminUsers,
  useUpdateUserRole,
  useToggleUserBlock,
  useDeleteUser,
} from '@/hooks/use-admin';
import { useCurrentUser } from '@/hooks/use-user';

const getErrorMessage = (err: unknown): string => {
  if (!err) return '';
  const msg =
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    (err as { message?: string })?.message ??
    '';
  return msg;
};

export default function AdminPageContent() {
  const { t } = useLanguage();
  const { data: users, isLoading } = useAdminUsers();
  const { data: currentUser } = useCurrentUser();

  const roleMutation = useUpdateUserRole();
  const blockMutation = useToggleUserBlock();
  const deleteMutation = useDeleteUser();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  const handleRoleChange = (id: string, newRole: string) => {
    roleMutation.mutate(
      { id, role: newRole },
      {
        onSuccess: () => toast.success(t.admin.roleChanged || 'Role updated'),
        onError: (err) => {
          const message = getErrorMessage(err);
          if (message) {
            toast.error(message);
          } else {
            toast.error(t.admin.roleChangeError || 'Failed to update role');
          }
        },
      },
    );
  };

  const handleBlockToggle = (id: string, newBlocked: boolean) => {
    blockMutation.mutate(
      { id, isBlocked: newBlocked },
      {
        onSuccess: () =>
          toast.success(
            newBlocked
              ? t.admin.userBlocked || 'User blocked'
              : t.admin.userUnblocked || 'User unblocked',
          ),
        onError: (err) => {
          const message = getErrorMessage(err);
          if (message) {
            toast.error(message);
          } else {
            toast.error(t.admin.blockError || 'Failed to update block status');
          }
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    if (currentUser?.id === id) {
      toast.error(t.admin.cannotDeleteSelf || 'You cannot delete yourself');
      return;
    }
    setDeleteId(id);
    openConfirm();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => toast.success(t.admin.userDeleted || 'User deleted'),
      onError: (err) => {
        const message = getErrorMessage(err);
        if (message) {
          toast.error(message);
        } else {
          toast.error(t.admin.userDeleteError || 'Failed to delete user');
        }
      },
    });
    closeConfirm();
    setDeleteId(null);
  };

  return (
    <Container fluid>
      <Title order={2} mb="md">
        {t.admin.title || 'Admin Panel – Users'}
      </Title>

      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t.admin.name || 'Name'}</Table.Th>
              <Table.Th visibleFrom="sm">{t.admin.email || 'Email'}</Table.Th>
              <Table.Th>{t.admin.role || 'Role'}</Table.Th>
              <Table.Th>{t.admin.blocked || 'Blocked'}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && (
              <Table.Tr>
                <Table.Td colSpan={5}>{t.attributes.loading}</Table.Td>
              </Table.Tr>
            )}
            {users?.map((u) => (
              <Table.Tr key={u.id}>
                <Table.Td>{u.name}</Table.Td>
                <Table.Td visibleFrom="sm">{u.email}</Table.Td>
                <Table.Td>
                  <Select
                    data={[
                      { value: 'candidate', label: t.feed.candidate },
                      { value: 'recruiter', label: t.feed.recruiter },
                      { value: 'admin', label: t.feed.admin },
                    ]}
                    value={u.role}
                    onChange={(val) => val && handleRoleChange(u.id, val)}
                    size="xs"
                    style={{ width: 130 }}
                  />
                </Table.Td>
                <Table.Td>
                  <Switch
                    checked={u.isBlocked}
                    onChange={(e) =>
                      handleBlockToggle(u.id, e.currentTarget.checked)
                    }
                  />
                </Table.Td>
                <Table.Td w={40}>
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => handleDelete(u.id)}>
                        {t.common.delete}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Modal
        opened={confirmOpened}
        onClose={closeConfirm}
        title={t.admin.deleteConfirmTitle || 'Confirm Deletion'}
        size="sm"
      >
        <Text mb="md">
          {t.admin.deleteConfirm ||
            'Are you sure you want to delete this user?'}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeConfirm}>
            {t.attributes.cancel}
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteMutation.isPending}
          >
            {t.attributes.delete}
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}