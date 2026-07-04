"use client"

import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Group, Image, List, Text, ThemeIcon, Title, Center } from '@mantine/core';
import image from './image.svg';
import { useRouter } from 'next/navigation';
import classes from './Welcome.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function Welcome() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const handleClick = () => {
    router.push('/login');
  };

  return (
    <Center h="100vh">
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              {t.landing.title1}<span className={classes.highlight}>{t.landing.title2}</span>{t.landing.title3}<span className={classes.highlightTitle}>{t.landing.title4}</span>
            </Title>
            <Text mt="md">
              {t.landing.subheading}
            </Text>

            <List
              mt={32}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={12} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>{t.landing.list_item_1_1}</b> {t.landing.list_item_1_2}
              </List.Item>
              <List.Item>
                <b>{t.landing.list_item_2_1}</b> {t.landing.list_item_2_2}
              </List.Item>
              <List.Item>
                <b>{t.landing.list_item_3_1}</b> {t.landing.list_item_3_2}
              </List.Item>
            </List>

            <Group mt={32}>
              <Button radius="xl" size="md" className={classes.control} onClick={handleClick}>
                {t.landing.getStarted}
              </Button>
            </Group>
          </div>
          <Image src={image.src} className={classes.image} alt="" />
        </div>
      </Container>
    </Center>
  );
}