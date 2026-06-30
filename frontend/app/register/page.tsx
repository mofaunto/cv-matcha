'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import { Button, TextInput, Select, Container, Title, Stack } from '@mantine/core';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');

  const handleRegister = async () => {
    // Better Auth’s signUp.email returns the user; we can then set role via API
    await authClient.signUp.email({ email, password, name });
    // After sign up, redirect to role selection or directly set role
    // For now, just redirect
    router.push('/feed');
  };

  return (
    <Container size="xs" mt="xl">
      <Title order={2} mb="md">Create account</Title>
      <Stack>
        <TextInput label="Name" value={name} onChange={e => setName(e.target.value)} />
        <TextInput label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Select
          label="Role"
          data={[
            { value: 'candidate', label: 'Candidate' },
            { value: 'recruiter', label: 'Recruiter' },
          ]}
          value={role}
          onChange={val => setRole(val as any)}
        />
        <Button onClick={handleRegister}>Register</Button>
      </Stack>
    </Container>
  );
}