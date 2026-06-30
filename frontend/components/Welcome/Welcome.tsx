"use client"

import { Anchor, Container, Text, Title, Center, Button } from '@mantine/core';
import classes from './Welcome.module.css';
import { useRouter } from 'next/navigation';

export function Welcome() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/login');
  };

  return (
    <Center component="main" className={classes.center}>
        <Container className={classes.container}>
        <Title ta="center">
            Welcome to{' '}
            <Text inherit variant="gradient" component="span" gradient={{ from: 'teal', to: 'orange' }}>
            Mantine
            </Text>
        </Title>
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
            This starter Next.js project includes a minimal setup for server side rendering, if you want
            to learn more on Mantine + Next.js integration follow{' '}
            <Anchor href="https://mantine.dev/guides/next/" size="lg">
            this guide
            </Anchor>
            . To get started edit page.tsx file.
        </Text>


        <Button onClick={handleClick} mt={20}>Login</Button>
    </Container>
    </Center>
  );
}