'use client';

import { AppShell, Burger, Group, NavLink, Button, Avatar, Menu, UnstyledButton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-user';
import { LanguagePicker } from '@/components/common/selectors/LanguagePicker';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { authClient } from '@/lib/auth/auth-client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { data: user } = useCurrentUser();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/feed', roles: ['candidate', 'recruiter', 'admin'] },
    { label: 'My Profile', href: '/profile', roles: ['candidate', 'admin'] },
    { label: 'Positions', href: '/positions', roles: ['candidate', 'recruiter', 'admin'] },
    { label: 'Attribute Library', href: '/attributes', roles: ['recruiter', 'admin'] },
    { label: 'Admin Panel', href: '/admin', roles: ['admin'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role ?? ''));

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <UnstyledButton onClick={() => router.push('/feed')}>
              <Text fw={700} size="lg">CV Matcha</Text>
            </UnstyledButton>
          </Group>

          {/* Right side: language picker + avatar dropdown */}
          <Group>
            <LanguagePicker locale={locale} onChange={setLocale} />
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  {user?.image ? (
                    <Avatar src={user.image} alt={user.name} radius="xl" />
                  ) : (
                    <Avatar name={user?.name} color="initials" alt="User" />
                  )}
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.name}</Menu.Label>
                <Menu.Item onClick={() => router.push('/account-settings')}>
                  Account Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={() => authClient.signOut()}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            onClick={() => router.push(item.href)}
            active={window.location.pathname === item.href}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}