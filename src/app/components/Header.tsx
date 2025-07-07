import React from 'react';

const Header: React.FC<{}> = ({}) => (
  <header className="mb-4">
    <nav className="flex items-center justify-between">
      <ul className="flex">
        <li className="font-bold">
          <a className="p-4 pl-0" href="/">
            Виталий Гурын
          </a>
        </li>
        {/* <li>
          <a className="hover:underlined p-4" href="/notes">
            Заметки
          </a>
        </li>
        <li>
          <a className="hover:underlined p-4" href="/notes">
            Проекты
          </a>
        </li> */}
      </ul>

      <a
        className="text-blue-500 underlined p-4 pr-0"
        href="https://t.me/guryn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="">Связаться в Телеграм</span>
      </a>
    </nav>
  </header>
);

export default Header;
