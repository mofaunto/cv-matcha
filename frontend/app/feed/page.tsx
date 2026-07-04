'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { Container, Title, Text, Modal, Select, Button, Stack } from '@mantine/core';
import { useCurrentUser, useUpdateRole } from '@/hooks/use-user';
import { redirect } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguagePicker } from '@/components/common/selectors/LanguagePicker';
import { Translations } from '@/lib/i18n/locales/types';

export default function FeedPage() {
  const { data: session, isPending } = authClient.useSession();
  const { data: user, isLoading } = useCurrentUser();
  const updateRole = useUpdateRole();
  const { t, locale, setLocale } = useLanguage();

  console.log('session:', session);
  console.log('user:', user);

  if (isPending || isLoading) return <Text>Loading...</Text>;
  if (!session) redirect('/login');
  const showSetupModal = user && !user.setupCompleted;

  return (
    <Container mt="xl">
      <LanguagePicker locale={locale} onChange={setLocale} />
      <Stack mt="xl"></Stack>
      <Title>{t.feed.welcome}, {session.user.name}</Title>
      <Text>{t.feed.role}: {user?.role}</Text>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>

      <SetupModal
        opened={showSetupModal}
        onClose={() => {}}
        onSelectRole={(role) => updateRole.mutate(role)}
        isLoading={updateRole.isPending}
        t={t}
      />
    </Container>
  );
}

function SetupModal({
  opened,
  onClose,
  onSelectRole,
  isLoading,
  t,
}: {
  opened: boolean;
  onClose: () => void;
  onSelectRole: (role: string) => void;
  isLoading: boolean;
  t: Translations;
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedRole) onSelectRole(selectedRole);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t.feed.setupModalTitle}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <Stack>
        <Select
          label={t.feed.selectRole}
          data={[
            { value: 'candidate', label: t.feed.candidate },
            { value: 'recruiter', label: t.feed.recruiter },
            { value: 'admin', label: t.feed.admin },
          ]}
          value={selectedRole}
          onChange={setSelectedRole}
        />
        <Button onClick={handleSubmit} loading={isLoading} disabled={!selectedRole}>
          {t.feed.save}
        </Button>
      </Stack>
    </Modal>
  );
}