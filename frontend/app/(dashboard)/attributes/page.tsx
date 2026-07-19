'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  TextInput,
  Select,
  Table,
  Group,
  Button,
  Modal,
  Stack,
  Badge,
  ActionIcon,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import {
  useAttributes,
  useCategories,
  useCreateAttribute,
  useUpdateAttribute,
  useDeleteAttribute,
} from '@/hooks/use-attributes';
import type { Attribute } from '@/lib/api/attributes';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AttributesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { data: attributes, isLoading } = useAttributes({
    categoryId: categoryFilter ? +categoryFilter : undefined,
    search: search || undefined,
  });
  const { data: categories } = useCategories();
  const createMutation = useCreateAttribute();
  const updateMutation = useUpdateAttribute();
  const deleteMutation = useDeleteAttribute();

  const [createEditOpened, { open: openCreateEdit, close: closeCreateEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const [editAttribute, setEditAttribute] = useState<Attribute | null>(null);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    type: 'string',
    categoryId: 0,
    options: '',
  });

  const resetForm = () =>
    setFormValues({ name: '', type: 'string', categoryId: 0, options: '' });

  const openCreate = () => {
    setEditAttribute(null);
    resetForm();
    openCreateEdit();
  };

  const openEdit = (attr: Attribute) => {
    setEditAttribute(attr);
    setFormValues({
      name: attr.name,
      type: attr.type,
      categoryId: attr.categoryId,
      options: attr.options ? JSON.stringify(attr.options) : '',
    });
    openCreateEdit();
  };

  const handleCreateEditSubmit = async () => {
    const payload = {
      name: formValues.name,
      type: formValues.type,
      categoryId: formValues.categoryId,
      options: formValues.options ? JSON.parse(formValues.options) : undefined,
    };

    if (editAttribute) {
      await updateMutation.mutateAsync({ id: editAttribute.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    closeCreateEdit();
  };

  const promptDelete = (attr: Attribute) => {
    setAttributeToDelete(attr);
    openDelete();
  };

  const confirmDelete = async () => {
    if (attributeToDelete) {
      await deleteMutation.mutateAsync(attributeToDelete.id);
    }
    closeDelete();
    setAttributeToDelete(null);
  };

  // translating seeded attributes
  const typeOptions = Object.entries(t.attributes.types).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions =
    categories?.map((c) => ({
      value: String(c.id),
      label: t.categories?.[c.name] ?? c.name,
    })) ?? [];

  return (
    <Container fluid>
      <Group justify="space-between" mb="md">
        <Title order={2}>{t.attributes.title}</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          {t.attributes.create}
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder={t.attributes.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: 250 }}
        />
        <Select
          placeholder={t.attributes.allCategories}
          data={categoryOptions}
          value={categoryFilter}
          onChange={setCategoryFilter}
          clearable
          style={{ width: 200 }}
        />
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t.attributes.name}</Table.Th>
            <Table.Th>{t.attributes.category}</Table.Th>
            <Table.Th>{t.attributes.type}</Table.Th>
            <Table.Th>{t.attributes.builtIn}</Table.Th>
            <Table.Th w={100}>{t.attributes.actions}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading && (
            <Table.Tr>
              <Table.Td colSpan={5}>{t.attributes.loading}</Table.Td>
            </Table.Tr>
          )}
          {attributes?.map((attr) => {
            const categoryName =
              categories?.find((c) => c.id === attr.categoryId)?.name;
            const translatedCategory = categoryName
              ? (t.categories?.[categoryName] ?? categoryName)
              : '-';
            const translatedType = t.attributes.types[attr.type] ?? attr.type;

            return (
              <Table.Tr key={attr.id}>
                <Table.Td>{attr.name}</Table.Td>
                <Table.Td>{translatedCategory}</Table.Td>
                <Table.Td>{translatedType}</Table.Td>
                <Table.Td>
                  {attr.isBuiltIn ? (
                    <Badge color="green">{t.attributes.builtInYes}</Badge>
                  ) : (
                    <Badge color="gray">{t.attributes.builtInNo}</Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" onClick={() => openEdit(attr)}>
                      <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => promptDelete(attr)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <Modal
        opened={createEditOpened}
        onClose={closeCreateEdit}
        title={
          editAttribute ? t.attributes.editTitle : t.attributes.createTitle
        }
      >
        <Stack>
          <TextInput
            label={t.attributes.attributeName}
            value={formValues.name}
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.currentTarget.value })
            }
            required
          />
          <Select
            label={t.attributes.category}
            data={categoryOptions}
            value={String(formValues.categoryId)}
            onChange={(val) =>
              setFormValues({ ...formValues, categoryId: val ? +val : 0 })
            }
            required
          />
          <Select
            label={t.attributes.type}
            data={typeOptions}
            value={formValues.type}
            onChange={(val) => val && setFormValues({ ...formValues, type: val })}
            required
          />
          {formValues.type === 'one_of_many' && (
            <TextInput
              label={t.attributes.optionsLabel}
              description={t.attributes.optionsDescription}
              value={formValues.options}
              onChange={(e) =>
                setFormValues({ ...formValues, options: e.currentTarget.value })
              }
            />
          )}
          <Button
            onClick={handleCreateEditSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {editAttribute ? t.attributes.save : t.attributes.create}
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title={t.attributes.deleteTitle}
        size="sm"
      >
        <Text mb="md">
          {t.attributes.deleteConfirm}{' '}
          <strong>{attributeToDelete?.name}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDelete}>
            {t.attributes.cancel}
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteMutation.isPending}
          >
            {t.attributes.delete}
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
