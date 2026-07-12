'use client';

import { authClient } from '@/lib/auth/auth-client';
import { Container, Title, Text, Button } from '@mantine/core';
import { useCurrentUser } from '@/hooks/use-user';
import { redirect } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguagePicker } from '@/components/common/selectors/LanguagePicker';

export default function FeedPage() {
  const { data: session, isPending } = authClient.useSession();
  const { data: user, isLoading } = useCurrentUser();
  const { t, locale, setLocale } = useLanguage();

  if (isPending || isLoading) return <Text>Loading...</Text>;
  if (!session) redirect('/login');

  return (
    <Container mt="xl">
      <LanguagePicker locale={locale} onChange={setLocale} />
      <Title>{t.feed.welcome}, {session.user.name}</Title>
      <Text>{t.feed.role}: {user?.role}</Text>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
    </Container>
  );
}