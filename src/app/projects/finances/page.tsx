'use client';

import React, { useState } from 'react';

function getCost(price: number | null, apy: number | null) {
  const cost = price && apy ? price * (apy / 1200) : NaN;

  return isFinite(cost) && !isNaN(cost) ? cost.toFixed(2) : '0.00';
}

export default function Page() {
  const [price, setPrice] = useState<number | null>(4000);
  const [apy, setApy] = useState<number | null>(15);
  const [goal, setGoal] = useState<number | null>(5000);
  const [mrr, setMrr] = useState<number>(0);
  const [history, setHistory] = useState<
    { price: number; apy: number; cost: string }[]
  >([]);
  const [historyIsLocked, setHistoryIsLocked] = useState(true);

  const cost = getCost(price, apy);

  React.useEffect(() => {
    setHistoryIsLocked(false);

    // const monthlyEarnings = price && apy ? (price * apy) / 1200 : 0;
    setMrr(price && apy ? (price * apy) / 1200 : 0);
  }, [price, apy]);

  const saveToHistory = () => {
    if (!price || !apy) return;
    if (historyIsLocked) return;
    setHistory((h) => [...h, { price, apy, cost }]);
    setHistoryIsLocked(true);
  };

  return (
    <div className="relative mx-auto mt-12 w-72 flex flex-col items-center font-sans bg-white dark:bg-black">
      <div
        className="my-5 text-center cursor-pointer select-none"
        onClick={saveToHistory}
      >
        <div className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">
          Процентами в месяц придет
        </div>
        <div className="text-6xl font-semibold text-black dark:text-gray-100 tracking-tight">
          {cost}
        </div>

        <div className="text-base font-medium text-gray-500 dark:text-gray-400 mb-1 mt-4">
          {goal} наберется за{' '}
          {price && apy && goal ? Math.ceil(goal / mrr) : '0'} месяцев
        </div>
      </div>

      <div className="flex w-full items-center justify-between my-2">
        <label
          className="text-sm text-gray-500 dark:text-gray-400"
          htmlFor="price"
        >
          Savings
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
          htmlFor="apy"
        >
          APY
        </label>
        <input
          id="apy"
          className="p-1 border border-gray-300 dark:border-gray-700 rounded text-2xl w-36 text-right bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:outline-none"
          type="number"
          placeholder="2"
          value={apy ?? ''}
          onChange={(e) =>
            setApy(e.target.value ? parseFloat(e.target.value) : null)
          }
        />
      </div>

      <div className="flex w-full items-center justify-between my-2">
        <label
          className="text-sm text-gray-500 dark:text-gray-400"
          htmlFor="apy"
        >
          Goal
        </label>
        <input
          id="goal"
          className="p-1 border border-gray-300 dark:border-gray-700 rounded text-2xl w-36 text-right bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:outline-none"
          type="number"
          placeholder="2"
          value={goal ?? ''}
          onChange={(e) =>
            setGoal(e.target.value ? parseFloat(e.target.value) : null)
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
                {item.apy} за {item.price}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
