'use client';

import Book, { BookProps } from '@/app/components/Book';

const sizeCoef = 2.8;
const books: BookProps[] = [
  {
    name: 'Модульные системы с графическом дизайне',
    author: 'Йозеф Мюллер-Брокманн',
    description:
      'Книга представляет собой подробное пособие по использованию модульной системы в графическом дизайне и оформительской работе. Автор на примерах рассказывает о применении модульной сетки в дизайне книг, периодических изданий, корпоративной полиграфии, выставочных пространств, приводит исторические образцы архитектуры, типографики и дизайна и убедительно доказывает универсальность и эффективность модульного метода проектирования.',
    image: 'https://telegra.ph/file/ebaa9228090f28490ee65.jpg',
    textColor: '#230a09',
    backgroundColor: '#ff4819',
    size: {
      height: 290 * sizeCoef,
      width: 220 * sizeCoef,
      thickness: 12 * sizeCoef,
    },
  },
  {
    name: 'Дизайн привычных вещей',
    author: 'Дон Норман',
    description:
      'Книга о том, как создавать продукты, которые будут понятны и удобны для пользователей.',
    image: 'https://telegra.ph/file/dc3174263ea485a7b2428.jpg',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    size: {
      height: 234 * sizeCoef,
      width: 162 * sizeCoef,
      thickness: 19 * sizeCoef,
    },
  },
  {
    name: 'Сначала скажите «Нет»',
    author: 'Джим Кэмп',
    // description: "Книга о том, как сделать меньше, чтобы добиться большего.",
    image: 'https://telegra.ph/file/4f626f9ce334e08d8f5d0.jpg',
    textColor: '#000000',
    backgroundColor: '#9f9164',
    size: {
      height: 216 * sizeCoef,
      width: 146 * sizeCoef,
      thickness: 16 * sizeCoef,
    },
  },
  {
    name: 'Искусство цвета',
    author: 'Иттен Иоханнес',
    image: 'https://telegra.ph/file/2d1e69670d099fd6aa5bb.jpg',
    textColor: '#000000',
    backgroundColor: '#e30414',
    size: {
      height: 210 * sizeCoef,
      width: 210 * sizeCoef,
      thickness: 12 * sizeCoef,
    },
  },
  {
    name: 'Искусство Формы',
    author: 'Иттен Иоханнес',
    image: 'https://telegra.ph/file/9ffc2ae09dd0ac2e9bb9d.jpg',
    textColor: '#ffffff',
    backgroundColor: '#231d0e',
    size: {
      height: 210 * sizeCoef,
      width: 210 * sizeCoef,
      thickness: 12 * sizeCoef,
    },
  },

  {
    name: 'Облик книги',
    author: 'Ян Чихольд',
    image: 'https://telegra.ph/file/5387625c2f0ce470415f3.jpg',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    size: {
      height: 225 * sizeCoef,
      width: 152 * sizeCoef,
      thickness: 20 * sizeCoef,
    },
  },

  {
    name: 'Найти идею',
    author: 'Генрих Альтшуллер',
    image: 'https://telegra.ph/file/90126ecec38d586d246fc.jpg',
    textColor: '#000000',
    backgroundColor: '#b62642',
    size: {
      height: 220 * sizeCoef,
      width: 150 * sizeCoef,
      thickness: 30 * sizeCoef,
    },
  },
];

const TutfeBooks: BookProps[] = [
  {
    name: 'The Visual Display of Quantitative Information',
    author: 'Edward R. Tufte',
    image: 'https://telegra.ph/file/fe3bdeb34b8e5ab265a23.jpg',
    textColor: '#000000',
    backgroundColor: '#fdf5cd',
    size: {
      height: 279 * sizeCoef,
      width: 228 * sizeCoef,
      thickness: 25 * sizeCoef,
    },
  },
  {
    name: 'Envisioning Information',
    author: 'Edward R. Tufte',
    image: 'https://telegra.ph/file/ff0f5a3b2ed2a70083f69.jpg',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    size: {
      height: 279 * sizeCoef,
      width: 228 * sizeCoef,
      thickness: 25 * sizeCoef,
    },
  },
  {
    name: 'Visual Explanations',
    author: 'Edward R. Tufte',
    image: 'https://telegra.ph/file/38e8d9fcd260d258721ba.jpg',
    textColor: '#000000',
    backgroundColor: '#efe8d3',
    size: {
      height: 279 * sizeCoef,
      width: 228 * sizeCoef,
      thickness: 25 * sizeCoef,
    },
  },
  {
    name: 'Beautiful Evidence',
    author: 'Edward R. Tufte',
    image: 'https://telegra.ph/file/6a1849c617b8d2fd7d7c7.jpg',
    textColor: '#ffffff',
    backgroundColor: '#477621',
    size: {
      height: 279 * sizeCoef,
      width: 228 * sizeCoef,
      thickness: 25 * sizeCoef,
    },
  },
];

export default function Page() {
  return (
    <main className="">
      <h1 className="text-4xl font-semibold mb-4">Книжная полка</h1>

      <div className="flex justify-start items-end overflow-x-scroll max-w-full">
        {books.map((book) => (
          <Book
            key={book.name}
            name={book.name}
            author={book.author}
            description={book.description}
            image={book.image}
            textColor={book.textColor}
            backgroundColor={book.backgroundColor}
            size={book.size}
          />
        ))}
      </div>
      <div className="flex justify-start items-end overflow-x-scroll max-w-full">
        {TutfeBooks.map((book) => (
          <Book
            key={book.name}
            name={book.name}
            author={book.author}
            description={book.description}
            image={book.image}
            textColor={book.textColor}
            backgroundColor={book.backgroundColor}
            size={book.size}
          />
        ))}
      </div>
    </main>
  );
}
