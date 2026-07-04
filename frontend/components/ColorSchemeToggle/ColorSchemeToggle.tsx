'use client';

import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { US, RU } from '@rdnr/react-country-flags';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Group justify="end" mt="lg" mr="lg">
        <ActionIcon variant="default" size={40}></ActionIcon>
    </Group>;
  }

  return (
    <Group justify="end" mt="lg" mr="lg">
      {locale === 'en' ? (
        <ActionIcon variant="transparent" size={40} onClick={() => setLocale('ru')}><US width={40} /></ActionIcon>
      ) : (
        <ActionIcon variant="transparent" size={40} onClick={() => setLocale('en')}><RU width={40} /></ActionIcon>
      )}
      {colorScheme === 'dark' ? (
        <ActionIcon variant="default" size={40} onClick={() => setColorScheme('light')}><IconSun stroke={2} /></ActionIcon>
      ) : (
        <ActionIcon variant="default" size={40} onClick={() => setColorScheme('dark')}><IconMoon stroke={2} /></ActionIcon>
      )}
    </Group>
  );
}