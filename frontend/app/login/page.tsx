'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import { Button, TextInput, Container, Title, Stack, Group } from '@mantine/core';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCredentialsLogin = async () => {
    await authClient.signIn.email({ email, password });
    router.push('/feed');
  };

  return (
    <Container size="xs" mt="xl">
      <Title order={2} mb="md">Sign in</Title>
      <Stack>
        <TextInput label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={handleCredentialsLogin}>Sign in with Email</Button>
        <Group>
          <Button variant="outline" onClick={() => authClient.signIn.social({ provider: 'discord' })}>
            Discord
          </Button>
          <Button variant="outline" onClick={() => authClient.signIn.social({ provider: 'github' })}>
            GitHub
          </Button>
        </Group>

        <Group>
          <Button variant="outline" onClick={() => router.push('/register')}>
            Register
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}