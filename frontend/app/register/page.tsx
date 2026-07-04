'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import {
  Anchor,
  Button,
  Center,
  Checkbox,
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
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguagePicker } from '@/components/common/selectors/LanguagePicker';

function getPasswordStrength(password: string) {
  if (password.length < 8) return { valid: false, message: 'At least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'One uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'One lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'One digit' };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, message: 'One special character' };
  return { valid: true, message: 'Strong' };
}

export default function RegisterPage(props: PaperProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, locale, setLocale } = useLanguage();

  const { data: session } = authClient.useSession();
  if (session) router.push('/feed');

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validate: {
      name: (val) => (val.trim().length > 0 ? null : 'Name is required'),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => {
        const strength = getPasswordStrength(val);
        return strength.valid ? null : strength.message;
      },
      confirmPassword: (val, values) =>
        val !== values.password ? 'Passwords do not match' : null,
      terms: (val) => (val ? null : 'You must accept the terms'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    setLoading(true);
    try {
      await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      router.push('/feed');
    } catch (err: unknown) {
        if (err instanceof Error) {
          const message = err?.message || 'Something went wrong with registration.';
          setError(message);
        } else {
            console.error('An unknown error occurred');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center w="100%" h="100vh">
      <Paper w="100%" maw="400px" radius="md" p="xl" withBorder {...props}>
        <Group justify="space-between" align="center" mb="md">
          <Text size="lg" fw={500} ta="center">
            {t.auth.register}
          </Text>
          <LanguagePicker locale={locale} onChange={setLocale} />
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && (
              <Alert color="red" onClose={() => setError(null)} withCloseButton>
                {error}
              </Alert>
            )}

            <TextInput
              required
              label={t.auth.name}
              placeholder={t.auth.name}
              {...form.getInputProps('name')}
              radius="md"
            />

            <TextInput
              required
              label={t.auth.email}
              placeholder="hello@example.dev"
              {...form.getInputProps('email')}
              radius="md"
            />

            <PasswordInput
              required
              label={t.auth.password}
              placeholder={t.auth.password}
              {...form.getInputProps('password')}
              radius="md"
              description={
                form.values.password.length > 0
                  ? getPasswordStrength(form.values.password).message
                  : undefined
              }
            />

            <PasswordInput
              required
              label={t.auth.confirmPassword}
              placeholder={t.auth.confirmPassword}
              {...form.getInputProps('confirmPassword')}
              radius="md"
            />

            <Checkbox
              label={t.auth.terms}
              {...form.getInputProps('terms', { type: 'checkbox' })}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              onClick={() => router.push('/login')}
              size="xs"
            >
              {t.auth.alreadyHaveAccount}
            </Anchor>
            <Button type="submit" radius="xl" loading={loading}>
              {t.auth.register}
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}