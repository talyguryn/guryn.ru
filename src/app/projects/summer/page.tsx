'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [mondaysCount, setMondaysCount] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState<number>(0);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    let summerStart = new Date(currentYear, 5, 1);

    if (today > summerStart) {
      summerStart = new Date(currentYear + 1, 5, 1);
    }

    let count = 0;
    const date = new Date(today);

    while (date < summerStart) {
      if (date.getDay() === 1) {
        count++;
      }
      date.setDate(date.getDate() + 1);
    }

    setMondaysCount(count);
  }, []);

  useEffect(() => {
    if (mondaysCount === 0) return;

    let current = 52;
    const decrement = Math.ceil((52 - mondaysCount) / 25);
    const interval = setInterval(() => {
      current -= decrement;
      if (current <= mondaysCount) {
        setDisplayCount(mondaysCount);
        clearInterval(interval);
      } else {
        setDisplayCount(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [mondaysCount]);

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-2'>
      <div className='text-gray-600'>До лета осталось</div>
      <div className='text-9xl font-bold'>{displayCount}</div>
      <div className='text-xl'>понедельников</div>
    </div>
  );
}