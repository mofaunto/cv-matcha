'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { en } from '@/lib/i18n/locales/en';
import { ru } from '@/lib/i18n/locales/ru';
import type { Translations } from '@/lib/i18n/locales/en';
import { useCurrentUser, useUpdateProfile } from '@/hooks/use-user';

type Locale = 'en' | 'ru';

const locales: Record<Locale, Translations> = { en, ru };

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: en,
  setLocale: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const defaultLocale = useMemo(() => {
    if (user?.language === 'ru' || user?.language === 'en') {
      return user.language as Locale;
    }
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang === 'ru') return 'ru';
    }
    return 'en';
  }, [user]);

  const [chosenLocale, setChosenLocale] = useState<Locale | null>(null);
  const locale = chosenLocale ?? defaultLocale;

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setChosenLocale(newLocale);
      updateProfile.mutate(
        { language: newLocale },
        {
          onSuccess: () => {
            setChosenLocale(null);
          },
        }
      );
    },
    [updateProfile]
  );

  return (
    <LanguageContext.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};