import '@/app/globals.css';
import Header from '../Header';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container max-w-5xl mx-auto px-4 pt-10 md:pt-40 pb-32">
      <main className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6">
        <div className="col-span-2 mb-4 md:min-h-48">
          <Header />
        </div>
        <aside className="md:sticky md:top-4 col-span-1 pb-8">
          <nav className="grid grid-cols-1 gap-x-6 gap-y-2 font-semibold text-lg">
            <a
              className="text-blue-500 hover:text-blue-900 not-underlined"
              href="https://t.me/guryn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Написать мне
            </a>
            <a
              className="text-gray-500 hover:text-gray-900 not-underlined"
              href="/notes"
            >
              Заметки
            </a>
            <a
              className="text-gray-500 hover:text-gray-900 not-underlined"
              href="https://github.com/talyguryn"
              target="_blank"
            >
              Гитхаб
            </a>
            <a
              className="text-gray-500 hover:text-gray-900 not-underlined"
              href="https://boosty.to/talyguryn"
              target="_blank"
            >
              Бусти
            </a>
            <a
              className="text-gray-500 hover:text-gray-900 not-underlined"
              href="https://youtube.com/@talyguryn"
              target="_blank"
            >
              Ютуб
            </a>
          </nav>
        </aside>

        <div className="col-span-2">{children}</div>
      </main>
      <footer className="mt-8 text-sm text-gray-500"></footer>
    </div>
  );
}
