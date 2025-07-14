import React from 'react';
import { getHost } from '@/utils/host';

const Header: React.FC<{}> = ({}) => (
  <header>
    <a className="flex items-center font-bold text-2xl" href="/">
      <img
        src={`${getHost()}/ava.png`}
        alt="Logo"
        className="w-10 h-10 mr-3 inline-block rounded-full object-cover"
      />
      Виталий Гурын
    </a>
  </header>
);

export default Header;
