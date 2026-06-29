"use client"

import { Anchor, Container, Text, Title, Center, Button } from '@mantine/core';
import classes from './Welcome.module.css';
import { health } from '@/lib/api/health';

export function Welcome() {

  const checkHealth = async () => {
    const response = await health();
    console.log(response);
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


        <Button onClick={checkHealth} mt={20}>Check Health</Button>
    </Container>
    </Center>
  );
}