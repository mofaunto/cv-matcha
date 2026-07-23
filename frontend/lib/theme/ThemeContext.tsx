'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useMantineColorScheme } from '@mantine/core';
import { useCurrentUser, useUpdateProfile } from '@/hooks/use-user';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const { setColorScheme } = useMantineColorScheme();

  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (user?.theme === 'light' || user?.theme === 'dark') {
      setTheme(user.theme);
      setColorScheme(user.theme);
    }
  }, [user?.theme, setColorScheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setColorScheme(newTheme);
    updateProfile.mutate({ theme: newTheme });
  }, [theme, updateProfile, setColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
