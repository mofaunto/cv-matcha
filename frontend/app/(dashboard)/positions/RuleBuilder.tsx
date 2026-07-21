'use client';

import { ActionIcon, Group, Select, TextInput, Button } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import type { Attribute } from '@/lib/api/attributes';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface Rule {
    attributeId: number | string;
    operator: string;
    value: string;
}

interface RuleBuilderProps {
    rules: Rule[];
    onChange: (rules: Rule[]) => void;
    attributes: Attribute[];
}

const operatorLabels: Record<string, { value: string; label: string }[]> = {
    numeric: [
        { value: '>', label: 'greater than' },
        { value: '<', label: 'less than' },
        { value: '>=', label: 'at least' },
        { value: '<=', label: 'at most' },
        { value: '=', label: 'equals' },
        { value: '!=', label: 'not equals' },
    ],
    string: [
        { value: 'equals', label: 'equals' },
        { value: 'not_equals', label: 'not equals' },
    ],
    text: [
        { value: 'equals', label: 'equals' },
        { value: 'not_equals', label: 'not equals' },
    ],
    date: [
        { value: 'after', label: 'after' },
        { value: 'before', label: 'before' },
        { value: 'equals', label: 'on date' },
    ],
    boolean: [
        { value: 'true', label: 'is true' },
        { value: 'false', label: 'is false' },
    ],
    one_of_many: [
        { value: 'equals', label: 'equals' },
        { value: 'not_equals', label: 'not equals' },
    ],
    };

export default function RuleBuilder({ rules, onChange, attributes }: RuleBuilderProps) {
    const { t } = useLanguage();
    const addRule = () => {
        const firstAttribute = attributes[0];
        if (!firstAttribute) return;
        const defaultOperator = operatorLabels[firstAttribute.type]?.[0]?.value ?? '';
        const defaultValue = firstAttribute.type === 'boolean' ? defaultOperator : '';
        const newRule: Rule = {
            attributeId: String(firstAttribute.id),
            operator: defaultOperator,
            value: defaultValue,
        };
        onChange([...rules, newRule]);
    };

    const updateRule = (index: number, field: keyof Rule, val: string) => {
        const updated = rules.map((rule, i) => {
        if (i !== index) return rule;
        const newRule = { ...rule, [field]: val };

        if (field === 'attributeId') {
            const attr = attributes.find(a => String(a.id) === val);
            if (attr) {
            const firstOp = operatorLabels[attr.type]?.[0]?.value ?? '';
            newRule.operator = firstOp;

            if (attr.type === 'boolean') {
                newRule.value = firstOp;
            } else {
                newRule.value = '';
            }
            }
        } else if (field === 'operator') {
            const attr = attributes.find(a => String(a.id) === String(newRule.attributeId));
            if (attr?.type === 'boolean') {
            newRule.value = val;
            }
        }
        return newRule;
        });
        onChange(updated);
    };

    const removeRule = (index: number) => {
        const updated = rules.filter((_, i) => i !== index);
        onChange(updated);
    };

    const getAttributeById = (id: string | number) =>
        attributes.find(a => String(a.id) === String(id));

    return (
        <div>
            {rules.map((rule, index) => {
                const attr = getAttributeById(rule.attributeId);
                const operatorOptions = attr ? (operatorLabels[attr.type] ?? []) : [];
                const isBoolean = attr?.type === 'boolean';

                return (
                <Group key={index} mb="xs" wrap="nowrap" align="flex-end">
                    <Select
                    data={attributes.map(a => ({ value: String(a.id), label: a.name }))}
                    value={String(rule.attributeId)}
                    onChange={(val) => updateRule(index, 'attributeId', val ?? '')}
                    placeholder="Attribute"
                    style={{ width: 200 }}
                    />
                    {operatorOptions.length > 0 && (
                    <Select
                        data={operatorOptions}
                        value={rule.operator}
                        onChange={(val) => updateRule(index, 'operator', val ?? '')}
                        style={{ width: 130 }}
                    />
                    )}
                    {!isBoolean && (
                    <TextInput
                        value={rule.value}
                        onChange={(e) => updateRule(index, 'value', e.currentTarget.value)}
                        placeholder="Value"
                        style={{ width: 150 }}
                    />
                    )}
                    <ActionIcon color="red" onClick={() => removeRule(index)}>
                    <IconTrash size={16} />
                    </ActionIcon>
                </Group>
                );
            })}
            {attributes.length > 0 && (
                <Button leftSection={<IconPlus size={16} />} onClick={addRule} variant="light" size="xs">
                    {t.positions.addRuleButton}
                </Button>
            )}
        </div>
    );
}