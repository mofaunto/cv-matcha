'use client';

import { AppShell, Burger, Group, NavLink, Avatar, Menu, UnstyledButton, Text } from '@mantine/core';
import { Toaster } from 'sonner';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-user';
import { LanguagePicker } from '@/components/common/selectors/LanguagePicker';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { authClient } from '@/lib/auth/auth-client';
import { useQueryClient } from '@tanstack/react-query';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { data: user } = useCurrentUser();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const navItems = [
    { label: t.sidebar.dashboard, href: '/feed', roles: ['candidate', 'recruiter', 'admin'] },
    { label: t.sidebar.myProfile, href: '/profile', roles: ['candidate', 'admin'] },
    { label: t.sidebar.positions, href: '/positions', roles: ['candidate', 'recruiter', 'admin'] },
    { label: t.sidebar.attributeLibrary, href: '/attributes', roles: ['recruiter', 'admin'] },
    { label: t.sidebar.adminPanel, href: '/admin', roles: ['admin'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role ?? ''));

  const handleSignOut = async () => {
    try {
        await authClient.signOut();
    } catch (error) {
        console.error('Sign out failed:', error);
    } finally {
        queryClient.clear();
        window.location.href = '/login';
    }
  };

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <Toaster richColors position="bottom-right" />
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <UnstyledButton onClick={() => router.push('/feed')}>
              <Text fw={700} size="lg">CV Matcha</Text>
            </UnstyledButton>
          </Group>

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
                  {t.sidebar.accountSettings}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={handleSignOut}>
                  {t.sidebar.logout}
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
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}