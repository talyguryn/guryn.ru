'use client';

import React, { useState } from 'react';

function getCost(price: number | null, value: number | null) {
  const cost = price && value ? price / value : NaN;
  return isFinite(cost) && !isNaN(cost) ? cost.toFixed(2) : '0.00';
}

export default function CostPerUnitPage() {
  const [price, setPrice] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [history, setHistory] = useState<
    { price: number; value: number; cost: string }[]
  >([]);
  const [historyIsLocked, setHistoryIsLocked] = useState(true);

  const cost = getCost(price, value);

  React.useEffect(() => {
    setHistoryIsLocked(false);
  }, [price, value]);

  const saveToHistory = () => {
    if (!price || !value) return;
    if (historyIsLocked) return;
    setHistory((h) => [...h, { price, value, cost }]);
    setHistoryIsLocked(true);
  };

  return (
    <div className="relative mx-auto mt-12 w-72 flex flex-col items-center font-sans bg-white dark:bg-black">
      <div
        className="my-5 text-center cursor-pointer select-none"
        onClick={saveToHistory}
      >
        <div className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">
          Цена за единицу
        </div>
        <div className="text-6xl font-semibold text-black dark:text-gray-100 tracking-tight">
          {cost}
        </div>
      </div>

      <div className="flex w-full items-center justify-between my-2">
        <label
          className="text-sm text-gray-500 dark:text-gray-400"
          htmlFor="price"
        >
          Цена
        </label>
        <input
          id="price"
          className="p-1 border border-gray-300 dark:border-gray-700 rounded text-2xl w-36 text-right bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:outline-none"
          type="number"
          placeholder="29.99"
          value={price ?? ''}
          onChange={(e) =>
            setPrice(e.target.value ? parseFloat(e.target.value) : null)
          }
        />
      </div>

      <div className="flex w-full items-center justify-between my-2">
        <label
          className="text-sm text-gray-500 dark:text-gray-400"
          htmlFor="value"
        >
          Вес / Объем / Количество
        </label>
        <input
          id="value"
          className="p-1 border border-gray-300 dark:border-gray-700 rounded text-2xl w-36 text-right bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:outline-none"
          type="number"
          placeholder="2"
          value={value ?? ''}
          onChange={(e) =>
            setValue(e.target.value ? parseFloat(e.target.value) : null)
          }
        />
      </div>

      <div className="mt-8 w-full">
        {history
          .slice()
          .reverse()
          .map((item, idx) => (
            <div
              className="flex justify-between items-center my-2 text-black dark:text-gray-100 text-base"
              key={idx}
            >
              <span>{item.cost} за единицу</span>
              <span className="text-gray-400 dark:text-gray-500 text-sm">
                {item.value} за {item.price}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
