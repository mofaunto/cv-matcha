'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import {
  Button,
  TextInput,
  Container,
  Title,
  Stack,
  Alert,
  PasswordInput,
} from '@mantine/core';

function getPasswordStrength(password: string) {
  if (password.length < 8) return { valid: false, message: 'At least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'One uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'One lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'One digit' };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, message: 'One special character' };
  return { valid: true, message: 'Strong' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = authClient.useSession();
  if (session) router.push('/feed');

  const passwordFeedback = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordFeedback.valid) {
      setError('Password is too weak: ' + passwordFeedback.message);
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authClient.signUp.email({ email, password, name });
      router.push('/feed');
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = error?.message || 'Registration failed. Please try again.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Title order={2} mb="md">
        Create account
      </Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          {error && (
            <Alert color="red" onClose={() => setError(null)} withCloseButton>
              {error}
            </Alert>
          )}

          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            description={password.length > 0 ? passwordFeedback.message : undefined}
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            required
            error={
              confirmPassword.length > 0 && !passwordsMatch
                ? 'Passwords do not match'
                : undefined
            }
          />

          <Button type="submit" loading={loading}>
            Register
          </Button>
        </Stack>
      </form>
    </Container>
  );
}