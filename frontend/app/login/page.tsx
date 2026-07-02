'use client';

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import { Button, TextInput, Container, Title, Stack, Group } from '@mantine/core';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (session) redirect('/feed');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email({ email, password });
    router.push('/feed');
  };

  return (
    <Container size="xs" mt="xl">
      <Title order={2} mb="md">Sign in</Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit">Sign in with Email</Button>
        </Stack>
      </form>

      <Group mt="md">
        <Button variant="outline" onClick={() => authClient.signIn.social({ provider: 'discord' })}>
          Discord
        </Button>
        <Button variant="outline" onClick={() => authClient.signIn.social({ provider: 'github' })}>
          GitHub
        </Button>
      </Group>

      <Group mt="md">
        <Button variant="outline" onClick={() => router.push('/register')}>
          Register
        </Button>
      </Group>
    </Container>
  );
}