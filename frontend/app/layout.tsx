import React from 'react';
import '@mantine/core/styles.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { Providers } from './providers';
import Script from 'next/dist/client/script';

export const metadata = {
  title: 'CV Matcha',
  description: 'Get matched to your dream job with auto generated CVs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <ColorSchemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}