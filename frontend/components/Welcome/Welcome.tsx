"use client"

import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Group, Image, List, Text, ThemeIcon, Title, Center } from '@mantine/core';
import image from './image.svg';
import { useRouter } from 'next/navigation';
import classes from './Welcome.module.css';

export function Welcome() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/login');
  };

  return (
    <Center h="100vh">
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Find your <span className={classes.highlight}>dream job / dream candidate</span> with <span className={classes.highlightTitle}>CV Matcha</span>
            </Title>
            <Text mt="md">
              Whether you are looking for a job, or looking for a candidate, CV Matcha is the perfect solution for you. Our platform uses advanced algorithms to match job seekers with the best job opportunities and employers with the most suitable candidates.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={12} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Attribute Library</b> – Create reusable structured data across profiles, positions, and CVs.
              </List.Item>
              <List.Item>
                <b>Customizable positions</b> – customizable templates for various job positions.
              </List.Item>
              <List.Item>
                <b>CV Generation</b> – generate CVs automatically based on candidate profile data and attributes.
              </List.Item>
            </List>

            <Group mt={32}>
              <Button radius="xl" size="md" className={classes.control} onClick={handleClick}>
                Get Started
              </Button>
            </Group>
          </div>
          <Image src={image.src} className={classes.image} alt="" />
        </div>
      </Container>
    </Center>
  );
}