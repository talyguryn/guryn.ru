import './globals.css';
import type { Metadata } from 'next';
import YandexMetrika from '@/app/components/yandexMetrika';
import { getHost } from '@/utils/host';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'Виталий Гурын',
  description: 'Проекты, заметки и статьи о том, как я изучаю IT',
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
