'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Tabs } from '@mantine/core';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ProfileInfoTab from './ProfileInfoTab';
import ProjectsTab from './ProjectsTab';
import CVsTab from './CVsTab';

export default function ProfilePage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') ?? 'info';
  const defaultTab = ['info', 'projects', 'cvs'].includes(tabParam) ? tabParam : 'info';

  return (
    <Container fluid>
      <Tabs defaultValue={defaultTab}>
        <Tabs.List>
          <Tabs.Tab value="info">{t.profile.myProfile}</Tabs.Tab>
          <Tabs.Tab value="projects">{t.profile.projects}</Tabs.Tab>
          <Tabs.Tab value="cvs">{t.profile.cvs}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="info" pt="md">
          <ProfileInfoTab />
        </Tabs.Panel>

        <Tabs.Panel value="projects" pt="md">
          <ProjectsTab />
        </Tabs.Panel>

        <Tabs.Panel value="cvs" pt="md">
          <CVsTab />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}