'use client';

import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

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
      {colorScheme === 'dark' ? (
        <ActionIcon variant="default" size={40} onClick={() => setColorScheme('light')}><IconSun stroke={2} /></ActionIcon>
      ) : (
        <ActionIcon variant="default" size={40} onClick={() => setColorScheme('dark')}><IconMoon stroke={2} /></ActionIcon>
      )}
    </Group>
  );
}