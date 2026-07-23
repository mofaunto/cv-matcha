'use client';

import { useState } from 'react';
import {
  Avatar,
  Container,
  Title,
  Text,
  Group,
  Stack,
  TextInput,
  Button,
  Modal,
  Select,
  Card,
  ActionIcon,
  Checkbox,
  MultiSelect,
  Loader,
} from '@mantine/core';
import { IconTrash, IconPlus, IconUpload } from '@tabler/icons-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  useProfileAttributes,
  useAddProfileAttribute,
  useUpdateProfileAttributeValue,
  useRemoveProfileAttribute,
} from '@/hooks/use-profile-attributes';
import {
  useAttributes,
  useCategories,
} from '@/hooks/use-attributes';
import type { ProfileAttribute } from '@/lib/api/profile-attributes';
import type { Attribute } from '@/lib/api/attributes';

interface CloudinaryResult {
  event: string;
  info?: {
    secure_url?: string;
  };
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ProfileInfoTab() {
  const { t } = useLanguage();
  const { data: profileAttrs, isLoading: profileLoading } = useProfileAttributes();
  const addMutation = useAddProfileAttribute();
  const updateMutation = useUpdateProfileAttributeValue();
  const removeMutation = useRemoveProfileAttribute();
  const { data: allAttrs } = useAttributes({});
  const { data: categories } = useCategories();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);

  const attrMap = new Map<number, Attribute>(allAttrs?.map(a => [a.id, a]) ?? []);

  const builtInAttrs = profileAttrs?.filter(a => a.isBuiltIn) ?? [];
  const customAttrs = profileAttrs?.filter(a => !a.isBuiltIn) ?? [];

  const personalPhotoAttr = builtInAttrs.find(
    a => a.type === 'image' && a.name === 'Personal Photo',
  );
  const meAttrs = builtInAttrs.filter(a => a !== personalPhotoAttr);

  // Name initials for the avatar placeholder
  const firstNameAttr = builtInAttrs.find(a => a.name === 'First Name');
  const lastNameAttr = builtInAttrs.find(a => a.name === 'Last Name');
  const initials = [firstNameAttr?.valueString, lastNameAttr?.valueString]
    .filter(Boolean)
    .join(' ')
    .trim();

  const groupedCustom = customAttrs.reduce<Record<number, ProfileAttribute[]>>((acc, attr) => {
    if (!acc[attr.categoryId]) acc[attr.categoryId] = [];
    acc[attr.categoryId].push(attr);
    return acc;
  }, {});

  const existingIds = new Set(profileAttrs?.map(a => a.attributeId) ?? []);
  const availableAttrs = allAttrs?.filter(a => !existingIds.has(a.id)) ?? [];

  const handleAddAttributes = async () => {
    if (selectedAttributeIds.length === 0) return;
    const ids = selectedAttributeIds.map(Number);
    await Promise.all(ids.map(id => addMutation.mutateAsync(id)));
    setAddModalOpen(false);
    setSelectedAttributeIds([]);
  };

  const handleValueChange = async (attr: ProfileAttribute, value: Record<string, unknown>) => {
    try {
      await updateMutation.mutateAsync({ id: attr.id, version: attr.version, value });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const getValueField = (type: string): string => {
    switch (type) {
      case 'string': return 'valueString';
      case 'text': return 'valueText';
      case 'image': return 'valueImageUrl';
      case 'numeric': return 'valueNumeric';
      case 'date': return 'valueDate';
      case 'boolean': return 'valueBoolean';
      case 'one_of_many': return 'valueOption';
      default: return 'valueString';
    }
  };

  const getCurrentValue = (attr: ProfileAttribute) => {
    const field = getValueField(attr.type);
    switch (field) {
      case 'valueString':   return attr.valueString;
      case 'valueText':     return attr.valueText;
      case 'valueImageUrl': return attr.valueImageUrl;
      case 'valueNumeric':  return attr.valueNumeric;
      case 'valueDate':     return attr.valueDate;
      case 'valueBoolean':  return attr.valueBoolean;
      case 'valueOption':   return attr.valueOption;
      default:              return null;
    }
  };

  const renderValueEditor = (attr: ProfileAttribute) => {
    const field = getValueField(attr.type);
    const currentValue = getCurrentValue(attr);
    const definition = attrMap.get(attr.attributeId);
    const options = definition?.options ? JSON.parse(definition.options) : undefined;

    if (attr.type === 'boolean') {
      return (
        <Checkbox
          checked={!!currentValue}
          onChange={e => handleValueChange(attr, { [field]: e.currentTarget.checked })}
        />
      );
    }

    if (attr.type === 'one_of_many' && Array.isArray(options)) {
      return (
        <Select
          data={options.map((opt: string) => ({ value: opt, label: opt }))}
          value={(currentValue as string) ?? ''}
          onChange={val => handleValueChange(attr, { [field]: val ?? '' })}
          style={{ minWidth: 150 }}
        />
      );
    }

    return (
      <TextInput
        defaultValue={String(currentValue ?? '')}
        onBlur={e => {
          const raw = e.currentTarget.value;
          const newValue = attr.type === 'numeric' ? Number(raw) : raw;
          handleValueChange(attr, { [field]: newValue });
        }}
      />
    );
  };

  const openCloudinaryWidget = (attr: ProfileAttribute, field: string) => {
    if (typeof window !== 'undefined' && window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          cropping: true,
          showAdvancedOptions: false,
        },
        (error: unknown, result: CloudinaryResult) => {
          if (!error && result && result.event === 'success') {
            handleValueChange(attr, { [field]: result.info?.secure_url ?? '' });
          }
        }
      );
      widget.open();
    } else {
      alert('Cloudinary widget not loaded');
    }
  };

  if (profileLoading) return <Loader color="teal" type="dots" />;

  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <Title order={2}>{t.profile.title}</Title>
        <Group>
          {personalPhotoAttr && (
            <>
              <Avatar
                src={personalPhotoAttr.valueImageUrl ?? undefined}
                size={60}
                radius="xl"
                alt="Profile"
                color="initials"
                name={initials || '?'}
              >
                {!personalPhotoAttr.valueImageUrl ? (initials || '?') : null}
              </Avatar>
              <Button
                size="xs"
                leftSection={<IconUpload size={14} />}
                onClick={() => openCloudinaryWidget(personalPhotoAttr, 'valueImageUrl')}
              >
                {personalPhotoAttr.valueImageUrl ? 'Change' : 'Upload'}
              </Button>
            </>
          )}
          <Button leftSection={<IconPlus size={16} />} onClick={() => setAddModalOpen(true)}>
            {t.profile.addAttribute}
          </Button>
        </Group>
      </Group>

      <Card mb="xl" padding="md">
        <Text fw={600} mb="sm">{t.profile.me}</Text>
        <Stack>
          {meAttrs.map(attr => (
            <Group key={attr.id} justify="space-between" wrap="nowrap">
              <Text style={{ minWidth: 100 }}>{attr.name}</Text>
              <div style={{ flex: 1 }}>{renderValueEditor(attr)}</div>
            </Group>
          ))}
        </Stack>
      </Card>

      {customAttrs.length > 0 && (
        <Card padding="md">
            <Text fw={600} mb="sm">{t.profile.info}</Text>

            {Object.entries(groupedCustom).map(([catId, attrs]) => {
            const cat = categories?.find(c => c.id === Number(catId));
            return (
                <Card key={catId} mb="sm" padding="xs">
                <Text fw={500} mb="xs">{cat?.name ?? `Category ${catId}`}</Text>
                <Stack>
                    {attrs.map(attr => (
                    <Group key={attr.id} justify="space-between" wrap="nowrap">
                        <Text style={{ minWidth: 100 }}>{attr.name}</Text>
                        <div style={{ flex: 1 }}>{renderValueEditor(attr)}</div>
                        <ActionIcon color="red" onClick={() => removeMutation.mutate(attr.id)}>
                        <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                    ))}
                </Stack>
                </Card>
            );
            })}
        </Card>
    )}

      <Modal
        opened={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedAttributeIds([]);
        }}
        title={t.profile.addAttribute}
      >
        <MultiSelect
          data={availableAttrs.map(a => ({ value: String(a.id), label: a.name }))}
          value={selectedAttributeIds}
          onChange={setSelectedAttributeIds}
          placeholder={t.profile.selectAttribute}
          searchable
          clearable
        />
        <Button
          mt="md"
          onClick={handleAddAttributes}
          loading={addMutation.isPending}
          disabled={selectedAttributeIds.length === 0}
        >
          {t.profile.add}
        </Button>
      </Modal>
    </Container>
  );
}