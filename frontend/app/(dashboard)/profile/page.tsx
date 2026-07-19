'use client';

import { Container, Tabs } from '@mantine/core';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ProfileInfoTab from './ProfileInfoTab';
import ProjectsTab from './ProjectsTab';
import CVsTab from './CVsTab';

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <Container fluid>

      <Tabs defaultValue="info">
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
