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
      <body className={`antialiased pb-32`}>
        <div className="container max-w-5xl mx-auto px-4 pt-10 md:pt-40">
          <main className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
            <div className="col-span-2 mb-4 md:min-h-48">
              <Header />
            </div>
            <aside className="md:sticky md:top-4 col-span-1 pb-8">
              <ul className="grid grid-cols-1 gap-x-6 gap-y-2 font-semibold text-lg">
                <li>
                  <a
                    className="text-blue-500 hover:text-blue-900 not-underlined"
                    href="https://t.me/guryn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Написать мне
                  </a>
                </li>
                {/* <li>
                  <a
                    className="text-gray-500 hover:text-gray-900 not-underlined"
                    href="/projects"
                  >
                    Проекты
                  </a>
                </li> */}
                <li>
                  <a
                    className="text-gray-500 hover:text-gray-900 not-underlined"
                    href="/notes"
                  >
                    Заметки
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-gray-900 not-underlined"
                    href="https://github.com/talyguryn"
                    target="_blank"
                  >
                    Гитхаб
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-gray-900 not-underlined"
                    href="https://boosty.to/talyguryn"
                    target="_blank"
                  >
                    Бусти
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-gray-900 not-underlined"
                    href="https://youtube.com/@talyguryn"
                    target="_blank"
                  >
                    Ютуб
                  </a>
                </li>
              </ul>
            </aside>

            <div className="col-span-2">{children}</div>
          </main>
          <footer className="mt-8 text-sm text-gray-500"></footer>
        </div>
      </body>
    </html>
  );
}
