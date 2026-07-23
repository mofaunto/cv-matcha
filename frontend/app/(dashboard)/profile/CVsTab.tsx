'use client';

import { useState } from 'react';
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Badge,
  Modal,
  Stack,
  Paper,
  LoadingOverlay,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconEye, IconDownload } from '@tabler/icons-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  useMyCVs,
  useDeleteCV,
  useAssembledCV,
} from '@/hooks/use-cvs';
import { generateCvPdf } from '@/lib/pdf/generate-cv-pdf';

export default function CVsTab() {
  const { t } = useLanguage();
  const { data: cvs, isLoading } = useMyCVs();
  const deleteMutation = useDeleteCV();

  const [viewCvId, setViewCvId] = useState<number | null>(null);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const { data: assembledCV, isLoading: isAssembling } = useAssembledCV(
    viewCvId ?? 0,
  );

  const handleDelete = (id: number) => {
    if (confirm(t.projects.deleteConfirm)) deleteMutation.mutate(id);
  };

  const openCV = (cvId: number) => {
    setViewCvId(cvId);
    openView();
  };

  const closeCV = () => {
    closeView();
    setViewCvId(null);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (!cvs || cvs.length === 0) {
    return <Text c="dimmed">{t.cvs.empty || 'No CVs yet.'}</Text>;
  }

  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t.cvs.position || 'Position'}</Table.Th>
            <Table.Th>{t.cvs.created || 'Created'}</Table.Th>
            <Table.Th w={100}>{t.attributes.actions}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cvs.map((cv) => (
            <Table.Tr key={cv.id}>
              <Table.Td>{cv.positionTitle}</Table.Td>
              <Table.Td>{new Date(cv.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => openCV(cv.id)}>
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => handleDelete(cv.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={viewOpened}
        onClose={closeCV}
        title={assembledCV?.positionTitle || 'CV'}
        size="xl"
        styles={{ body: { maxHeight: '80vh', overflowY: 'auto' } }}
      >
        {isAssembling ? (
          <LoadingOverlay visible />
        ) : assembledCV ? (
          <Stack>
            <Group justify="space-between">
              <Text fw={500}>{t.cvs.myCV || 'My CV'}: {assembledCV.positionTitle}</Text>
              <Button
                variant="outline"
                leftSection={<IconDownload size={16} />}
                onClick={() => assembledCV && generateCvPdf(assembledCV)}
              >
                {t.cvs.download || 'Download'}
              </Button>
            </Group>
            <Text size="sm" c="dimmed">{assembledCV.positionShortDescription}</Text>

            <Text fw={500} mt="md">{t.cvs.myDetails || 'My Details'}</Text>
            <Paper withBorder p="sm">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t.attributes.name || 'Attribute'}</Table.Th>
                    <Table.Th>{t.cvs.value || 'Value'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {assembledCV.attributes.map((attr) => (
                    <Table.Tr key={attr.attributeId}>
                      <Table.Td>{attr.name}</Table.Td>
                      <Table.Td>
                        {attr.value
                          ? attr.type === 'image'
                            ? <img src={attr.value.valueImageUrl} alt={attr.name} height={50} />
                            : attr.type === 'date'
                              ? new Date(attr.value.valueDate ?? attr.value).toLocaleDateString()
                              : String(attr.value.valueString ?? attr.value.valueNumeric ?? attr.value.valueBoolean ?? attr.value.valueOption ?? attr.value.valueText ?? attr.value.valueImageUrl ?? '')
                          : <Badge color="red">{t.cvs.missing || 'Missing'}</Badge>
                        }
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>

            <Text fw={500} mt="md">{t.profile.projects || 'Projects'}</Text>
            {assembledCV.projects.length > 0 ? (
              <Paper withBorder p="sm">
                <Stack>
                  {assembledCV.projects.map((proj, idx) => (
                    <div key={idx}>
                      <Text fw={500}>{proj.name}</Text>
                      <Text size="xs" c="dimmed">
                        {new Date(proj.startDate).toLocaleDateString()} – {proj.endDate ? new Date(proj.endDate).toLocaleDateString() : 'Present'}
                      </Text>
                      <Text size="sm" mt={4}>{proj.description}</Text>
                    </div>
                  ))}
                </Stack>
              </Paper>
            ) : (
              <Text c="dimmed">{t.cvs.noProjects || 'No projects selected.'}</Text>
            )}
          </Stack>
        ) : (
          <Text c="dimmed">Could not load CV.</Text>
        )}
      </Modal>
    </>
  );
}