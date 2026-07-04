'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import {
  Anchor,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DiscordButton } from '@/components/common/buttons/DiscordButton';
import { GithubButton } from '@/components/common/buttons/GithubButton';

export default function LoginPage(props: PaperProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = authClient.useSession();
  if (session) router.push('/feed');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 1 ? 'Password is required' : null,
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      router.push('/feed');
    } catch (err: unknown) {
        if (err instanceof Error) {
          const message = err?.message || 'Something went wrong with login.';
          setError(message);
        } else {
            console.error('An unknown error occurred');
        }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'discord' | 'github') => {
    authClient.signIn.social({
      provider,
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/feed`,
    });
  };

  return (
    <Center w="100%" h="100vh">
      <Paper w="100%" maw="400px" radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500} ta="center" mb="md">
          Sign In
        </Text>

        <Group grow mb="md">
          <DiscordButton radius="xl" bg="blue" onClick={() => handleSocialLogin('discord')}>
            Discord
          </DiscordButton>
          <GithubButton radius="xl" bg="black" onClick={() => handleSocialLogin('github')}>
            GitHub
          </GithubButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && (
              <Alert color="red" onClose={() => setError(null)} withCloseButton>
                {error}
              </Alert>
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              {...form.getInputProps('email')}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              onClick={() => router.push('/register')}
              size="xs"
            >
              Don&apos;t have an account? Register
            </Anchor>
            <Button type="submit" radius="xl" loading={loading}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}