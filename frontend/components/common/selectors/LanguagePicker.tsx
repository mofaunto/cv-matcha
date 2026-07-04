'use client';

import { Select } from '@mantine/core';

type Locale = 'en' | 'ru';

interface LanguagePickerProps {
  locale: string;
  onChange: (locale: Locale) => void;
}

export function LanguagePicker({ locale, onChange }: LanguagePickerProps) {
  return (
    <Select
      size="xs"
      value={locale}
      onChange={(val) => val && onChange(val as Locale)}
      data={[
        { value: 'en', label: 'English' },
        { value: 'ru', label: 'Русский' },
      ]}
      w={100}
    />
  );
}