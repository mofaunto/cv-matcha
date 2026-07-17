'use client';

import { Container, Title, Text, SimpleGrid, Card, Badge } from '@mantine/core';
import { useCurrentUser } from '@/hooks/use-user';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function FeedPage() {
  const { data: user } = useCurrentUser();
  const { t } = useLanguage();

  return (
    <Container fluid>
      <Title order={2} mb="lg">{t.feed.welcome}, {user?.name}</Title>
      <Text c="dimmed">Here’s what’s happening with your matches today.</Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} mt="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="xs" c="dimmed">Total Positions</Text>
          <Text fw={500} size="xl">—</Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="xs" c="dimmed">New CVs (24h)</Text>
          <Text fw={500} size="xl">—</Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="xs" c="dimmed">Your Role</Text>
          <Badge color="blue">{user?.role}</Badge>
        </Card>
      </SimpleGrid>
    </Container>
  );
}