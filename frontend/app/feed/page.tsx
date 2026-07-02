'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { Container, Title, Text, Modal, Select, Button, Stack } from '@mantine/core';
import { useCurrentUser, useUpdateRole } from '@/hooks/use-user';
import { redirect } from 'next/navigation';

export default function FeedPage() {
  const { data: session, isPending } = authClient.useSession();
  const { data: user, isLoading } = useCurrentUser();
  const updateRole = useUpdateRole();

  // console.log('session:', session);
  // console.log('user:', user);

  if (isPending || isLoading) return <Text>Loading...</Text>;
  if (!session) redirect('/login');
  const showSetupModal = user && !user.setupCompleted;

  return (
    <Container mt="xl">
      <Title>Welcome, {session.user.name}</Title>
      <Text>Role: {user?.role}</Text>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>

      <SetupModal
        opened={showSetupModal}
        onClose={() => {}}
        onSelectRole={(role) => updateRole.mutate(role)}
        isLoading={updateRole.isPending}
      />
    </Container>
  );
}

function SetupModal({
  opened,
  onClose,
  onSelectRole,
  isLoading,
}: {
  opened: boolean;
  onClose: () => void;
  onSelectRole: (role: string) => void;
  isLoading: boolean;
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedRole) onSelectRole(selectedRole);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Complete your profile"
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <Stack>
        <Select
          label="Choose your role"
          data={[
            { value: 'candidate', label: 'Candidate' },
            { value: 'recruiter', label: 'Recruiter' },
            { value: 'admin', label: 'Administrator' },
          ]}
          value={selectedRole}
          onChange={setSelectedRole}
        />
        <Button onClick={handleSubmit} loading={isLoading} disabled={!selectedRole}>
          Save
        </Button>
      </Stack>
    </Modal>
  );
}