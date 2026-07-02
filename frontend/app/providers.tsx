'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { mantineTheme } from '@/theme';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
    </QueryClientProvider>
  );
}