'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { getMe } from '@/lib/api/users';
import { Container, Title, Text } from '@mantine/core';

export default function FeedPage() {
  const { data: session, isPending } = authClient.useSession();
  const [userInfo, setUserInfo] = useState<{
    role?: string;
    theme?: string;
    language?: string;
    isBlocked?: boolean;
  } | null>(null);

  useEffect(() => {
    if (session) {
      getMe().then(setUserInfo);
    }
  }, [session]);

  if (isPending) return <Text>Loading...</Text>;
  if (!session) return <Text>Please log in.</Text>;

  return (
    <Container mt="xl">
      <Title>Welcome, {session.user.name}</Title>
      <Text>Role from DB: {userInfo?.role ?? 'loading...'}</Text>
      {userInfo && (
        <>
          <Text>Theme: {userInfo.theme}</Text>
          <Text>Language: {userInfo.language}</Text>
          <Text>Blocked: {userInfo.isBlocked ? 'Yes' : 'No'}</Text>
        </>
      )}
    </Container>
  );
}