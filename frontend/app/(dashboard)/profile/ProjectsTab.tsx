'use client';

import '@mantine/dates/styles.css';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Title,
  Text,
  Group,
  Table,
  Button,
  Modal,
  Stack,
  TextInput,
  Badge,
  ActionIcon,
  TagsInput,
  Menu,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconPlus, IconDotsVertical, IconEye } from '@tabler/icons-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useTagSuggestions,
} from '@/hooks/use-projects';
import type { Project } from '@/lib/api/projects';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function ProjectsTab() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [createEditOpened, { open, close }] = useDisclosure(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const { data: tagSuggestions = [] } = useTagSuggestions(tagSearch);

  // Separate states – no type inference confusion
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setStartDate(null);
    setEndDate(null);
    setTags([]);
  };

  const openCreate = () => {
    setEditProject(null);
    resetForm();
    open();
  };

  const openEdit = (project: Project) => {
    setEditProject(project);
    setName(project.name);
    setDescription(project.description);
    setStartDate(project.startDate ? new Date(project.startDate) : null);
    setEndDate(project.endDate ? new Date(project.endDate) : null);
    setTags(project.tags ?? []);
    open();
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      startDate: startDate?.toISOString() ?? '',
      endDate: endDate?.toISOString() ?? null,
      tags,
    };

    if (editProject) {
      await updateMutation.mutateAsync({ id: editProject.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    close();
  };

  const handleDelete = (id: number) => {
    if (confirm(t.projects.deleteConfirm)) deleteMutation.mutate(id);
  };

  const existingTags = [...new Set(projects?.flatMap(p => p.tags) ?? [])];
  const tagData = tagSuggestions.length > 0 ? tagSuggestions : existingTags;

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={3}>{t.projects.title}</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          {t.projects.create}
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t.projects.name}</Table.Th>
            <Table.Th>{t.projects.period}</Table.Th>
            <Table.Th>{t.projects.tags}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading && (
            <Table.Tr>
              <Table.Td colSpan={4}>{t.attributes.loading}</Table.Td>
            </Table.Tr>
          )}
          {projects?.map(project => (
            <Table.Tr key={project.id}>
              <Table.Td>{project.name}</Table.Td>
              <Table.Td>
                {new Date(project.startDate).toLocaleDateString()} – {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {project.tags?.map(tag => (
                    <Badge key={tag} size="sm" variant="light">{tag}</Badge>
                  ))}
                </Group>
              </Table.Td>

              <Table.Td w={40}>
                <Menu shadow="md" width={150}>
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEye size={16} />} onClick={() => openEdit(project)}>
                      {t.common.view}
                    </Menu.Item>
                    <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => handleDelete(project.id)}>
                      {t.common.delete}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={createEditOpened}
        onClose={close}
        title={editProject ? t.projects.editTitle : t.projects.createTitle}
        size="lg"
      >
        <Stack>
          <TextInput
            label={t.projects.name}
            value={name}
            onChange={e => setName(e.currentTarget.value)}
            required
          />
          <DatePickerInput
            label={t.projects.startDate}
            value={startDate}
            onChange={(val) => setStartDate(val ? new Date(val) : null)}
            required
          />
          <DatePickerInput
            label={t.projects.endDate}
            value={endDate}
            onChange={(val) => setEndDate(val ? new Date(val) : null)}
            clearable
          />
          <TagsInput
            label={t.projects.tags}
            data={tagData.map(tag => ({ value: tag, label: tag }))}
            value={tags}
            onChange={setTags}
            onSearchChange={setTagSearch}
            placeholder={t.projects.tagsPlaceholder}
          />
          <Text size="sm" fw={500}>{t.projects.description}</Text>
          <MDEditor
            value={description}
            onChange={val => setDescription(val ?? '')}
            height={300}
          />
          <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
            {editProject ? t.attributes.save : t.projects.create}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}