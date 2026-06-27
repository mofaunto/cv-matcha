import { Anchor, Container, Text, Title, Center } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
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
    </Container>
    </Center>
  );
}