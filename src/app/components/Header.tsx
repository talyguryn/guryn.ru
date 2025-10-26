import React from 'react';

const Header: React.FC<{}> = ({}) => (
  <header>
    <a className="flex items-center font-bold text-2xl not-underlined" href="/">
      <img
        src={`/ava.png`}
        alt=""
        className="w-10 h-10 mr-3 inline-block rounded-full object-cover"
      />
      Виталий Гурын
    </a>
  </header>
);

export default Header;
