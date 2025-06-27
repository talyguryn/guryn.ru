import './globals.css';
import type { Metadata } from 'next';
import YandexMetrika from '@/components/yandexMetrika';

export const metadata: Metadata = {
  title: 'Taly Guryn',
  // description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <YandexMetrika />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
