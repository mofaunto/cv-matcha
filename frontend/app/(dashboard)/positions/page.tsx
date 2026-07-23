'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Table,
  Button,
  Modal,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  MultiSelect,
  ActionIcon,
  Badge,
  TagsInput,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconPlus, IconCopy, IconDownload, IconEye, IconDotsVertical } from '@tabler/icons-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  usePositions,
  useCreatePosition,
  useUpdatePosition,
  useDeletePosition,
  useDuplicatePosition,
} from '@/hooks/use-positions';
import { fetchAssembledCV } from '@/lib/api/cvs';
import { usePositionApplications } from '@/hooks/use-cvs';
import { generateCvPdf } from '@/lib/pdf/generate-cv-pdf';
import { useCurrentUser } from '@/hooks/use-user';
import { useCreateCV } from '@/hooks/use-cvs';
import { useAttributes } from '@/hooks/use-attributes';
import RuleBuilder, { type Rule } from './RuleBuilder';
import type { Position, Rule as ApiRule } from '@/lib/api/positions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PositionsPage() {
  const { t } = useLanguage();
  const { data: positions, isLoading } = usePositions();
  const { data: allAttrs } = useAttributes({});
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();
  const deleteMutation = useDeletePosition();
  const duplicateMutation = useDuplicatePosition();
  const { data: currentUser } = useCurrentUser();
  const createCvMutation = useCreateCV();
  const router = useRouter();

  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);

  const isRecruiterOrAdmin = currentUser?.role === 'recruiter' || currentUser?.role === 'admin';
  const isCandidate = currentUser?.role === 'candidate' || currentUser?.role === 'admin';

  const [viewApplicantsPositionId, setViewApplicantsPositionId] = useState<number | null>(null);
  const [applicantsOpened, { open: openApplicants, close: closeApplicants }] = useDisclosure(false);
  const { data: applications, isLoading: appsLoading } = usePositionApplications(viewApplicantsPositionId ?? 0);

  const [createEditOpened, { open, close }] = useDisclosure(false);
  const [editPosition, setEditPosition] = useState<Position | null>(null);

  const [formValues, setFormValues] = useState({
    title: '',
    shortDescription: '',
    maxProjects: 3,
    attributeIds: [] as string[],
    projectTags: [] as string[],
  });
  const [rules, setRules] = useState<Rule[]>([]);

  const resetForm = () => {
    setFormValues({
      title: '',
      shortDescription: '',
      maxProjects: 3,
      attributeIds: [],
      projectTags: [],
    });
    setRules([]);
  };

  const openCreate = () => {
    setEditPosition(null);
    resetForm();
    open();
  };

  const ruleAttributes = (allAttrs ?? []).filter(
    (a) =>
      a.type !== 'image' &&
      !(a.isBuiltIn && ['First Name', 'Last Name', 'Personal Photo'].includes(a.name)),
  );

  const openEdit = (pos: Position) => {
    setEditPosition(pos);
    setFormValues({
      title: pos.title,
      shortDescription: pos.shortDescription,
      maxProjects: pos.maxProjects,
      attributeIds: pos.attributeIds?.map(String) ?? [],
      projectTags: pos.projectTags ?? [],
    });

    const rulesArray = Array.isArray(pos.accessRules)
      ? pos.accessRules
      : typeof pos.accessRules === 'string'
        ? JSON.parse(pos.accessRules)
        : [];
    setRules(rulesArray);
    open();
  };

  const handleSubmit = async () => {
    const accessRules = rules
      .filter((r) => r.attributeId && r.operator)
      .map((r) => ({
        attributeId: Number(r.attributeId),
        operator: r.operator,
        value: r.value,
      })) as ApiRule[];

    const payload = {
      title: formValues.title,
      shortDescription: formValues.shortDescription,
      accessRules,
      maxProjects: formValues.maxProjects,
      attributeIds: formValues.attributeIds.map(Number),
      projectTags: formValues.projectTags,
    };

    if (editPosition) {
      await updateMutation.mutateAsync({ id: editPosition.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    close();
  };

  const handleDelete = (id: number) => {
    if (confirm(t.projects.deleteConfirm)) deleteMutation.mutate(id);
  };

  const handleDuplicate = (id: number) => {
    duplicateMutation.mutate(id);
  };

  const attrOptions = (allAttrs ?? []).map((a) => ({
    value: String(a.id),
    label: a.name,
    type: a.type,
  }));

  const handleCreateCV = async (positionId: number) => {
    setSelectedPositionId(positionId);
    try {
      await createCvMutation.mutateAsync(positionId);
      toast.success(t.cvs.successCreate || 'CV created!', {
        action: {
          label: t.cvs.viewCv || 'View CV',
          onClick: () => router.push('/profile?tab=cvs'),
        },
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        '';
      if (message.includes('already have a CV')) {
        toast.error(t.cvs.alreadyApplied || 'You have already applied to this position.');
      } else if (message.includes('access requirements')) {
        toast.error(t.cvs.notQualified || 'You do not meet the requirements for this position.');
      } else {
        toast.error(t.cvs.errorCreate || 'Failed to create CV.');
      }
    } finally {
      setSelectedPositionId(null);
    }
  };

  return (
    <Container fluid>
      <Group justify="space-between" mb="md">
        <Title order={2}>{t.positions.title}</Title>
        {isRecruiterOrAdmin && (
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            {t.positions.create}
          </Button>
        )}
      </Group>

      <Table.ScrollContainer minWidth={600}>
          <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t.positions.title}</Table.Th>
              <Table.Th>{t.positions.attributes}</Table.Th>
              <Table.Th>{t.positions.tags}</Table.Th>
              {isCandidate && (
                <Table.Th w={120}>{t.cvs.apply || 'Apply'}</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && (
              <Table.Tr>
                <Table.Td colSpan={isCandidate ? 5 : 4}>
                  {t.attributes.loading}
                </Table.Td>
              </Table.Tr>
            )}
            {positions?.map((pos) => (
              <Table.Tr key={pos.id}>
                <Table.Td>
                  <Text fw={500}>{pos.title}</Text>
                  <Text size="xs" c="dimmed">
                    {pos.shortDescription}
                  </Text>
                </Table.Td>
                <Table.Td>{pos.attributeIds?.length ?? 0}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {pos.projectTags?.map((tag) => (
                      <Badge key={tag} size="sm" variant="light">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Table.Td>
                {isCandidate && (
                  <Table.Td>
                    <Button
                      size="xs"
                      onClick={() => handleCreateCV(pos.id)}
                      loading={
                        createCvMutation.isPending && selectedPositionId === pos.id
                      }
                    >
                      {t.cvs.create || 'Create CV'}
                    </Button>
                  </Table.Td>
                )}
                
                {isRecruiterOrAdmin && (
                  <Table.Td w={40}>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => openEdit(pos)}>
                          {t.common.edit}
                        </Menu.Item>
                        <Menu.Item leftSection={<IconCopy size={16} />} onClick={() => handleDuplicate(pos.id)}>
                          {t.common.duplicate}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconEye size={16} />}
                          onClick={() => {
                            setViewApplicantsPositionId(pos.id);
                            openApplicants();
                          }}
                        >
                          {t.positions.applicants} ({pos.candidateCount})
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => handleDelete(pos.id)}>
                          {t.common.delete}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                )}

              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Create / Edit Modal – only shown to recruiters/admins, but already guarded by condition */}
      <Modal
        opened={createEditOpened}
        onClose={close}
        title={
          editPosition ? t.positions.editTitle : t.positions.createTitle
        }
        size="lg"
      >
        <Stack>
          <TextInput
            label={t.positions.titleLabel}
            value={formValues.title}
            onChange={(e) =>
              setFormValues({ ...formValues, title: e.currentTarget.value })
            }
            required
          />
          <Textarea
            label={t.positions.shortDescription}
            value={formValues.shortDescription}
            onChange={(e) =>
              setFormValues({ ...formValues, shortDescription: e.currentTarget.value })
            }
            minRows={2}
          />

          <Text size="sm" fw={500}>
            {t.positions.accessRules}
          </Text>
          <Text size="xs" c="dimmed" mb="xs">
            {t.positions.accessRulesHint}
          </Text>
          <RuleBuilder rules={rules} onChange={setRules} attributes={ruleAttributes} />

          <MultiSelect
            label={t.positions.attributes}
            data={attrOptions.map((a) => ({ value: a.value, label: a.label }))}
            value={formValues.attributeIds}
            onChange={(vals) =>
              setFormValues({ ...formValues, attributeIds: vals })
            }
            searchable
            clearable
          />
          <TagsInput
            label={t.positions.tags}
            data={[]}
            value={formValues.projectTags}
            onChange={(vals) =>
              setFormValues({ ...formValues, projectTags: vals })
            }
            placeholder="e.g. Python, SQL"
          />
          <NumberInput
            label={t.positions.maxProjects}
            value={formValues.maxProjects}
            onChange={(val) =>
              setFormValues({ ...formValues, maxProjects: val as number })
            }
            min={1}
          />
          <Button
            onClick={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {editPosition ? t.attributes.save : t.positions.create}
          </Button>
        </Stack>
      </Modal>


      <Modal
          opened={applicantsOpened}
          onClose={closeApplicants}
          title={t.positions.applicants || 'Applicants'}
          size="lg"
        >
          {appsLoading ? (
            <Text>Loading...</Text>
          ) : applications && applications.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t.admin.name}</Table.Th>
                  <Table.Th>{t.admin.email}</Table.Th>
                  <Table.Th>{t.cvs.created}</Table.Th>
                  <Table.Th>CV</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {applications.map((app) => (
                  <Table.Tr key={app.cvId}>
                    <Table.Td>{app.candidateName}</Table.Td>
                    <Table.Td>{app.candidateEmail}</Table.Td>
                    <Table.Td>{new Date(app.createdAt).toLocaleDateString()}</Table.Td>
                    <Table.Td>
                      <ActionIcon
                        onClick={async () => {
                          const cv = await fetchAssembledCV(app.cvId);
                          generateCvPdf(cv);
                        }}
                      >
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text c="dimmed">{t.positions.noApplicants}</Text>
          )}
        </Modal>
    </Container>
  );
}