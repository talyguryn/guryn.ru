import './globals.css';
import type { Metadata } from 'next';
import YandexMetrika from '@/app/components/yandexMetrika';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'Виталий Гурын',
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
      <body className={`antialiased pb-32`}>
        <div className="container mx-auto px-4">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
