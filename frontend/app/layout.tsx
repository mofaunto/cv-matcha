import React from 'react';
import '@mantine/core/styles.css';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { mantineTheme } from '@/theme';

export const metadata = {
  title: 'CV Matcha',
  description: 'Get matched to your dream job with auto generated CVs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
      </body>
    </html>
  );
}